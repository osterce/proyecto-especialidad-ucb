import { Pool } from 'pg';
import { WarehouseDataSource } from '../../domain/datasources/warehouse.datasource';
import { CreateWarehouseDto, UpdateWarehouseDto } from '../../domain/dtos/warehouses/warehouse.dto';
import { WarehouseEntity } from '../../domain/entities/warehouse.entity';
import { CustomError } from '../../domain/errors/custom.error';
import { WarehouseMapper } from '../mappers/domain.mappers';

export class WarehousePostgresDataSourceImpl implements WarehouseDataSource {
  constructor(private readonly pool: Pool) { }

  async create(dto: CreateWarehouseDto): Promise<WarehouseEntity> {
    const result = await this.pool.query(
      'INSERT INTO warehouses (name, location, description) VALUES ($1, $2, $3) RETURNING *',
      [dto.name, dto.location ?? null, dto.description ?? null],
    );
    return WarehouseMapper.fromRow(result.rows[0]);
  }

  async getAll(isActive?: boolean): Promise<WarehouseEntity[]> {
    let query = 'SELECT * FROM warehouses';
    const values: any[] = [];

    if (isActive !== undefined) {
      query += ' WHERE is_active = $1';
      values.push(isActive);
    }

    query += ' ORDER BY name';
    const result = await this.pool.query(query, values);
    return result.rows.map(WarehouseMapper.fromRow);
  }

  async getById(id: number): Promise<WarehouseEntity> {
    const result = await this.pool.query('SELECT * FROM warehouses WHERE id = $1', [id]);
    if (result.rows.length === 0) throw CustomError.notFound('Warehouse not found');
    return WarehouseMapper.fromRow(result.rows[0]);
  }

  async update(id: number, dto: UpdateWarehouseDto): Promise<WarehouseEntity> {
    await this.getById(id);
    const fields: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (dto.name) { fields.push(`name = $${idx++}`); values.push(dto.name); }
    if (dto.location !== undefined) { fields.push(`location = $${idx++}`); values.push(dto.location); }
    if (dto.description !== undefined) { fields.push(`description = $${idx++}`); values.push(dto.description); }

    values.push(id);
    const result = await this.pool.query(
      `UPDATE warehouses SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`, values,
    );
    return WarehouseMapper.fromRow(result.rows[0]);
  }

  async deactivate(id: number): Promise<WarehouseEntity> {
    const result = await this.pool.query(
      'UPDATE warehouses SET is_active = false WHERE id = $1 RETURNING *', [id],
    );
    if (result.rows.length === 0) throw CustomError.notFound('Warehouse not found');
    return WarehouseMapper.fromRow(result.rows[0]);
  }

  async activate(id: number): Promise<WarehouseEntity> {
    const result = await this.pool.query(
      'UPDATE warehouses SET is_active = true WHERE id = $1 RETURNING *', [id],
    );
    if (result.rows.length === 0) throw CustomError.notFound('Warehouse not found');
    return WarehouseMapper.fromRow(result.rows[0]);
  }
}
