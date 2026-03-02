import { Pool } from 'pg';
import { MovementDataSource, MovementFilters } from '../../domain/datasources/movement.datasource';
import { CreateMovementDto } from '../../domain/dtos/movements/movement.dto';
import { MovementEntity } from '../../domain/entities/movement.entity';
import { CustomError } from '../../domain/errors/custom.error';
import { MovementMapper } from '../mappers/domain.mappers';

const MOVEMENT_SELECT = `
  SELECT m.*,
    p.name as product_name,
    w.name as warehouse_name,
    s.name as supplier_name,
    u.name as created_by_name
  FROM movements m
  JOIN products p ON m.product_id = p.id
  JOIN warehouses w ON m.warehouse_id = w.id
  LEFT JOIN suppliers s ON m.supplier_id = s.id
  LEFT JOIN users u ON m.created_by = u.id
`;

export class MovementPostgresDataSourceImpl implements MovementDataSource {
  constructor(private readonly pool: Pool) { }

  async createEntrada(dto: CreateMovementDto, userId: number): Promise<MovementEntity> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Insert movement
      const mvResult = await client.query(
        `INSERT INTO movements (product_id, warehouse_id, supplier_id, type, quantity, unit_price, reference, notes, created_by)
         VALUES ($1, $2, $3, 'ENTRADA', $4, $5, $6, $7, $8) RETURNING id`,
        [dto.productId, dto.warehouseId, dto.supplierId ?? null, dto.quantity, dto.unitPrice, dto.reference ?? null, dto.notes ?? null, userId],
      );

      // 2. Upsert inventory (increment stock)
      await client.query(
        `INSERT INTO inventory (product_id, warehouse_id, stock_quantity, last_updated)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (product_id, warehouse_id)
         DO UPDATE SET stock_quantity = inventory.stock_quantity + $3, last_updated = NOW()`,
        [dto.productId, dto.warehouseId, dto.quantity],
      );

      await client.query('COMMIT');

      // 3. Return with joined data
      const movId = mvResult.rows[0].id as number;
      const full = await this.pool.query(`${MOVEMENT_SELECT} WHERE m.id = $1`, [movId]);
      return MovementMapper.fromRow(full.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async createSalida(dto: CreateMovementDto, userId: number): Promise<MovementEntity> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Check stock (with FOR UPDATE to prevent race conditions)
      const stockResult = await client.query(
        'SELECT stock_quantity FROM inventory WHERE product_id = $1 AND warehouse_id = $2 FOR UPDATE',
        [dto.productId, dto.warehouseId],
      );

      const currentStock = stockResult.rows.length > 0 ? (stockResult.rows[0].stock_quantity as number) : 0;
      if (currentStock < dto.quantity) {
        throw CustomError.badRequest(
          `Insufficient stock. Available: ${currentStock}, Requested: ${dto.quantity}`,
        );
      }

      // 2. Insert movement
      const mvResult = await client.query(
        `INSERT INTO movements (product_id, warehouse_id, supplier_id, type, quantity, unit_price, reference, notes, created_by)
         VALUES ($1, $2, NULL, 'SALIDA', $3, $4, $5, $6, $7) RETURNING id`,
        [dto.productId, dto.warehouseId, dto.quantity, dto.unitPrice, dto.reference ?? null, dto.notes ?? null, userId],
      );

      // 3. Decrement inventory
      await client.query(
        `UPDATE inventory SET stock_quantity = stock_quantity - $3, last_updated = NOW()
         WHERE product_id = $1 AND warehouse_id = $2`,
        [dto.productId, dto.warehouseId, dto.quantity],
      );

      await client.query('COMMIT');

      const movId = mvResult.rows[0].id as number;
      const full = await this.pool.query(`${MOVEMENT_SELECT} WHERE m.id = $1`, [movId]);
      return MovementMapper.fromRow(full.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getAll(filters?: MovementFilters): Promise<MovementEntity[]> {
    const conditions: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (filters?.productId) { conditions.push(`m.product_id = $${idx++}`); values.push(filters.productId); }
    if (filters?.warehouseId) { conditions.push(`m.warehouse_id = $${idx++}`); values.push(filters.warehouseId); }
    if (filters?.type) { conditions.push(`m.type = $${idx++}`); values.push(filters.type); }
    if (filters?.from) { conditions.push(`m.created_at >= $${idx++}`); values.push(filters.from); }
    if (filters?.to) { conditions.push(`m.created_at <= $${idx++}`); values.push(filters.to); }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const result = await this.pool.query(`${MOVEMENT_SELECT} ${where} ORDER BY m.created_at DESC`, values);
    return result.rows.map(MovementMapper.fromRow);
  }
}
