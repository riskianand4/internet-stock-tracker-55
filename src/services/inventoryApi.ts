import { apiLogger } from './apiLogger';
import { errorHandler } from './errorHandler';

interface ApiConfig {
  baseURL: string;
  apiKey: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export class InventoryApiService {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.baseURL}${endpoint}`;
    const startTime = Date.now();
    const method = options.method || 'GET';
    
    // Validate endpoint
    if (!endpoint || !endpoint.startsWith('/')) {
      const error = new Error('Invalid endpoint format');
      errorHandler.logError(error, { component: 'InventoryApi', action: 'makeRequest' }, 'high');
      throw error;
    }
    
    // Check rate limiting (mock implementation)
    const rateLimitCheck = apiLogger.checkRateLimit('current-api-key', 1000);
    if (!rateLimitCheck.allowed) {
      const error = new Error(`Rate limit exceeded. Try again in ${Math.ceil((rateLimitCheck.resetTime - Date.now()) / 1000)} seconds`);
      apiLogger.logApiRequest(method, endpoint, 429, Date.now() - startTime, 'current-api-key', {
        error: error.message
      });
      throw error;
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'X-API-Key': this.config.apiKey,
      'X-Rate-Limit-Remaining': rateLimitCheck.remaining.toString(),
      'X-Rate-Limit-Reset': rateLimitCheck.resetTime.toString(),
      ...options.headers,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
      
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;
      const statusCode = response.status;

      // Log the API request
      apiLogger.logApiRequest(
        method,
        endpoint,
        statusCode,
        responseTime,
        'current-api-key',
        {
          requestSize: options.body ? new Blob([options.body as string]).size : 0,
          responseSize: response.headers.get('content-length') ? parseInt(response.headers.get('content-length')!) : 0
        }
      );

      if (!response.ok) {
        let errorText = '';
        try {
          errorText = await response.text();
        } catch {
          errorText = 'Unable to read error response';
        }
        
        const error = new Error(`HTTP ${response.status}: ${response.statusText}${errorText ? ` - ${errorText}` : ''}`);
        errorHandler.logError(error, { 
          component: 'InventoryApi', 
          action: `${method} ${endpoint}`,
          additionalData: { statusCode, responseTime }
        }, statusCode >= 500 ? 'high' : 'medium');
        throw error;
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        const error = new Error('Invalid JSON response from server');
        errorHandler.logError(error, { 
          component: 'InventoryApi', 
          action: `${method} ${endpoint}`,
          additionalData: { statusCode, responseTime }
        }, 'high');
        throw error;
      }

      // Validate response structure
      if (data && typeof data === 'object' && 'success' in data) {
        return data;
      } else {
        // Wrap non-standard responses
        return { success: true, data };
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      let statusCode = 500;
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          statusCode = 408; // Timeout
        } else if (error.message.includes('HTTP ')) {
          statusCode = parseInt(error.message.match(/HTTP (\d+)/)?.[1] || '500');
        } else if (error.message.includes('Failed to fetch')) {
          statusCode = 0; // Network error
        }
      }
      
      // Log the failed request
      apiLogger.logApiRequest(
        method,
        endpoint,
        statusCode,
        responseTime,
        'current-api-key',
        { error: errorMessage }
      );
      
      // Enhanced error logging
      errorHandler.logError(
        error instanceof Error ? error : new Error(errorMessage),
        { 
          component: 'InventoryApi', 
          action: `${method} ${endpoint}`,
          additionalData: { url, responseTime, statusCode }
        },
        statusCode === 0 ? 'high' : 'medium'
      );
      
      console.error(`API Request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Product Management
  async getProducts(filters: {
    page?: number;
    limit?: number;
    category?: string;
    status?: string;
    search?: string;
  } = {}): Promise<ApiResponse<PaginatedResponse<any>>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, value.toString());
    });
    
    return this.makeRequest(`/api/products?${params.toString()}`);
  }

  async getProduct(id: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/api/products/${id}`);
  }

  async createProduct(product: any): Promise<ApiResponse<any>> {
    return this.makeRequest('/api/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  async updateProduct(id: string, updates: any): Promise<ApiResponse<any>> {
    return this.makeRequest(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteProduct(id: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/api/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Inventory Management
  async getInventoryStats(): Promise<ApiResponse<any>> {
    return this.makeRequest('/api/inventory/stats');
  }

  async getStockMovements(filters: {
    productId?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<ApiResponse<PaginatedResponse<any>>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, value.toString());
    });
    
    return this.makeRequest(`/api/inventory/movements?${params.toString()}`);
  }

  async recordStockMovement(movement: {
    productId: string;
    type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'TRANSFER';
    quantity: number;
    reason: string;
    reference?: string;
    location: string;
    notes?: string;
  }): Promise<ApiResponse<any>> {
    return this.makeRequest('/api/inventory/movements', {
      method: 'POST',
      body: JSON.stringify(movement),
    });
  }

  async getStockAlerts(): Promise<ApiResponse<any[]>> {
    return this.makeRequest('/api/inventory/alerts');
  }

  // Analytics
  async getVelocityAnalysis(filters: {
    period?: 'week' | 'month' | 'quarter';
    productIds?: string[];
  } = {}): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v));
        } else {
          params.append(key, value.toString());
        }
      }
    });
    
    return this.makeRequest(`/api/analytics/velocity?${params.toString()}`);
  }

  async getCostAnalysis(filters: {
    startDate?: string;
    endDate?: string;
    productIds?: string[];
  } = {}): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v));
        } else {
          params.append(key, value.toString());
        }
      }
    });
    
    return this.makeRequest(`/api/analytics/costs?${params.toString()}`);
  }

  async getSupplierPerformance(): Promise<ApiResponse<any[]>> {
    return this.makeRequest('/api/analytics/suppliers');
  }

  async getTrends(filters: {
    metric: 'sales' | 'stock' | 'velocity';
    period: 'daily' | 'weekly' | 'monthly';
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, value.toString());
    });
    
    return this.makeRequest(`/api/analytics/trends?${params.toString()}`);
  }
}

// Singleton instance
let apiService: InventoryApiService | null = null;

export const getApiService = (): InventoryApiService | null => {
  return apiService;
};

export const initializeApiService = (config: ApiConfig) => {
  apiService = new InventoryApiService(config);
  return apiService;
};

export const isApiConfigured = (): boolean => {
  return apiService !== null;
};