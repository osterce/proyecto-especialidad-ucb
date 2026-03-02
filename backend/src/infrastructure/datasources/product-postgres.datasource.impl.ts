import { Pool } from 'pg';
import { ProductDataSource } from '../../domain/datasources/product.datasource';
import { CreateProductDto, UpdateProductDto } from '../../domain/dtos/products/product.dto';
import { ProductEntity } from '../../domain/entities/product.entity';
import { CustomError } from '../../domain/errors/custom.error';
import { ProductMapper } from '../mappers/domain.mappers';

const PRODUCT_SELECT = `
  SELECT p.*, c.name as category_name
  FROM products p
  LEFT JOIN categories c ON p.category_id = c.id
`;

export class ProductPostgresDataSourceImpl implements ProductDataSource {
  constructor(private readonly pool: Pool) { }

  async create(dto: CreateProductDto): Promise<ProductEntity> {
    const skuExists = await this.pool.query('SELECT id FROM products WHERE sku = $1', [dto.sku]);
    if (skuExists.rows.length > 0) throw CustomError.conflict(`SKU '${dto.sku}' already exists`);

    const result = await this.pool.query(
      `INSERT INTO products (name, sku, description, category_id, unit_price, min_stock)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [dto.name, dto.sku, dto.description ?? null, dto.categoryId ?? null, dto.unitPrice, dto.minStock],
    );
    // re-fetch with category join
    return this.getById(result.rows[0].id as number);
  }

  async getAll(isActive?: boolean): Promise<ProductEntity[]> {
    const where = isActive !== undefined ? `WHERE p.is_active = ${isActive}` : '';
    const result = await this.pool.query(`${PRODUCT_SELECT} ${where} ORDER BY p.name`);
    return result.rows.map(ProductMapper.fromRow);
  }

  async getById(id: number): Promise<ProductEntity> {
    const result = await this.pool.query(`${PRODUCT_SELECT} WHERE p.id = $1`, [id]);
    if (result.rows.length === 0) throw CustomError.notFound('Product not found');
    return ProductMapper.fromRow(result.rows[0]);
  }

  async update(id: number, dto: UpdateProductDto): Promise<ProductEntity> {
    await this.getById(id);
    const fields: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (dto.name) { fields.push(`name = $${idx++}`); values.push(dto.name); }
    if (dto.sku) {
      const skuExists = await this.pool.query('SELECT id FROM products WHERE sku = $1 AND id != $2', [dto.sku, id]);
      if (skuExists.rows.length > 0) throw CustomError.conflict(`SKU '${dto.sku}' already exists`);
      fields.push(`sku = $${idx++}`); values.push(dto.sku);
    }
    if (dto.description !== undefined) { fields.push(`description = $${idx++}`); values.push(dto.description); }
    if (dto.categoryId !== undefined) { fields.push(`category_id = $${idx++}`); values.push(dto.categoryId); }
    if (dto.unitPrice !== undefined) { fields.push(`unit_price = $${idx++}`); values.push(dto.unitPrice); }
    if (dto.minStock !== undefined) { fields.push(`min_stock = $${idx++}`); values.push(dto.minStock); }

    values.push(id);
    await this.pool.query(`UPDATE products SET ${fields.join(', ')} WHERE id = $${idx}`, values);
    return this.getById(id);
  }

  async deactivate(id: number): Promise<ProductEntity> {
    const result = await this.pool.query(
      'UPDATE products SET is_active = false WHERE id = $1 RETURNING id', [id],
    );
    if (result.rows.length === 0) throw CustomError.notFound('Product not found');
    return this.getById(id);
  }
}
