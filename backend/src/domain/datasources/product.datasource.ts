import { CreateProductDto, UpdateProductDto } from '../dtos/products/product.dto';
import { ProductEntity } from '../entities/product.entity';

export abstract class ProductDataSource {
  abstract create(dto: CreateProductDto): Promise<ProductEntity>;
  abstract getAll(isActive?: boolean): Promise<ProductEntity[]>;
  abstract getById(id: number): Promise<ProductEntity>;
  abstract update(id: number, dto: UpdateProductDto): Promise<ProductEntity>;
  abstract deactivate(id: number): Promise<ProductEntity>;
}
