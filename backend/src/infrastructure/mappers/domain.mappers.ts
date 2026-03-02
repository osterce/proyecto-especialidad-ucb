import { SupplierEntity } from '../../domain/entities/supplier.entity';
import { CategoryEntity } from '../../domain/entities/category.entity';
import { WarehouseEntity } from '../../domain/entities/warehouse.entity';
import { ProductEntity } from '../../domain/entities/product.entity';
import { InventoryEntity } from '../../domain/entities/inventory.entity';
import { MovementEntity } from '../../domain/entities/movement.entity';

export class SupplierMapper {
  static fromRow(row: Record<string, unknown>): SupplierEntity {
    return new SupplierEntity(
      row.id as number, row.name as string, row.contact_name as string | null,
      row.phone as string | null, row.email as string | null,
      row.address as string | null, row.is_active as boolean, row.created_at as Date,
    );
  }
}

export class CategoryMapper {
  static fromRow(row: Record<string, unknown>): CategoryEntity {
    return new CategoryEntity(
      row.id as number, row.name as string,
      row.description as string | null, row.is_active as boolean, row.created_at as Date,
    );
  }
}

export class WarehouseMapper {
  static fromRow(row: Record<string, unknown>): WarehouseEntity {
    return new WarehouseEntity(
      row.id as number, row.name as string, row.location as string | null,
      row.description as string | null, row.is_active as boolean, row.created_at as Date,
    );
  }
}

export class ProductMapper {
  static fromRow(row: Record<string, unknown>): ProductEntity {
    return new ProductEntity(
      row.id as number, row.name as string, row.sku as string,
      row.description as string | null, row.category_id as number | null,
      row.category_name as string | null, parseFloat(row.unit_price as string),
      row.min_stock as number, row.is_active as boolean,
      row.created_at as Date, row.updated_at as Date,
    );
  }
}

export class InventoryMapper {
  static fromRow(row: Record<string, unknown>): InventoryEntity {
    return new InventoryEntity(
      row.id as number, row.product_id as number, row.product_name as string,
      row.product_sku as string, row.warehouse_id as number, row.warehouse_name as string,
      row.stock_quantity as number, row.min_stock as number, row.last_updated as Date,
    );
  }
}

export class MovementMapper {
  static fromRow(row: Record<string, unknown>): MovementEntity {
    return new MovementEntity(
      row.id as number, row.product_id as number, row.product_name as string,
      row.warehouse_id as number, row.warehouse_name as string,
      row.supplier_id as number | null, row.supplier_name as string | null,
      row.type as 'ENTRADA' | 'SALIDA', row.quantity as number,
      parseFloat(row.unit_price as string), parseFloat(row.total_price as string),
      row.reference as string | null, row.notes as string | null,
      row.created_by as number | null, row.created_by_name as string | null,
      row.created_at as Date,
    );
  }
}
