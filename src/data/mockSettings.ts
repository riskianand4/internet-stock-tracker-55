import { SystemSettings, NotificationSettings, BackupSettings, IntegrationSettings } from '@/types/settings';

export const mockSystemSettings: SystemSettings[] = [
  {
    id: '1',
    category: 'general',
    key: 'company_name',
    value: 'Telkom Indonesia',
    description: 'Nama perusahaan yang ditampilkan di sistem',
    type: 'string',
    isPublic: true,
    updatedAt: new Date('2024-01-01'),
    updatedBy: 'Ahmad Wijaya'
  },
  {
    id: '2',
    category: 'general',
    key: 'company_logo',
    value: '/assets/telkom-logo.png',
    description: 'Logo perusahaan',
    type: 'string',
    isPublic: true,
    updatedAt: new Date('2024-01-01'),
    updatedBy: 'Ahmad Wijaya'
  },
  {
    id: '3',
    category: 'inventory',
    key: 'low_stock_threshold',
    value: 10,
    description: 'Batas minimum stok untuk peringatan',
    type: 'number',
    isPublic: false,
    updatedAt: new Date('2024-01-15'),
    updatedBy: 'Siti Nurhaliza'
  },
  {
    id: '4',
    category: 'inventory',
    key: 'auto_reorder_enabled',
    value: true,
    description: 'Aktifkan pesanan otomatis saat stok rendah',
    type: 'boolean',
    isPublic: false,
    updatedAt: new Date('2024-01-10'),
    updatedBy: 'Siti Nurhaliza'
  },
  {
    id: '5',
    category: 'notifications',
    key: 'email_notifications',
    value: true,
    description: 'Aktifkan notifikasi email',
    type: 'boolean',
    isPublic: false,
    updatedAt: new Date('2024-01-18'),
    updatedBy: 'Ahmad Wijaya'
  },
  {
    id: '6',
    category: 'security',
    key: 'session_timeout',
    value: 8,
    description: 'Waktu timeout sesi dalam jam',
    type: 'number',
    isPublic: false,
    updatedAt: new Date('2024-01-05'),
    updatedBy: 'Ahmad Wijaya'
  },
  {
    id: '7',
    category: 'security',
    key: 'password_policy',
    value: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    },
    description: 'Kebijakan password sistem',
    type: 'object',
    isPublic: false,
    updatedAt: new Date('2024-01-01'),
    updatedBy: 'Ahmad Wijaya'
  }
];

export const mockNotificationSettings: NotificationSettings[] = [
  {
    id: '1',
    userId: '1',
    type: 'email',
    category: 'stock_alerts',
    enabled: true,
    frequency: 'immediate',
    threshold: 10
  },
  {
    id: '2',
    userId: '1',
    type: 'push',
    category: 'order_updates',
    enabled: true,
    frequency: 'immediate'
  },
  {
    id: '3',
    userId: '2',
    type: 'email',
    category: 'stock_alerts',
    enabled: true,
    frequency: 'daily',
    threshold: 5
  },
  {
    id: '4',
    userId: '2',
    type: 'email',
    category: 'system_notifications',
    enabled: false,
    frequency: 'weekly'
  },
  {
    id: '5',
    userId: '3',
    type: 'email',
    category: 'order_updates',
    enabled: true,
    frequency: 'immediate'
  }
];

export const mockBackupSettings: BackupSettings[] = [
  {
    id: '1',
    name: 'Database Backup Harian',
    type: 'incremental',
    frequency: 'daily',
    retention: 30,
    location: 'cloud',
    enabled: true,
    lastBackup: new Date('2024-01-18T02:00:00'),
    nextBackup: new Date('2024-01-19T02:00:00')
  },
  {
    id: '2',
    name: 'Full System Backup Mingguan',
    type: 'full',
    frequency: 'weekly',
    retention: 12,
    location: 'local',
    enabled: true,
    lastBackup: new Date('2024-01-14T01:00:00'),
    nextBackup: new Date('2024-01-21T01:00:00')
  },
  {
    id: '3',
    name: 'Archive Backup Bulanan',
    type: 'full',
    frequency: 'monthly',
    retention: 24,
    location: 'cloud',
    enabled: true,
    lastBackup: new Date('2024-01-01T00:00:00'),
    nextBackup: new Date('2024-02-01T00:00:00')
  }
];

export const mockIntegrationSettings: IntegrationSettings[] = [
  {
    id: '1',
    name: 'SAP ERP Integration',
    type: 'api',
    endpoint: 'https://erp.telkom.co.id/api/v1',
    credentials: {
      clientId: 'telkom-inventory',
      clientSecret: '***'
    },
    config: {
      syncInterval: 3600,
      syncProducts: true,
      syncOrders: true,
      syncCustomers: false
    },
    status: 'active',
    lastSync: new Date('2024-01-18T06:00:00'),
    enabled: true
  },
  {
    id: '2',
    name: 'Email Service',
    type: 'api',
    endpoint: 'https://api.mailgun.com/v3',
    credentials: {
      apiKey: '***',
      domain: 'mg.telkom.co.id'
    },
    config: {
      fromEmail: 'noreply@telkom.co.id',
      fromName: 'Telkom Inventory System'
    },
    status: 'active',
    enabled: true
  },
  {
    id: '3',
    name: 'Barcode Scanner API',
    type: 'webhook',
    endpoint: 'https://inventory.telkom.co.id/webhooks/barcode',
    credentials: {
      secretKey: '***'
    },
    config: {
      autoUpdateStock: true,
      validateProducts: true
    },
    status: 'inactive',
    enabled: false
  }
];