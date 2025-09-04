import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Search, Package, AlertTriangle, TrendingUp, TrendingDown, 
  Eye, Edit, RotateCcw, Plus, Minus 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface InventoryItem {
  id: string;
  name: string;
  code: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  location: string;
  lastMovement: Date;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'overstock';
  value: number;
  unit: string;
}

// Mock data - in real app, this would come from API/context
const mockInventoryItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Router WiFi AC1200',
    code: 'RWF-001',
    category: 'Networking',
    currentStock: 25,
    minStock: 10,
    maxStock: 100,
    location: 'Gudang Utama',
    lastMovement: new Date(),
    status: 'in_stock',
    value: 750000,
    unit: 'pcs'
  },
  {
    id: '2',
    name: 'Switch 24 Port',
    code: 'SW24-001',
    category: 'Networking', 
    currentStock: 5,
    minStock: 8,
    maxStock: 50,
    location: 'Gudang Utama',
    lastMovement: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'low_stock',
    value: 2500000,
    unit: 'pcs'
  },
  {
    id: '3',
    name: 'Cable UTP Cat6',
    code: 'UTP-C6',
    category: 'Accessories',
    currentStock: 0,
    minStock: 20,
    maxStock: 500,
    location: 'Gudang B',
    lastMovement: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: 'out_of_stock',
    value: 0,
    unit: 'meter'
  },
  {
    id: '4',
    name: 'Access Point',
    code: 'AP-001',
    category: 'Networking',
    currentStock: 45,
    minStock: 15,
    maxStock: 40,
    location: 'Toko Depan',
    lastMovement: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: 'overstock',
    value: 1800000,
    unit: 'pcs'
  }
];

interface InventoryOverviewProps {
  onStockAdjustment?: (productId: string) => void;
}

const InventoryOverview = ({ onStockAdjustment }: InventoryOverviewProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredItems = mockInventoryItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = selectedLocation === 'all' || item.location === selectedLocation;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    
    return matchesSearch && matchesLocation && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'bg-success text-success-foreground';
      case 'low_stock': return 'bg-warning text-warning-foreground';
      case 'out_of_stock': return 'bg-destructive text-destructive-foreground';
      case 'overstock': return 'bg-info text-info-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_stock': return 'Stok Normal';
      case 'low_stock': return 'Stok Rendah';
      case 'out_of_stock': return 'Stok Habis';
      case 'overstock': return 'Stok Berlebih';
      default: return status;
    }
  };

  const getTrendIcon = (item: InventoryItem) => {
    if (item.status === 'out_of_stock') return <TrendingDown className="w-4 h-4 text-destructive" />;
    if (item.status === 'low_stock') return <TrendingDown className="w-4 h-4 text-warning" />;
    if (item.status === 'overstock') return <TrendingUp className="w-4 h-4 text-info" />;
    return <TrendingUp className="w-4 h-4 text-success" />;
  };

  const getStockPercentage = (item: InventoryItem) => {
    return Math.round((item.currentStock / item.maxStock) * 100);
  };

  // Statistics
  const stats = {
    total: mockInventoryItems.length,
    inStock: mockInventoryItems.filter(i => i.status === 'in_stock').length,
    lowStock: mockInventoryItems.filter(i => i.status === 'low_stock').length,
    outOfStock: mockInventoryItems.filter(i => i.status === 'out_of_stock').length,
    totalValue: mockInventoryItems.reduce((sum, item) => sum + item.value, 0),
  };

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-primary/10 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Item dalam inventori</p>
          </CardContent>
        </Card>

        <Card className="bg-success/10 border-success/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stok Normal</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.inStock}</div>
            <p className="text-xs text-muted-foreground">Produk dengan stok aman</p>
          </CardContent>
        </Card>

        <Card className="bg-warning/10 border-warning/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alert Stok</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.lowStock + stats.outOfStock}</div>
            <p className="text-xs text-muted-foreground">Perlu perhatian segera</p>
          </CardContent>
        </Card>

        <Card className="bg-accent/10 border-accent/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nilai Inventori</CardTitle>
            <TrendingUp className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">
              Rp {(stats.totalValue / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground">Total nilai stok</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div 
        className="flex flex-col sm:flex-row gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Cari produk, kode, atau kategori..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-muted/50"
          />
        </div>
        
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Semua Lokasi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Lokasi</SelectItem>
            <SelectItem value="Gudang Utama">Gudang Utama</SelectItem>
            <SelectItem value="Gudang B">Gudang B</SelectItem>
            <SelectItem value="Toko Depan">Toko Depan</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="in_stock">Stok Normal</SelectItem>
            <SelectItem value="low_stock">Stok Rendah</SelectItem>
            <SelectItem value="out_of_stock">Stok Habis</SelectItem>
            <SelectItem value="overstock">Stok Berlebih</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Inventory Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Real-time Stock Levels</CardTitle>
            <CardDescription>Monitor semua level stok produk secara real-time</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produk</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Stok Saat Ini</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Level Stok</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Nilai</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">{item.code}</div>
                      </div>
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(item)}
                        <span className="font-medium">{item.currentStock} {item.unit}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(item.status)}>
                        {getStatusText(item.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="w-24">
                        <Progress value={getStockPercentage(item)} className="h-2" />
                        <div className="text-xs text-muted-foreground mt-1">
                          {getStockPercentage(item)}%
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {item.value > 0 ? `Rp ${item.value.toLocaleString('id-ID')}` : '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onStockAdjustment?.(item.id)}
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default InventoryOverview;