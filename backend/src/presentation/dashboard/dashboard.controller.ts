import { Request, Response } from 'express';
import { PostgresDatabase } from '../../data/postgres/postgres.database';
import { CustomError } from '../../domain/errors/custom.error';

export class DashboardController {
  private handleError = (error: unknown, res: Response): void => {
    if (error instanceof CustomError) { res.status(error.statusCode).json({ error: error.message }); return; }
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  };

  getDashboard = async (_req: Request, res: Response): Promise<void> => {
    try {
      const db = PostgresDatabase.getInstance();

      const [
        totalProductsResult,
        activeWarehousesResult,
        stockAlertsResult,
        totalMovementsResult,
        recentMovementsResult,
        topProductsResult,
      ] = await Promise.all([
        db.pool.query('SELECT COUNT(*) as total FROM products WHERE is_active = true'),
        db.pool.query('SELECT COUNT(*) as total FROM warehouses WHERE is_active = true'),
        db.pool.query(`
          SELECT COUNT(*) as total FROM inventory i
          JOIN products p ON i.product_id = p.id
          WHERE i.stock_quantity <= p.min_stock
        `),
        db.pool.query("SELECT COUNT(*) as total FROM movements WHERE created_at >= (NOW() - INTERVAL '30 days')"),
        db.pool.query(`
          SELECT m.type, m.quantity, p.name as product_name, w.name as warehouse_name, 
                 m.total_price, m.created_at
          FROM movements m
          JOIN products p ON m.product_id = p.id
          JOIN warehouses w ON m.warehouse_id = w.id
          ORDER BY m.created_at DESC LIMIT 10
        `),
        db.pool.query(`
          SELECT p.name, p.sku, SUM(m.quantity) as total_moved
          FROM movements m
          JOIN products p ON m.product_id = p.id
          WHERE m.created_at >= (NOW() - INTERVAL '30 days')
          GROUP BY p.id, p.name, p.sku
          ORDER BY total_moved DESC LIMIT 5
        `),
      ]);

      res.json({
        kpis: {
          totalActiveProducts: parseInt(totalProductsResult.rows[0].total as string),
          activeWarehouses: parseInt(activeWarehousesResult.rows[0].total as string),
          stockAlerts: parseInt(stockAlertsResult.rows[0].total as string),
          movementsLast30Days: parseInt(totalMovementsResult.rows[0].total as string),
        },
        recentMovements: recentMovementsResult.rows,
        topMovedProducts: topProductsResult.rows,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };
}
