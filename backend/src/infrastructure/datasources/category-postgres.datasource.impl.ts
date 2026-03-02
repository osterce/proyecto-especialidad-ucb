import { Pool } from 'pg';
import { CategoryDataSource } from '../../domain/datasources/category.datasource';
import { CreateCategoryDto, UpdateCategoryDto } from '../../domain/dtos/categories/category.dto';
import { CategoryEntity } from '../../domain/entities/category.entity';
import { CustomError } from '../../domain/errors/custom.error';
import { CategoryMapper } from '../mappers/domain.mappers';

export class CategoryPostgresDataSourceImpl implements CategoryDataSource {
  constructor(private readonly pool: Pool) { }

  async create(dto: CreateCategoryDto): Promise<CategoryEntity> {
    const result = await this.pool.query(
      'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
      [dto.name, dto.description ?? null],
    );
    return CategoryMapper.fromRow(result.rows[0]);
  }

  async getAll(): Promise<CategoryEntity[]> {
    const result = await this.pool.query('SELECT * FROM categories WHERE is_active = true ORDER BY name');
    return result.rows.map(CategoryMapper.fromRow);
  }

  async getById(id: number): Promise<CategoryEntity> {
    const result = await this.pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    if (result.rows.length === 0) throw CustomError.notFound('Category not found');
    return CategoryMapper.fromRow(result.rows[0]);
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<CategoryEntity> {
    await this.getById(id);
    const fields: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (dto.name) { fields.push(`name = $${idx++}`); values.push(dto.name); }
    if (dto.description !== undefined) { fields.push(`description = $${idx++}`); values.push(dto.description); }

    values.push(id);
    const result = await this.pool.query(
      `UPDATE categories SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`, values,
    );
    return CategoryMapper.fromRow(result.rows[0]);
  }

  async deactivate(id: number): Promise<CategoryEntity> {
    const result = await this.pool.query(
      'UPDATE categories SET is_active = false WHERE id = $1 RETURNING *', [id],
    );
    if (result.rows.length === 0) throw CustomError.notFound('Category not found');
    return CategoryMapper.fromRow(result.rows[0]);
  }
}
