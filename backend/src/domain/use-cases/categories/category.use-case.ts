import { CreateCategoryDto, UpdateCategoryDto } from '../../dtos/categories/category.dto';
import { CategoryRepository } from '../../repositories/category.repository';
import { CategoryEntity } from '../../entities/category.entity';

export class CreateCategory {
  constructor(private readonly categoryRepository: CategoryRepository) { }
  execute(dto: CreateCategoryDto) { return this.categoryRepository.create(dto); }
}

export class GetCategories {
  constructor(private readonly categoryRepository: CategoryRepository) { }
  execute(): Promise<CategoryEntity[]> { return this.categoryRepository.getAll(); }
}

export class UpdateCategory {
  constructor(private readonly categoryRepository: CategoryRepository) { }
  execute(id: number, dto: UpdateCategoryDto) { return this.categoryRepository.update(id, dto); }
}

export class DeactivateCategory {
  constructor(private readonly categoryRepository: CategoryRepository) { }
  execute(id: number) { return this.categoryRepository.deactivate(id); }
}
