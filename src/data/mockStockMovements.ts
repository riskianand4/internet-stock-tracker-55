import { StockMovement, StockAlert, StockVelocity, CostAnalysis, SupplierPerformance } from '@/types/stock-movement';

export const mockStockMovements: StockMovement[] = [
  {
    id: 'mov-001',
    productId: 'prod-001',
    productName: 'Router WiFi TP-Link AC1200',
    productCode: 'TL-AC1200',
    type: 'IN',
    quantity: 50,
    previousStock: 25,
    newStock: 75,
    reason: 'Purchase Order Received',
    reference: 'PO-2024-001',
    location: 'Warehouse A',
    warehouse: 'Jakarta Pusat',
    userId: 'user-001',
    userName: 'Admin Gudang',
    timestamp: new Date('2024-01-15T10:30:00'),
    cost: 2500000,
    unitPrice: 50000,
    supplier: 'PT. Distributor Telkom',
    notes: 'Batch import dari supplier utama'
  },
  {
    id: 'mov-002',
    productId: 'prod-001',
    productName: 'Router WiFi TP-Link AC1200',
    productCode: 'TL-AC1200',
    type: 'OUT',
    quantity: -15,
    previousStock: 75,
    newStock: 60,
    reason: 'Installation Order',
    reference: 'INS-2024-045',
    location: 'Warehouse A',
    warehouse: 'Jakarta Pusat',
    userId: 'user-003',
    userName: 'Teknisi Field',
    timestamp: new Date('2024-01-16T14:15:00'),
    notes: 'Instalasi untuk customer korporat'
  },
  {
    id: 'mov-003',
    productId: 'prod-002',
    productName: 'Modem Indihome ZTE F609',
    productCode: 'ZTE-F609',
    type: 'ADJUSTMENT',
    quantity: -5,
    previousStock: 120,
    newStock: 115,
    reason: 'Stock Count Correction',
    location: 'Warehouse B',
    warehouse: 'Surabaya',
    userId: 'user-002',
    userName: 'Supervisor Gudang',
    timestamp: new Date('2024-01-17T09:00:00'),
    notes: 'Penyesuaian setelah stock opname'
  },
  {
    id: 'mov-004',
    productId: 'prod-003',
    productName: 'Set Top Box Telkom TV',
    productCode: 'STB-TV-001',
    type: 'TRANSFER',
    quantity: 20,
    previousStock: 30,
    newStock: 50,
    reason: 'Inter-warehouse Transfer',
    reference: 'TR-2024-012',
    location: 'Warehouse A',
    warehouse: 'Jakarta Pusat',
    userId: 'user-001',
    userName: 'Admin Gudang',
    timestamp: new Date('2024-01-18T11:45:00'),
    notes: 'Transfer dari gudang Bandung'
  }
];

export const mockStockAlerts: StockAlert[] = [
  {
    id: 'alert-001',
    productId: 'prod-004',
    productName: 'Kabel UTP Cat6',
    productCode: 'UTP-CAT6',
    type: 'LOW_STOCK',
    currentStock: 15,
    threshold: 20,
    severity: 'MEDIUM',
    message: 'Stok kabel UTP Cat6 dibawah batas minimum (15/20)',
    timestamp: new Date('2024-01-20T08:30:00'),
    acknowledged: false
  },
  {
    id: 'alert-002',
    productId: 'prod-005',
    productName: 'Splitter Fiber Optic 1:8',
    productCode: 'SPL-FO-8',
    type: 'OUT_OF_STOCK',
    currentStock: 0,
    threshold: 10,
    severity: 'CRITICAL',
    message: 'Splitter fiber optic habis! Segera lakukan pembelian.',
    timestamp: new Date('2024-01-20T10:15:00'),
    acknowledged: false
  },
  {
    id: 'alert-003',
    productId: 'prod-006',
    productName: 'Access Point Indoor',
    productCode: 'AP-IN-001',
    type: 'LOW_STOCK',
    currentStock: 8,
    threshold: 15,
    severity: 'HIGH',
    message: 'Stok access point indoor sangat rendah (8/15)',
    timestamp: new Date('2024-01-19T16:20:00'),
    acknowledged: true,
    acknowledgedBy: 'Manager Gudang',
    acknowledgedAt: new Date('2024-01-19T16:25:00')
  }
];

