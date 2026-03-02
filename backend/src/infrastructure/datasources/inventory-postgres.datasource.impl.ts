import { Pool } from 'pg';
import { InventoryDataSource, InventoryFilters } from '../../domain/datasources/inventory.datasource';
import { InventoryEntity } from '../../domain/entities/inventory.entity';
import { InventoryMapper } from '../mappers/domain.mappers';

const INVENTORY_SELECT = `
  SELECT i.*, p.name as product_name, p.sku as product_sku, p.min_stock,
         w.name as warehouse_name
  FROM inventory i
  JOIN products p ON i.product_id = p.id
  JOIN warehouses w ON i.warehouse_id = w.id
`;

export class InventoryPostgresDataSourceImpl implements InventoryDataSource {
  constructor(private readonly pool: Pool) { }

  async getAll(filters?: InventoryFilters): Promise<InventoryEntity[]> {
    const conditions: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (filters?.productId) { conditions.push(`i.product_id = $${idx++}`); values.push(filters.productId); }
    if (filters?.warehouseId) { conditions.push(`i.warehouse_id = $${idx++}`); values.push(filters.warehouseId); }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const result = await this.pool.query(`${INVENTORY_SELECT} ${where} ORDER BY p.name`, values);
    return result.rows.map(InventoryMapper.fromRow);
  }

  async getAlerts(): Promise<InventoryEntity[]> {
    const result = await this.pool.query(
      `${INVENTORY_SELECT} WHERE i.stock_quantity <= p.min_stock ORDER BY i.stock_quantity ASC`,
    );
    return result.rows.map(InventoryMapper.fromRow);
  }

  async getStockForUpdate(productId: number, warehouseId: number): Promise<number> {
    const result = await this.pool.query(
      'SELECT stock_quantity FROM inventory WHERE product_id = $1 AND warehouse_id = $2',
      [productId, warehouseId],
    );
    return result.rows.length > 0 ? (result.rows[0].stock_quantity as number) : 0;
  }

  async upsert(productId: number, warehouseId: number, quantity: number): Promise<InventoryEntity> {
    const result = await this.pool.query(
      `INSERT INTO inventory (product_id, warehouse_id, stock_quantity, last_updated)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (product_id, warehouse_id)
       DO UPDATE SET stock_quantity = inventory.stock_quantity + $3, last_updated = NOW()
       RETURNING *`,
      [productId, warehouseId, quantity],
    );
    const row = result.rows[0];
    // refetch with joins for full data
    const full = await this.pool.query(`${INVENTORY_SELECT} WHERE i.id = $1`, [row.id]);
    return InventoryMapper.fromRow(full.rows[0]);
  }

  async decrementStock(productId: number, warehouseId: number, quantity: number): Promise<InventoryEntity> {
    const result = await this.pool.query(
      `UPDATE inventory SET stock_quantity = stock_quantity - $3, last_updated = NOW()
       WHERE product_id = $1 AND warehouse_id = $2
       RETURNING *`,
      [productId, warehouseId, quantity],
    );
    const row = result.rows[0];
    const full = await this.pool.query(`${INVENTORY_SELECT} WHERE i.id = $1`, [row.id]);
    return InventoryMapper.fromRow(full.rows[0]);
  }
}
