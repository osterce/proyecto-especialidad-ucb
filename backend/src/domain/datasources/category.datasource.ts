import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/categories/category.dto';
import { CategoryEntity } from '../entities/category.entity';

export abstract class CategoryDataSource {
  abstract create(dto: CreateCategoryDto): Promise<CategoryEntity>;
  abstract getAll(): Promise<CategoryEntity[]>;
  abstract getById(id: number): Promise<CategoryEntity>;
  abstract update(id: number, dto: UpdateCategoryDto): Promise<CategoryEntity>;
  abstract deactivate(id: number): Promise<CategoryEntity>;
  abstract activate(id: number): Promise<CategoryEntity>;
}
