import { Order, Supplier, Customer } from '@/types/orders';

export const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'PT Teknologi Maju',
    email: 'sales@teknologimaju.co.id',
    phone: '+622155512345',
    address: 'Jl. Sudirman No. 123, Jakarta Selatan',
    contactPerson: 'Rahmat Hidayat',
    paymentTerms: 'NET 30',
    status: 'active',
    rating: 4.8,
    totalOrders: 125,
    totalValue: 2500000000
  },
  {
    id: '2',
    name: 'CV Network Solutions',
    email: 'info@networksolutions.co.id',
    phone: '+62315551234',
    address: 'Jl. Raya Gubeng No. 456, Surabaya',
    contactPerson: 'Indira Putri',
    paymentTerms: 'NET 15',
    status: 'active',
    rating: 4.6,
    totalOrders: 89,
    totalValue: 1800000000
  },
  {
    id: '3',
    name: 'PT Global Connectivity',
    email: 'procurement@globalconnect.co.id',
    phone: '+62225551234',
    address: 'Jl. Asia Afrika No. 789, Bandung',
    contactPerson: 'Eko Prasetyo',
    paymentTerms: 'NET 45',
    status: 'inactive',
    rating: 4.2,
    totalOrders: 56,
    totalValue: 980000000
  }
];

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'PT Solusi Digital',
    email: 'purchasing@solusidigitak.co.id',
    phone: '+622177812345',
    address: 'Jl. HR Rasuna Said No. 100, Jakarta Selatan',
    type: 'corporate',
    status: 'active',
    totalOrders: 45,
    totalValue: 750000000
  },
  {
    id: '2',
    name: 'CV Berkah Teknologi',
    email: 'admin@berkahtek.co.id',
    phone: '+62315557890',
    address: 'Jl. Pemuda No. 25, Surabaya',
    type: 'corporate',
    status: 'active',
    totalOrders: 32,
    totalValue: 480000000
  },
  {
    id: '3',
    name: 'Toko Komputer Sejahtera',
    email: 'owner@tokosejahtera.com',
    phone: '+62225559876',
    address: 'Jl. Cihampelas No. 15, Bandung',
    type: 'individual',
    status: 'active',
    totalOrders: 18,
    totalValue: 125000000
  }
];

export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'PO-2024-001',
    type: 'purchase',
    supplierId: '1',
    supplierName: 'PT Teknologi Maju',
    status: 'delivered',
    priority: 'medium',
    items: [
      {
        id: '1',
        productId: '1',
        productName: 'Router WiFi AC1200',
        sku: 'RTR-AC1200',
        quantity: 50,
        unitPrice: 1200000,
        discount: 0,
        total: 60000000
      },
      {
        id: '2',
        productId: '2',
        productName: 'Switch 24 Port',
        sku: 'SW-24P',
        quantity: 25,
        unitPrice: 2500000,
        discount: 5,
        total: 59375000
      }
    ],
    subtotal: 119375000,
    tax: 11937500,
    shipping: 500000,
    total: 131812500,
    orderDate: new Date('2024-01-10'),
    expectedDate: new Date('2024-01-20'),
    deliveredDate: new Date('2024-01-18'),
    notes: 'Pesanan rutin bulanan untuk cabang Jakarta',
    createdBy: 'Ahmad Wijaya',
    approvedBy: 'Siti Nurhaliza'
  },
  {
    id: '2',
    orderNumber: 'SO-2024-001',
    type: 'sales',
    customerId: '1',
    customerName: 'PT Solusi Digital',
    status: 'processing',
    priority: 'high',
    items: [
      {
        id: '3',
        productId: '3',
        productName: 'Cable UTP Cat6',
        sku: 'CBL-UTP6',
        quantity: 1000,
        unitPrice: 8500,
        discount: 10,
        total: 7650000
      },
      {
        id: '4',
        productId: '4',
        productName: 'Access Point WiFi 6',
        sku: 'AP-WIFI6',
        quantity: 15,
        unitPrice: 1800000,
        discount: 0,
        total: 27000000
      }
    ],
    subtotal: 34650000,
    tax: 3465000,
    shipping: 750000,
    total: 38865000,
    orderDate: new Date('2024-01-15'),
    expectedDate: new Date('2024-01-25'),
    notes: 'Proyek instalasi jaringan gedung perkantoran',
    createdBy: 'Budi Santoso',
    approvedBy: 'Siti Nurhaliza'
  },
  {
    id: '3',
    orderNumber: 'PO-2024-002',
    type: 'purchase',
    supplierId: '2',
    supplierName: 'CV Network Solutions',
    status: 'pending',
    priority: 'urgent',
    items: [
      {
        id: '5',
        productId: '5',
        productName: 'Firewall Enterprise',
        sku: 'FW-ENT',
        quantity: 5,
        unitPrice: 15000000,
        discount: 15,
        total: 63750000
      }
    ],
    subtotal: 63750000,
    tax: 6375000,
    shipping: 1000000,
    total: 71125000,
    orderDate: new Date('2024-01-17'),
    expectedDate: new Date('2024-02-01'),
    notes: 'Upgrade security infrastructure',
    createdBy: 'Ahmad Wijaya'
  }
];