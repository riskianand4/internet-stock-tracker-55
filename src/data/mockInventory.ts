import { StockMovement, StockAlert, InventoryAudit, Warehouse } from '@/types/inventory-extended';

export const mockStockMovements: StockMovement[] = [
  {
    id: '1',
    productId: '1',
    type: 'in',
    quantity: 100,
    reason: 'Purchase Order',
    reference: 'PO-2024-001',
    date: new Date('2024-01-15'),
    userId: 'user1',
    userName: 'Ahmad Wijaya',
    notes: 'Pembelian rutin bulanan',
    location: 'Gudang Utama'
  },
  {
    id: '2',
    productId: '2',
    type: 'out',
    quantity: 25,
    reason: 'Sales Order',
    reference: 'SO-2024-001',
    date: new Date('2024-01-16'),
    userId: 'user2',
    userName: 'Siti Nurhaliza',
    location: 'Gudang Utama'
  },
  {
    id: '3',
    productId: '3',
    type: 'adjustment',
    quantity: -5,
    reason: 'Damaged Goods',
    date: new Date('2024-01-17'),
    userId: 'user1',
    userName: 'Ahmad Wijaya',
    notes: 'Kerusakan saat handling',
    location: 'Gudang Utama'
  }
];

export const mockStockAlerts: StockAlert[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Router WiFi AC1200',
    type: 'low_stock',
    severity: 'high',
    message: 'Stok router mendekati batas minimum',
    threshold: 10,
    currentValue: 8,
    date: new Date('2024-01-18'),
    isRead: false,
    isResolved: false
  },
  {
    id: '2',
    productId: '2',
    productName: 'Switch 24 Port',
    type: 'out_of_stock',
    severity: 'critical',
    message: 'Switch 24 port sudah habis',
    threshold: 5,
    currentValue: 0,
    date: new Date('2024-01-17'),
    isRead: true,
    isResolved: false
  },
  {
    id: '3',
    productId: '3',
    productName: 'Cable UTP Cat6',
    type: 'system',
    severity: 'medium',
    message: 'Perbedaan stok fisik dengan sistem',
    date: new Date('2024-01-16'),
    isRead: true,
    isResolved: true
  }
];

export const mockInventoryAudits: InventoryAudit[] = [
  {
    id: '1',
    date: new Date('2024-01-01'),
    type: 'full',
    status: 'completed',
    location: 'Gudang Utama',
    auditorId: 'user1',
    auditorName: 'Ahmad Wijaya',
    expectedItems: 1250,
    actualItems: 1245,
    discrepancies: 5,
    notes: 'Audit rutin awal tahun'
  },
  {
    id: '2',
    date: new Date('2024-01-15'),
    type: 'cycle',
    status: 'in_progress',
    location: 'Gudang Cabang A',
    auditorId: 'user2',
    auditorName: 'Siti Nurhaliza',
    expectedItems: 850,
    actualItems: 0,
    discrepancies: 0
  }
];

export const mockWarehouses: Warehouse[] = [
  {
    id: '1',
    name: 'Gudang Utama',
    location: 'Jakarta Pusat',
    capacity: 10000,
    currentOccupancy: 7500,
    managerId: 'user1',
    status: 'active'
  },
  {
    id: '2',
    name: 'Gudang Cabang A',
    location: 'Surabaya',
    capacity: 5000,
    currentOccupancy: 3200,
    managerId: 'user2',
    status: 'active'
  },
  {
    id: '3',
    name: 'Gudang Cadangan',
    location: 'Bandung',
    capacity: 3000,
    currentOccupancy: 500,
    managerId: 'user3',
    status: 'maintenance'
  }
];