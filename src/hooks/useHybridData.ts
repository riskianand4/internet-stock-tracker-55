import { useState, useEffect, useCallback, useRef } from 'react';
import { useApi } from '@/contexts/ApiContext';
import { useToast } from '@/hooks/use-toast';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface UseHybridDataOptions {
  localData: any;
  localFunction?: () => any;
  apiFunction?: () => Promise<any>;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseHybridDataReturn<T> {
  data: T;
  isLoading: boolean;
  error: string | null;
  isFromApi: boolean;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
  clearError: () => void;
}

export function useHybridData<T>({
  localData,
  localFunction,
  apiFunction,
  autoRefresh = false,
  refreshInterval = 30000, // 30 seconds
}: UseHybridDataOptions): UseHybridDataReturn<T> {
  const { isConfigured, isOnline, apiService } = useApi();
  const { toast } = useToast();
  const { logApiError } = useErrorHandler('HybridData');
  
  const [data, setData] = useState<T>(localData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFromApi, setIsFromApi] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const retryCount = useRef(0);
  const maxRetries = 3;

  const loadData = useCallback(async (isRetry: boolean = false) => {
    setIsLoading(true);
    setError(null);

    try {
      // Use API if configured and online
      if (isConfigured && isOnline && apiService && apiFunction) {
        const response = await apiFunction();
        
        if (response?.success && response.data !== undefined) {
          setData(response.data);
          setIsFromApi(true);
          setLastUpdated(new Date());
          retryCount.current = 0; // Reset retry count on success
        } else {
          throw new Error(response?.error || response?.message || 'API request failed');
        }
      } else {
        // Fallback to local data
        const result = localFunction ? localFunction() : localData;
        setData(result);
        setIsFromApi(false);
        setLastUpdated(new Date());
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Failed to load data:', err);
      
      // Log API error if this was an API call
      if (isConfigured && isOnline && apiService && apiFunction) {
        logApiError(
          err instanceof Error ? err : new Error(errorMessage),
          'hybrid-data',
          'loadData'
        );
      }
      
      setError(errorMessage);
      
      // Implement retry logic with exponential backoff
      if (isRetry && retryCount.current < maxRetries) {
        retryCount.current++;
        const delay = Math.pow(2, retryCount.current) * 1000; // 2s, 4s, 8s
        
        setTimeout(() => {
          loadData(true);
        }, delay);
        
        return;
      }
      
      // Fallback to local data on API error
      const result = localFunction ? localFunction() : localData;
      setData(result);
      setIsFromApi(false);
      setLastUpdated(new Date());
      
      // Only show toast for non-retry attempts to avoid spam
      if (!isRetry) {
        toast({
          title: "Connection Issue",
          description: "Using local data. Will retry automatically.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [isConfigured, isOnline, apiService, apiFunction, localFunction, localData, toast, logApiError]);

  const refresh = useCallback(async () => {
    retryCount.current = 0; // Reset retry count for manual refresh
    await loadData();
  }, [loadData]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initial load
  useEffect(() => {
    loadData();
  }, [isConfigured, isOnline]);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh || !isFromApi) return;

    const interval = setInterval(() => {
      loadData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, isFromApi]);

  return {
    data,
    isLoading,
    error,
    isFromApi,
    lastUpdated,
    refresh,
    clearError,
  };
}

// Specialized hooks for common use cases
export function useHybridProducts() {
  const { apiService } = useApi();
  const { DUMMY_PRODUCTS } = require('@/data/dummyProducts');
  
  return useHybridData({
    localData: DUMMY_PRODUCTS,
    apiFunction: async () => {
      if (!apiService) throw new Error('API service not available');
      return await apiService.getProducts();
    },
    autoRefresh: true,
  });
}

export function useHybridStockMovements() {
  const { apiService } = useApi();
  const { mockStockMovements } = require('@/data/mockStockMovements');
  
  return useHybridData({
    localData: mockStockMovements,
    apiFunction: async () => {
      if (!apiService) throw new Error('API service not available');
      return await apiService.getStockMovements();
    },
    autoRefresh: true,
  });
}

export function useHybridInventoryStats() {
  const { apiService } = useApi();
  
  return useHybridData({
    localData: {
      totalProducts: 0,
      totalValue: 0,
      lowStockCount: 0,
      outOfStockCount: 0,
      topProducts: [],
    },
    localFunction: () => {
      // Calculate from local data
      const { DUMMY_PRODUCTS } = require('@/data/dummyProducts');
      return {
        totalProducts: DUMMY_PRODUCTS.length,
        totalValue: DUMMY_PRODUCTS.reduce((sum: number, p: any) => sum + (p.price * p.stock), 0),
        lowStockCount: DUMMY_PRODUCTS.filter((p: any) => p.status === 'low_stock').length,
        outOfStockCount: DUMMY_PRODUCTS.filter((p: any) => p.status === 'out_of_stock').length,
        topProducts: DUMMY_PRODUCTS.slice(0, 5),
      };
    },
    apiFunction: async () => {
      if (!apiService) throw new Error('API service not available');
      return await apiService.getInventoryStats();
    },
    autoRefresh: true,
  });
}