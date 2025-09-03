import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ModernLoginPage from '@/components/auth/ModernLoginPage';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StockMovementHistory from '@/components/inventory/StockMovementHistory';
import StockVelocityAnalysis from '@/components/analytics/StockVelocityAnalysis';
import CostAnalysis from '@/components/analytics/CostAnalysis';
import SupplierPerformance from '@/components/analytics/SupplierPerformance';
import AutomatedStockAlerts from '@/components/alerts/AutomatedStockAlerts';

const StockMovementPage = () => {
  const { user } = useAuth();

  if (!user) {
    return <ModernLoginPage />;
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Advanced Stock Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive stock movement tracking, velocity analysis, and automated alerts
          </p>
        </div>

        <Tabs defaultValue="movements" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="movements">Stock Movements</TabsTrigger>
            <TabsTrigger value="velocity">Velocity Analysis</TabsTrigger>
            <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
            <TabsTrigger value="suppliers">Supplier Performance</TabsTrigger>
            <TabsTrigger value="alerts">Automated Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="movements" className="space-y-4">
            <StockMovementHistory />
          </TabsContent>

          <TabsContent value="velocity" className="space-y-4">
            <StockVelocityAnalysis />
          </TabsContent>

          <TabsContent value="costs" className="space-y-4">
            <CostAnalysis />
          </TabsContent>

          <TabsContent value="suppliers" className="space-y-4">
            <SupplierPerformance />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <AutomatedStockAlerts />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default StockMovementPage;