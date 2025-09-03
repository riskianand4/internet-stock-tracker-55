import React, { memo, useState, useCallback, useMemo } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { motion } from 'framer-motion';
import { Product } from '@/types/inventory';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, MapPin, TrendingUp, TrendingDown, Wifi, Router, Server, Cable } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface OptimizedProductCardProps {
  product: Product;
  onClick: () => void;
  lazy?: boolean;
  priority?: boolean;
}

// Icon selector function
const getProductIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'router': return Router;
    case 'server': return Server;
    case 'kabel': return Cable;
    case 'modem': return Wifi;
    default: return Package;
  }
};

// Memoized status configuration
const useStatusConfig = (status: string) => {
  return useMemo(() => {
    switch (status) {
      case 'in_stock':
        return {
          color: 'text-success bg-success/10 border-success/20',
          label: 'Tersedia',
          indicatorClass: 'bg-success'
        };
      case 'low_stock':
        return {
          color: 'text-warning bg-warning/10 border-warning/20',
          label: 'Menipis',
          indicatorClass: 'bg-warning'
        };
      case 'out_of_stock':
        return {
          color: 'text-destructive bg-destructive/10 border-destructive/20',
          label: 'Habis',
          indicatorClass: 'bg-destructive'
        };
      default:
        return {
          color: 'text-muted-foreground bg-muted/10 border-muted/20',
          label: status,
          indicatorClass: 'bg-muted'
        };
    }
  }, [status]);
};

// Memoized price formatter
const formatPrice = memo((price: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
});

formatPrice.displayName = 'PriceFormatter';

// Memoized stock trend calculator
const getStockTrend = memo((stock: number) => {
  return stock > 50 ? 'up' : stock < 20 ? 'down' : 'stable';
});

getStockTrend.displayName = 'StockTrend';

// Loading skeleton for the card
const ProductCardSkeleton = memo(() => (
  <Card className="animate-pulse">
    <div className="w-full h-1 bg-muted" />
    <CardContent className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-4 w-2/3" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
    </CardContent>
  </Card>
));

ProductCardSkeleton.displayName = 'ProductCardSkeleton';

// Main optimized product card component
const OptimizedProductCard = memo<OptimizedProductCardProps>(({
  product,
  onClick,
  lazy = true,
  priority = false
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const Icon = getProductIcon(product.category);
  const statusConfig = useStatusConfig(product.status);
  const stockTrend = getStockTrend(product.stock);
  
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  const handleCardClick = useCallback(() => {
    onClick();
  }, [onClick]);

  return (
    <motion.div 
      className="group relative w-full"
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card className="relative overflow-hidden border-border/50 bg-card hover:shadow-strong transition-all duration-300 cursor-pointer hover-lift touch-manipulation">
        {/* Status Indicator */}
        <div className={`absolute top-0 left-0 w-full h-1 ${statusConfig.indicatorClass}`} />

        <CardContent className="p-4 sm:p-6" onClick={handleCardClick}>
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              {/* Product Image or Icon */}
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center ${statusConfig.color.replace('border-', 'bg-').replace('text-', 'text-')}`}>
                {product.image && !imageError ? (
                  <div className="relative w-full h-full">
                    {lazy ? (
                      <LazyLoadImage
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg sm:rounded-xl"
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        loading={priority ? 'eager' : 'lazy'}
                        placeholder={<Skeleton className="w-full h-full rounded-lg sm:rounded-xl" />}
                      />
                    ) : (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg sm:rounded-xl"
                        loading={priority ? 'eager' : 'lazy'}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                      />
                    )}
                  </div>
                ) : (
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate text-sm sm:text-base">
                  {product.name}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  {product.sku}
                </p>
              </div>
            </div>
          </div>

          {/* Status Badge and Stock Info */}
          <div className="flex items-center justify-between mb-4">
            <Badge 
              variant="outline" 
              className={`text-xs border ${statusConfig.color}`}
            >
              {statusConfig.label}
            </Badge>
            
            {/* Stock Trend - Hidden on mobile for space */}
            <div className="hidden sm:flex items-center space-x-1 text-xs text-muted-foreground">
              {stockTrend === 'up' && <TrendingUp className="w-3 h-3 text-success" />}
              {stockTrend === 'down' && <TrendingDown className="w-3 h-3 text-destructive" />}
              <span>{product.stock} unit</span>
            </div>
            
            {/* Mobile: Show only stock number */}
            <div className="sm:hidden text-xs text-muted-foreground">
              {product.stock} unit
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">{product.location}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-base sm:text-lg font-bold text-foreground">
                {formatPrice(product.price)}
              </span>
              <Badge variant="secondary" className="text-xs">
                {product.category}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

OptimizedProductCard.displayName = 'OptimizedProductCard';

export default OptimizedProductCard;
export { ProductCardSkeleton };