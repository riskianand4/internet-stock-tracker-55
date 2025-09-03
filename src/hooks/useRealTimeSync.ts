import { useState, useEffect, useCallback, useRef } from 'react';
import { useApi } from '@/contexts/ApiContext';
import useNotifications from '@/hooks/useNotifications';
import { useToast } from '@/hooks/use-toast';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useDataPersistence } from '@/hooks/useDataPersistence';

interface RealTimeSyncOptions {
  enabled?: boolean;
  syncInterval?: number;
  stockAlertThreshold?: number;
}

export const useRealTimeSync = (options: RealTimeSyncOptions = {}) => {
  const {
    enabled = true,
    syncInterval = 30000, // 30 seconds
    stockAlertThreshold = 5,
  } = options;

  const { isConfigured, isOnline, apiService } = useApi();
  const { notifyStockAlert, notifyApiError, notifySuccess } = useNotifications();
  const { toast } = useToast();
  const { logApiError } = useErrorHandler('RealTimeSync');
  
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error' | 'success'>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [errorCount, setErrorCount] = useState(0);
  
  const syncInProgressRef = useRef(false);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Persist sync state
  const { data: persistedState, updateData: updatePersistedState } = useDataPersistence({
    lastSuccessfulSync: null as Date | null,
    consecutiveErrors: 0,
    lastKnownGoodData: null as any,
  }, {
    key: 'realtime-sync-state',
    version: 1,
  });

  // Check for stock alerts
  const checkStockAlerts = useCallback(async () => {
    if (!isConfigured || !isOnline || !apiService) return;

    try {
      const response = await apiService.getStockAlerts();
      if (response.success && response.data.length > 0) {
        response.data.forEach((alert: any) => {
          notifyStockAlert(alert.productName, alert.currentStock, alert.threshold);
        });
      }
    } catch (error) {
      console.error('Failed to check stock alerts:', error);
    }
  }, [isConfigured, isOnline, apiService, notifyStockAlert]);

  // Sync inventory data with improved error handling and retry logic
  const syncInventoryData = useCallback(async () => {
    if (!isConfigured || !isOnline || !apiService || syncInProgressRef.current) {
      setSyncStatus('idle');
      return;
    }

    syncInProgressRef.current = true;
    setSyncStatus('syncing');

    try {
      // Clear any pending retry
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }

      // Sync multiple data sources in parallel with timeout
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Sync timeout')), 15000)
      );

      const syncPromise = Promise.all([
        apiService.getInventoryStats(),
        apiService.getStockAlerts(),
      ]);

      const [statsResponse, alertsResponse] = await Promise.race([syncPromise, timeout]) as any[];

      if (statsResponse?.success && alertsResponse?.success) {
        setSyncStatus('success');
        const now = new Date();
        setLastSyncTime(now);
        setErrorCount(0);

        // Update persisted state
        updatePersistedState(prev => ({
          ...prev,
          lastSuccessfulSync: now,
          consecutiveErrors: 0,
          lastKnownGoodData: {
            stats: statsResponse.data,
            alerts: alertsResponse.data,
          },
        }));

        // Check for critical alerts
        const criticalAlerts = alertsResponse.data?.filter?.(
          (alert: any) => alert.severity === 'CRITICAL'
        ) || [];

        if (criticalAlerts.length > 0) {
          criticalAlerts.forEach((alert: any) => {
            notifyStockAlert(alert.productName, alert.currentStock, alert.threshold);
          });
        }

        // Show success notification only after errors
        if (errorCount > 0) {
          notifySuccess('Sync Restored', 'Successfully reconnected to server');
        }
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (error) {
      setSyncStatus('error');
      setErrorCount(prev => prev + 1);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Log the error
      logApiError(
        error instanceof Error ? error : new Error(errorMessage),
        'sync',
        'syncInventoryData'
      );

      // Update persisted state
      updatePersistedState(prev => ({
        ...prev,
        consecutiveErrors: prev.consecutiveErrors + 1,
      }));
      
      // Implement exponential backoff for retries
      const backoffDelay = Math.min(1000 * Math.pow(2, errorCount), 30000); // Max 30s
      
      // Only show error notification after multiple failures and not too frequently
      if (errorCount >= 2 && errorCount % 5 === 0) {
        notifyApiError('sync inventory data', errorMessage);
      }

      // Schedule retry if enabled and not too many consecutive errors
      if (enabled && errorCount < 10) {
        retryTimeoutRef.current = setTimeout(() => {
          syncInventoryData();
        }, backoffDelay);
      }

      console.error('Real-time sync failed:', error);
    } finally {
      syncInProgressRef.current = false;
    }
  }, [isConfigured, isOnline, apiService, notifyStockAlert, notifyApiError, notifySuccess, errorCount, logApiError, updatePersistedState, enabled]);

  // Manual sync function
  const manualSync = useCallback(async () => {
    await syncInventoryData();
    toast({
      title: 'Sync Triggered',
      description: 'Inventory data synchronization started',
    });
  }, [syncInventoryData, toast]);

  // Auto sync effect
  useEffect(() => {
    if (!enabled) return;

    // Initial sync
    syncInventoryData();

    // Set up interval for regular syncing
    const intervalId = setInterval(() => {
      syncInventoryData();
      checkStockAlerts();
    }, syncInterval);

    return () => clearInterval(intervalId);
  }, [enabled, syncInterval, syncInventoryData, checkStockAlerts]);

  // Connection status monitoring
  useEffect(() => {
    const checkConnection = () => {
      if (!isConfigured) {
        setSyncStatus('idle');
      } else if (!isOnline) {
        setSyncStatus('error');
      }
    };

    checkConnection();
  }, [isConfigured, isOnline]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      syncInProgressRef.current = false;
    };
  }, []);

  return {
    syncStatus,
    lastSyncTime: lastSyncTime || persistedState.lastSuccessfulSync,
    errorCount,
    manualSync,
    isRealTimeEnabled: enabled && isConfigured && isOnline,
    lastKnownGoodData: persistedState.lastKnownGoodData,
    consecutiveErrors: persistedState.consecutiveErrors,
  };
};