export const mockStockVelocity: StockVelocity[] = [
  {
    productId: 'prod-001',
    productName: 'Router WiFi TP-Link AC1200',
    productCode: 'TL-AC1200',
    averageDailyUsage: 3.2,
    averageWeeklyUsage: 22.4,
    averageMonthlyUsage: 96,
    velocity: 'FAST',
    daysOfSupply: 18.75,
    reorderPoint: 45,
    lastMovementDate: new Date('2024-01-16T14:15:00'),
    totalMovements: 156
  },
  {
    productId: 'prod-002',
    productName: 'Modem Indihome ZTE F609',
    productCode: 'ZTE-F609',
    averageDailyUsage: 5.1,
    averageWeeklyUsage: 35.7,
    averageMonthlyUsage: 153,
    velocity: 'FAST',
    daysOfSupply: 22.55,
    reorderPoint: 75,
    lastMovementDate: new Date('2024-01-17T09:00:00'),
    totalMovements: 203
  },
  {
    productId: 'prod-003',
    productName: 'Set Top Box Telkom TV',
    productCode: 'STB-TV-001',
    averageDailyUsage: 1.8,
    averageWeeklyUsage: 12.6,
    averageMonthlyUsage: 54,
    velocity: 'MEDIUM',
    daysOfSupply: 27.78,
    reorderPoint: 25,
    lastMovementDate: new Date('2024-01-18T11:45:00'),
    totalMovements: 89
  }
];

export const mockCostAnalysis: CostAnalysis[] = [
  {
    productId: 'prod-001',
    productName: 'Router WiFi TP-Link AC1200',
    totalCost: 3750000,
    averageCost: 50000,
    currentValue: 4500000,
    profit: 750000,
    profitMargin: 16.67,
    turnoverRate: 8.2,
    carryingCost: 125000,
    lastCostUpdate: new Date('2024-01-15T10:30:00')
  },
  {
    productId: 'prod-002',
    productName: 'Modem Indihome ZTE F609',
    totalCost: 8050000,
    averageCost: 70000,
    currentValue: 9200000,
    profit: 1150000,
    profitMargin: 12.5,
    turnoverRate: 6.8,
    carryingCost: 268333,
    lastCostUpdate: new Date('2024-01-10T14:20:00')
  }
];

export const mockSupplierPerformance: SupplierPerformance[] = [
  {
    supplierId: 'sup-001',
    supplierName: 'PT. Distributor Telkom',
    totalOrders: 24,
    onTimeDeliveries: 22,
    onTimePercentage: 91.67,
    averageLeadTime: 3.2,
    qualityRating: 4.8,
    totalValue: 125000000,
    lastOrderDate: new Date('2024-01-15T10:30:00'),
    activeProducts: 15
  },
  {
    supplierId: 'sup-002',
    supplierName: 'CV. Teknologi Nusantara',
    totalOrders: 18,
    onTimeDeliveries: 15,
    onTimePercentage: 83.33,
    averageLeadTime: 4.1,
    qualityRating: 4.2,
    totalValue: 87500000,
    lastOrderDate: new Date('2024-01-12T16:45:00'),
    activeProducts: 12
  },
  {
    supplierId: 'sup-003',
    supplierName: 'PT. Fiber Optik Indonesia',
    totalOrders: 12,
    onTimeDeliveries: 11,
    onTimePercentage: 91.67,
    averageLeadTime: 2.8,
    qualityRating: 4.6,
    totalValue: 62500000,
    lastOrderDate: new Date('2024-01-18T09:15:00'),
    activeProducts: 8
  }
];