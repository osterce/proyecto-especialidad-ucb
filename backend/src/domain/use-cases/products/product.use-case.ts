import { CreateProductDto, UpdateProductDto } from '../../dtos/products/product.dto';
import { ProductRepository } from '../../repositories/product.repository';
import { ProductEntity } from '../../entities/product.entity';

export class CreateProduct {
  constructor(private readonly productRepository: ProductRepository) { }
  execute(dto: CreateProductDto) { return this.productRepository.create(dto); }
}

export class GetProducts {
  constructor(private readonly productRepository: ProductRepository) { }
  execute(isActive?: boolean): Promise<ProductEntity[]> { return this.productRepository.getAll(isActive); }
}

export class GetProductById {
  constructor(private readonly productRepository: ProductRepository) { }
  execute(id: number) { return this.productRepository.getById(id); }
}

export class UpdateProduct {
  constructor(private readonly productRepository: ProductRepository) { }
  execute(id: number, dto: UpdateProductDto) { return this.productRepository.update(id, dto); }
}

export class DeactivateProduct {
  constructor(private readonly productRepository: ProductRepository) { }
  execute(id: number) { return this.productRepository.deactivate(id); }
}
