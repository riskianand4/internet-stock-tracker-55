import { Product } from '@/types/inventory';
import { DUMMY_PRODUCTS } from './dummyProducts';

export interface HistoricalData {
  date: string;
  totalProducts: number;
  totalValue: number;
  stockMovements: number;
  lowStockCount: number;
  outOfStockCount: number;
  salesCount: number;
  restockCount: number;
}

export interface CategoryTrend {
  category: string;
  date: string;
  value: number;
  volume: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ProductVelocity {
  productId: string;
  productName: string;
  category: string;
  dailyMovement: number;
  monthlyMovement: number;
  turnoverRate: number;
  daysUntilOutOfStock: number;
  reorderRecommended: boolean;
  seasonalIndex: number;
}

export interface StockAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  product: Product;
  message: string;
  priority: number;
  timestamp: Date;
  actionRequired: boolean;
}

// Generate mock historical data for the last 12 months
const generateHistoricalData = (): HistoricalData[] => {
  const data: HistoricalData[] = [];
  const now = new Date();
  
  for (let i = 365; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Simulate realistic patterns
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const weekMultiplier = isWeekend ? 0.7 : 1;
    
    // Monthly seasonality (higher activity in certain months)
    const month = date.getMonth();
    const seasonMultiplier = month === 11 || month === 0 ? 1.5 : // Dec-Jan peak
                           month >= 5 && month <= 7 ? 1.2 : // Jun-Aug summer boost
                           1;
    
    const baseValue = 50000000; // 50M base value
    const randomVariation = 0.8 + Math.random() * 0.4; // ±20% variation
    
    data.push({
      date: date.toISOString().split('T')[0],
      totalProducts: Math.floor(25 + Math.random() * 10), // 25-35 products
      totalValue: Math.floor(baseValue * seasonMultiplier * weekMultiplier * randomVariation),
      stockMovements: Math.floor(15 * seasonMultiplier * weekMultiplier * (0.7 + Math.random() * 0.6)),
      lowStockCount: Math.floor(3 + Math.random() * 4), // 3-7 low stock items
      outOfStockCount: Math.floor(Math.random() * 3), // 0-2 out of stock
      salesCount: Math.floor(8 * seasonMultiplier * weekMultiplier * (0.8 + Math.random() * 0.4)),
      restockCount: Math.floor(2 + Math.random() * 3) // 2-5 restocks per day
    });
  }
  
  return data;
};

// Generate category trends
const generateCategoryTrends = (): CategoryTrend[] => {
  const categories = ['Network Equipment', 'Cables & Connectors', 'Access Points', 'Servers & Storage'];
  const trends: CategoryTrend[] = [];
  
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    categories.forEach(category => {
      const baseValue = category === 'Network Equipment' ? 15000000 :
                       category === 'Servers & Storage' ? 20000000 :
                       category === 'Access Points' ? 8000000 : 5000000;
      
      const trendFactor = Math.sin(i / 10) * 0.2 + 1; // Simulate trends
      const randomFactor = 0.8 + Math.random() * 0.4;
      
      trends.push({
        category,
        date: date.toISOString().split('T')[0],
        value: Math.floor(baseValue * trendFactor * randomFactor),
        volume: Math.floor(50 * trendFactor * randomFactor),
        trend: trendFactor > 1.05 ? 'up' : trendFactor < 0.95 ? 'down' : 'stable'
      });
    });
  }
  
  return trends;
};

// Generate product velocity analysis
const generateProductVelocity = (): ProductVelocity[] => {
  return DUMMY_PRODUCTS.map(product => {
    const dailyMovement = Math.random() * 5 + 1; // 1-6 units per day
    const monthlyMovement = dailyMovement * 30;
    const turnoverRate = (monthlyMovement / product.stock) * 100;
    const daysUntilOutOfStock = product.stock / dailyMovement;
    
    // Seasonal factors
    const seasonalIndex = product.category === 'Network Equipment' && Math.random() > 0.5 ? 1.3 : 
                         product.category === 'Access Points' ? 1.1 : 1;
    
    return {
      productId: product.id,
      productName: product.name,
      category: product.category,
      dailyMovement: Math.round(dailyMovement * 10) / 10,
      monthlyMovement: Math.round(monthlyMovement),
      turnoverRate: Math.round(turnoverRate * 10) / 10,
      daysUntilOutOfStock: Math.round(daysUntilOutOfStock),
      reorderRecommended: daysUntilOutOfStock < 7 || product.stock < product.minStock * 1.5,
      seasonalIndex: Math.round(seasonalIndex * 100) / 100
    };
  });
};

// Generate smart alerts
const generateStockAlerts = (): StockAlert[] => {
  const alerts: StockAlert[] = [];
  const now = new Date();
  
  DUMMY_PRODUCTS.forEach((product, index) => {
    // Critical alerts
    if (product.status === 'out_of_stock') {
      alerts.push({
        id: `alert-${index}-critical`,
        type: 'critical',
        product,
        message: `${product.name} is completely out of stock`,
        priority: 1,
        timestamp: new Date(now.getTime() - Math.random() * 3600000), // Last hour
        actionRequired: true
      });
    }
    
    // Warning alerts
    if (product.status === 'low_stock') {
      alerts.push({
        id: `alert-${index}-warning`,
        type: 'warning',
        product,
        message: `${product.name} is running low (${product.stock} units remaining)`,
        priority: 2,
        timestamp: new Date(now.getTime() - Math.random() * 86400000), // Last 24 hours
        actionRequired: true
      });
    }
    
    // Predictive alerts
    if (Math.random() > 0.7 && product.stock > product.minStock) {
      alerts.push({
        id: `alert-${index}-predictive`,
        type: 'info',
        product,
        message: `${product.name} predicted to run low in 5-7 days based on current usage`,
        priority: 3,
        timestamp: new Date(now.getTime() - Math.random() * 1800000), // Last 30 minutes
        actionRequired: false
      });
    }
  });
  
  return alerts.sort((a, b) => a.priority - b.priority);
};

export const HISTORICAL_DATA = generateHistoricalData();
export const CATEGORY_TRENDS = generateCategoryTrends();
export const PRODUCT_VELOCITY = generateProductVelocity();
export const STOCK_ALERTS = generateStockAlerts();

// Helper functions for analytics
export const getDataForPeriod = (data: HistoricalData[], days: number): HistoricalData[] => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  return data.filter(item => new Date(item.date) >= cutoffDate);
};

export const calculateGrowthRate = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100 * 10) / 10;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('id-ID').format(value);
};