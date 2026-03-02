import { Pool } from 'pg';
import { SupplierDataSource } from '../../domain/datasources/supplier.datasource';
import { CreateSupplierDto, UpdateSupplierDto } from '../../domain/dtos/suppliers/supplier.dto';
import { SupplierEntity } from '../../domain/entities/supplier.entity';
import { CustomError } from '../../domain/errors/custom.error';
import { SupplierMapper } from '../mappers/domain.mappers';

export class SupplierPostgresDataSourceImpl implements SupplierDataSource {
  constructor(private readonly pool: Pool) { }

  async create(dto: CreateSupplierDto): Promise<SupplierEntity> {
    const result = await this.pool.query(
      'INSERT INTO suppliers (name, contact_name, phone, email, address) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [dto.name, dto.contactName ?? null, dto.phone ?? null, dto.email ?? null, dto.address ?? null],
    );
    return SupplierMapper.fromRow(result.rows[0]);
  }

  async getAll(): Promise<SupplierEntity[]> {
    const result = await this.pool.query('SELECT * FROM suppliers WHERE is_active = true ORDER BY name');
    return result.rows.map(SupplierMapper.fromRow);
  }

  async getById(id: number): Promise<SupplierEntity> {
    const result = await this.pool.query('SELECT * FROM suppliers WHERE id = $1', [id]);
    if (result.rows.length === 0) throw CustomError.notFound('Supplier not found');
    return SupplierMapper.fromRow(result.rows[0]);
  }

  async update(id: number, dto: UpdateSupplierDto): Promise<SupplierEntity> {
    await this.getById(id);
    const fields: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (dto.name) { fields.push(`name = $${idx++}`); values.push(dto.name); }
    if (dto.contactName !== undefined) { fields.push(`contact_name = $${idx++}`); values.push(dto.contactName); }
    if (dto.phone !== undefined) { fields.push(`phone = $${idx++}`); values.push(dto.phone); }
    if (dto.email !== undefined) { fields.push(`email = $${idx++}`); values.push(dto.email); }
    if (dto.address !== undefined) { fields.push(`address = $${idx++}`); values.push(dto.address); }

    values.push(id);
    await this.pool.query(`UPDATE suppliers SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`, values);
    return this.getById(id);
  }

  async deactivate(id: number): Promise<SupplierEntity> {
    const result = await this.pool.query(
      'UPDATE suppliers SET is_active = false WHERE id = $1 RETURNING *', [id],
    );
    if (result.rows.length === 0) throw CustomError.notFound('Supplier not found');
    return SupplierMapper.fromRow(result.rows[0]);
  }
}
