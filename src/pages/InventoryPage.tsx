import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Search, Plus, Download, Upload, AlertTriangle, TrendingUp, 
  Package, MapPin, Calendar, Filter, Eye, Edit, Trash2 
} from 'lucide-react';
import { mockStockMovements, mockStockAlerts, mockInventoryAudits, mockWarehouses } from '@/data/mockInventory';
import { useAuth } from '@/contexts/AuthContext';

export default function InventoryPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const filteredMovements = mockStockMovements.filter(movement =>
    movement.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movement.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAlerts = mockStockAlerts.filter(alert =>
    alert.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-destructive text-destructive-foreground';
      case 'high': return 'bg-warning text-warning-foreground';
      case 'medium': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getMovementTypeColor = (type: string) => {
    switch (type) {
      case 'in': return 'bg-success text-success-foreground';
      case 'out': return 'bg-warning text-warning-foreground';
      case 'adjustment': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'inactive': return 'bg-muted text-muted-foreground';
      case 'maintenance': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div 
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manajemen Inventori</h1>
            <p className="text-muted-foreground">Kelola stok, pergerakan, dan audit inventori</p>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Adjustment Stok
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adjustment Stok</DialogTitle>
                  <DialogDescription>Lakukan penyesuaian stok untuk produk tertentu</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="product">Produk</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih produk" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Router WiFi AC1200</SelectItem>
                        <SelectItem value="2">Switch 24 Port</SelectItem>
                        <SelectItem value="3">Cable UTP Cat6</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type">Tipe Adjustment</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in">Penambahan</SelectItem>
                        <SelectItem value="out">Pengurangan</SelectItem>
                        <SelectItem value="adjustment">Penyesuaian</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="quantity">Jumlah</Label>
                    <Input id="quantity" type="number" placeholder="0" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="reason">Alasan</Label>
                    <Input id="reason" placeholder="Alasan adjustment" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Catatan</Label>
                    <Textarea id="notes" placeholder="Catatan tambahan..." />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Batal</Button>
                  <Button>Simpan</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Import Data
            </Button>
          </div>
        </motion.div>

        {/* Overview Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-primary/10 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pergerakan</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{mockStockMovements.length}</div>
              <p className="text-xs text-muted-foreground">Pergerakan bulan ini</p>
            </CardContent>
          </Card>

          <Card className="bg-warning/10 border-warning/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alert Aktif</CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{mockStockAlerts.filter(a => !a.isResolved).length}</div>
              <p className="text-xs text-muted-foreground">Peringatan aktif</p>
            </CardContent>
          </Card>

          <Card className="bg-success/10 border-success/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gudang</CardTitle>
              <Package className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{mockWarehouses.filter(w => w.status === 'active').length}</div>
              <p className="text-xs text-muted-foreground">Gudang aktif</p>
            </CardContent>
          </Card>

          <Card className="bg-accent/10 border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Audit</CardTitle>
              <Calendar className="h-4 w-4 text-info" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-info">{mockInventoryAudits.filter(a => a.status === 'completed').length}</div>
              <p className="text-xs text-muted-foreground">Audit selesai</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Cari pergerakan, produk, atau user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-muted/50"
            />
          </div>
          <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Semua Gudang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Gudang</SelectItem>
              {mockWarehouses.map(warehouse => (
                <SelectItem key={warehouse.id} value={warehouse.id}>{warehouse.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Tabs defaultValue="movements" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="movements">Pergerakan Stok</TabsTrigger>
              <TabsTrigger value="alerts">Peringatan</TabsTrigger>
              <TabsTrigger value="audits">Audit</TabsTrigger>
              <TabsTrigger value="warehouses">Gudang</TabsTrigger>
            </TabsList>

            <TabsContent value="movements" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Pergerakan Stok</CardTitle>
                  <CardDescription>Riwayat pergerakan stok masuk, keluar, dan adjustment</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Tipe</TableHead>
                        <TableHead>Jumlah</TableHead>
                        <TableHead>Alasan</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Lokasi</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMovements.map((movement) => (
                        <TableRow key={movement.id}>
                          <TableCell>{movement.date.toLocaleDateString('id-ID')}</TableCell>
                          <TableCell>
                            <Badge className={getMovementTypeColor(movement.type)}>
                              {movement.type === 'in' ? 'Masuk' : movement.type === 'out' ? 'Keluar' : 'Adjustment'}
                            </Badge>
                          </TableCell>
                          <TableCell className={movement.type === 'out' || (movement.type === 'adjustment' && movement.quantity < 0) ? 'text-destructive' : 'text-success'}>
                            {movement.type === 'out' || (movement.type === 'adjustment' && movement.quantity < 0) ? '' : '+'}{movement.quantity}
                          </TableCell>
                          <TableCell>{movement.reason}</TableCell>
                          <TableCell>{movement.reference || '-'}</TableCell>
                          <TableCell>{movement.userName}</TableCell>
                          <TableCell>{movement.location}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              {(user?.role === 'admin' || user?.role === 'super_admin') && (
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Peringatan Stok</CardTitle>
                  <CardDescription>Alert stok rendah dan notifikasi sistem</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produk</TableHead>
                        <TableHead>Tipe</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Pesan</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAlerts.map((alert) => (
                        <TableRow key={alert.id}>
                          <TableCell className="font-medium">{alert.productName}</TableCell>
                          <TableCell className="capitalize">{alert.type.replace('_', ' ')}</TableCell>
                          <TableCell>
                            <Badge className={getAlertSeverityColor(alert.severity)}>
                              {alert.severity}
                            </Badge>
                          </TableCell>
                          <TableCell>{alert.message}</TableCell>
                          <TableCell>{alert.date.toLocaleDateString('id-ID')}</TableCell>
                          <TableCell>
                            <Badge variant={alert.isResolved ? "secondary" : "destructive"}>
                              {alert.isResolved ? 'Resolved' : 'Active'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              {!alert.isResolved && (user?.role === 'admin' || user?.role === 'super_admin') && (
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="audits" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Audit Inventori</CardTitle>
                  <CardDescription>Riwayat dan jadwal audit inventori</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Tipe</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Lokasi</TableHead>
                        <TableHead>Auditor</TableHead>
                        <TableHead>Expected</TableHead>
                        <TableHead>Actual</TableHead>
                        <TableHead>Discrepancies</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockInventoryAudits.map((audit) => (
                        <TableRow key={audit.id}>
                          <TableCell>{audit.date.toLocaleDateString('id-ID')}</TableCell>
                          <TableCell className="capitalize">{audit.type}</TableCell>
                          <TableCell>
                            <Badge variant={audit.status === 'completed' ? 'default' : audit.status === 'in_progress' ? 'secondary' : 'outline'}>
                              {audit.status.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>{audit.location}</TableCell>
                          <TableCell>{audit.auditorName}</TableCell>
                          <TableCell>{audit.expectedItems}</TableCell>
                          <TableCell>{audit.actualItems}</TableCell>
                          <TableCell className={audit.discrepancies > 0 ? 'text-destructive' : 'text-success'}>
                            {audit.discrepancies}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              {(user?.role === 'admin' || user?.role === 'super_admin') && (
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="warehouses" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Manajemen Gudang</CardTitle>
                  <CardDescription>Informasi dan status gudang</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama Gudang</TableHead>
                        <TableHead>Lokasi</TableHead>
                        <TableHead>Kapasitas</TableHead>
                        <TableHead>Okupansi</TableHead>
                        <TableHead>Utilization</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockWarehouses.map((warehouse) => (
                        <TableRow key={warehouse.id}>
                          <TableCell className="font-medium">{warehouse.name}</TableCell>
                          <TableCell>{warehouse.location}</TableCell>
                          <TableCell>{warehouse.capacity.toLocaleString()}</TableCell>
                          <TableCell>{warehouse.currentOccupancy.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-secondary rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                                  style={{ width: `${(warehouse.currentOccupancy / warehouse.capacity) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {Math.round((warehouse.currentOccupancy / warehouse.capacity) * 100)}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(warehouse.status)}>
                              {warehouse.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">
                                <MapPin className="w-4 h-4" />
                              </Button>
                              {(user?.role === 'admin' || user?.role === 'super_admin') && (
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </MainLayout>
  );
}