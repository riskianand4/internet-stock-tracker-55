import React, { memo, useCallback, useMemo, lazy, Suspense } from 'react';
// @ts-ignore - react-window types issue
import { FixedSizeList } from 'react-window';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { useErrorHandler } from '@/hooks/useErrorHandler';

// Lazy load the heavy product card component
const ModernProductCard = lazy(() => import('./ModernProductCard'));

interface VirtualizedProductGridProps {
  products: any[];
  onProductClick: (product: any) => void;
  itemsPerRow?: number;
  itemHeight?: number;
  containerHeight?: number;
}

interface ProductRowProps {
  index: number;
  style: React.CSSProperties;
  data: {
    products: any[];
    itemsPerRow: number;
    onProductClick: (product: any) => void;
  };
}

// Memoized product row component
const ProductRow = memo<ProductRowProps>(({ index, style, data }) => {
  const { products, itemsPerRow, onProductClick } = data;
  const startIndex = index * itemsPerRow;
  const endIndex = Math.min(startIndex + itemsPerRow, products.length);
  const rowProducts = products.slice(startIndex, endIndex);

  return (
    <div style={style} className="flex gap-4 px-4">
      {rowProducts.map((product) => (
        <div key={product.id} className="flex-1 min-w-0">
          <Suspense 
            fallback={<ProductCardSkeleton />}
          >
            <ModernProductCard
              product={product}
              onClick={() => onProductClick(product)}
            />
          </Suspense>
        </div>
      ))}
      {/* Fill empty slots if last row is incomplete */}
      {Array.from({ length: itemsPerRow - rowProducts.length }).map((_, i) => (
        <div key={`empty-${i}`} className="flex-1" />
      ))}
    </div>
  );
});

ProductRow.displayName = 'ProductRow';

// Skeleton loader for lazy-loaded components
const ProductCardSkeleton = memo(() => (
  <div className="space-y-3 p-4 border rounded-lg">
    <div className="flex items-center space-x-3">
      <Skeleton className="w-12 h-12 rounded-lg" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    <Skeleton className="h-3 w-1/4" />
    <div className="flex justify-between">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  </div>
));

ProductCardSkeleton.displayName = 'ProductCardSkeleton';

// Main virtualized grid component
export const VirtualizedProductGrid = memo<VirtualizedProductGridProps>(({
  products,
  onProductClick,
  itemsPerRow = 4,
  itemHeight = 280,
  containerHeight = 600,
}) => {
  const { logError } = useErrorHandler('VirtualizedProductGrid');

  // Calculate number of rows needed
  const rowCount = useMemo(() => 
    Math.ceil(products.length / itemsPerRow), 
    [products.length, itemsPerRow]
  );

  // Memoized item data to prevent unnecessary re-renders
  const itemData = useMemo(() => ({
    products,
    itemsPerRow,
    onProductClick,
  }), [products, itemsPerRow, onProductClick]);

  // Error boundary for virtualized content
  const handleListError = useCallback((error: Error) => {
    logError(error, 'virtualizedList', true);
  }, [logError]);

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Tidak ada produk untuk ditampilkan</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <FixedSizeList
        height={containerHeight}
        itemCount={rowCount}
        itemSize={itemHeight}
        itemData={itemData}
        overscanCount={2}
        onItemsRendered={({ visibleStartIndex, visibleStopIndex }) => {
          console.debug(`Visible rows: ${visibleStartIndex} to ${visibleStopIndex}`);
        }}
      >
        {ProductRow}
      </FixedSizeList>
    </motion.div>
  );
});

VirtualizedProductGrid.displayName = 'VirtualizedProductGrid';

// Hook for responsive items per row calculation
export const useResponsiveItemsPerRow = () => {
  const [itemsPerRow, setItemsPerRow] = React.useState(4);

  React.useEffect(() => {
    const updateItemsPerRow = () => {
      const width = window.innerWidth;
      if (width < 640) setItemsPerRow(1);      // mobile
      else if (width < 768) setItemsPerRow(2); // tablet
      else if (width < 1024) setItemsPerRow(3); // laptop
      else if (width < 1280) setItemsPerRow(4); // desktop
      else setItemsPerRow(5);                   // large desktop
    };

    updateItemsPerRow();
    window.addEventListener('resize', updateItemsPerRow);
    
    return () => window.removeEventListener('resize', updateItemsPerRow);
  }, []);

  return itemsPerRow;
};