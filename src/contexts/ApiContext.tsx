import React, { createContext, useContext, useState, useEffect } from 'react';
import { InventoryApiService, initializeApiService, getApiService } from '@/services/inventoryApi';

interface ApiConfig {
  baseURL: string;
  apiKey: string;
  enabled: boolean;
}

interface ApiContextType {
  config: ApiConfig | null;
  apiService: InventoryApiService | null;
  isConfigured: boolean;
  isOnline: boolean;
  setConfig: (config: ApiConfig) => void;
  clearConfig: () => void;
  testConnection: () => Promise<boolean>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfigState] = useState<ApiConfig | null>(null);
  const [apiService, setApiService] = useState<InventoryApiService | null>(null);
  const [isOnline, setIsOnline] = useState(false);

  // Load saved config on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('api-config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfigState(parsed);
        if (parsed.enabled) {
          const service = initializeApiService(parsed);
          setApiService(service);
          // Test connection on load
          testConnection(service);
        }
      } catch (error) {
        console.error('Failed to load API config:', error);
        localStorage.removeItem('api-config');
      }
    }
  }, []);

  const setConfig = (newConfig: ApiConfig) => {
    setConfigState(newConfig);
    localStorage.setItem('api-config', JSON.stringify(newConfig));
    
    if (newConfig.enabled) {
      const service = initializeApiService(newConfig);
      setApiService(service);
      testConnection(service);
    } else {
      setApiService(null);
      setIsOnline(false);
    }
  };

  const clearConfig = () => {
    setConfigState(null);
    setApiService(null);
    setIsOnline(false);
    localStorage.removeItem('api-config');
  };

  const testConnection = async (service?: InventoryApiService): Promise<boolean> => {
    const serviceToTest = service || apiService;
    if (!serviceToTest) {
      setIsOnline(false);
      return false;
    }

    try {
      // Test with a simple stats endpoint
      await serviceToTest.getInventoryStats();
      setIsOnline(true);
      return true;
    } catch (error) {
      console.error('API connection test failed:', error);
      setIsOnline(false);
      return false;
    }
  };

  const value: ApiContextType = {
    config,
    apiService,
    isConfigured: config?.enabled ?? false,
    isOnline,
    setConfig,
    clearConfig,
    testConnection,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};