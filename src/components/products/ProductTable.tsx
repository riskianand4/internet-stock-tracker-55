import React from 'react';
import { MoreVertical, Edit, Trash2, Eye, ArrowUpDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Product } from '@/types/inventory';

interface ProductTableProps {
  products: Product[];
  selectedProducts: string[];
  onSelectionChange: (selected: string[]) => void;
  onView?: (product: Product) => void;
  onEdit?: (product: Product) => void;
}

const ProductTable = ({ products, selectedProducts, onSelectionChange, onView, onEdit }: ProductTableProps) => {
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(products.map(p => p.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedProducts, productId]);
    } else {
      onSelectionChange(selectedProducts.filter(id => id !== productId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'success';
      case 'low_stock': return 'warning';
      case 'out_of_stock': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in_stock': return 'Tersedia';
      case 'low_stock': return 'Stok Menipis';
      case 'out_of_stock': return 'Stok Habis';
      default: return status;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const isAllSelected = products.length > 0 && selectedProducts.length === products.length;
  const isIndeterminate = selectedProducts.length > 0 && selectedProducts.length < products.length;

  // Action handlers
  const handleViewProduct = (product: Product) => {
    onView?.(product);
  };

  const handleEditProduct = (product: Product) => {
    onEdit?.(product);
  };

  const handleDeleteProduct = (product: Product) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus "${product.name}"?`)) {
      console.log('Delete product:', product);
      // In a real app, this would call an API to delete the product
      // Remove from local selection if selected
      if (selectedProducts.includes(product.id)) {
        onSelectionChange(selectedProducts.filter(id => id !== product.id));
      }
    }
  };

  return (
    <Card className="glass overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50">
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="min-w-[200px]">
                <Button variant="ghost" className="h-auto p-0 font-medium">
                  Produk
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="h-auto p-0 font-medium">
                  SKU
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="h-auto p-0 font-medium">
                  Kategori
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" className="h-auto p-0 font-medium">
                  Harga
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" className="h-auto p-0 font-medium">
                  Stok
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="h-auto p-0 font-medium">
                  Status
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="h-auto p-0 font-medium">
                  Lokasi
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="h-auto p-0 font-medium">
                  Supplier
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="h-auto p-0 font-medium">
                  Update Terakhir
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const isSelected = selectedProducts.includes(product.id);
              
              return (
                <TableRow 
                  key={product.id} 
                  className={`border-border/50 hover:bg-muted/50 ${isSelected ? 'bg-primary/5' : ''}`}
                >
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => handleSelectProduct(product.id, checked as boolean)}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium">
                          {product.name.charAt(0)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{product.name}</p>
                        {product.description && (
                          <p className="text-xs text-muted-foreground truncate">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {product.sku}
                    </code>
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                  </TableCell>
                  
                  <TableCell className="text-right font-medium">
                    {formatCurrency(product.price)}
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <div className="text-right space-y-1">
                      <span className="font-medium">{product.stock}</span>
                      <div className="text-xs text-muted-foreground">
                        min: {product.minStock}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge 
                      variant={getStatusColor(product.status) === 'success' ? 'default' : 'secondary'}
                      className={`text-xs ${
                        getStatusColor(product.status) === 'warning' ? 'bg-warning text-warning-foreground' :
                        getStatusColor(product.status) === 'destructive' ? 'bg-destructive text-destructive-foreground' : ''
                      }`}
                    >
                      {getStatusLabel(product.status)}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {product.location || '-'}
                    </span>
                  </TableCell>
                  
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {product.supplier || '-'}
                    </span>
                  </TableCell>
                  
                  <TableCell>
                    <span className="text-xs text-muted-foreground">
                      {new Date(product.lastUpdated).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </TableCell>
                  
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                       <DropdownMenuContent align="end" className="bg-background border shadow-lg z-50">
                         <DropdownMenuItem onClick={() => handleViewProduct(product)}>
                           <Eye className="mr-2 h-4 w-4" />
                           Lihat Detail
                         </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                           <Edit className="mr-2 h-4 w-4" />
                           Edit Produk
                         </DropdownMenuItem>
                         <DropdownMenuSeparator />
                         <DropdownMenuItem 
                           onClick={() => handleDeleteProduct(product)}
                           className="text-destructive focus:text-destructive"
                         >
                           <Trash2 className="mr-2 h-4 w-4" />
                           Hapus Produk
                         </DropdownMenuItem>
                       </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      {products.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          Tidak ada produk untuk ditampilkan
        </div>
      )}
    </Card>
  );
};

export default ProductTable;