import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Package, DollarSign, AlertTriangle, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { HISTORICAL_DATA, getDataForPeriod, calculateGrowthRate, formatCurrency, formatNumber } from '@/data/mockHistoricalData';
import { TimeFilter, DateRange } from '../AdvancedStatsOverview';

interface KPIDashboardProps {
  timeFilter: TimeFilter;
  dateRange: DateRange;
}

const KPIDashboard = ({ timeFilter, dateRange }: KPIDashboardProps) => {
  const analytics = useMemo(() => {
    const days = timeFilter === 'week' ? 7 : 
                 timeFilter === 'month' ? 30 :
                 timeFilter === 'quarter' ? 90 :
                 timeFilter === 'year' ? 365 : 30;
                 
    const currentData = getDataForPeriod(HISTORICAL_DATA, days);
    const previousData = getDataForPeriod(HISTORICAL_DATA, days * 2).slice(0, days);
    
    const current = currentData[currentData.length - 1] || HISTORICAL_DATA[HISTORICAL_DATA.length - 1];
    const previous = previousData[previousData.length - 1] || HISTORICAL_DATA[0];
    
    const avgCurrentValue = currentData.reduce((sum, d) => sum + d.totalValue, 0) / currentData.length;
    const avgPreviousValue = previousData.reduce((sum, d) => sum + d.totalValue, 0) / previousData.length;
    
    const totalStockMovements = currentData.reduce((sum, d) => sum + d.stockMovements, 0);
    const avgStockMovements = totalStockMovements / currentData.length;
    
    return {
      totalProducts: current.totalProducts,
      totalValue: avgCurrentValue,
      totalValueGrowth: calculateGrowthRate(avgCurrentValue, avgPreviousValue),
      lowStockCount: current.lowStockCount,
      outOfStockCount: current.outOfStockCount,
      stockMovements: totalStockMovements,
      avgDailyMovements: avgStockMovements,
      turnoverRate: (avgStockMovements / current.totalProducts) * 100,
      stockHealth: Math.max(0, 100 - (current.lowStockCount * 10) - (current.outOfStockCount * 20))
    };
  }, [timeFilter, dateRange]);

  const kpiCards = [
    {
      title: 'Total Produk',
      value: analytics.totalProducts,
      format: 'number',
      icon: Package,
      color: 'primary',
      subtitle: 'Produk Aktif'
    },
    {
      title: 'Nilai Total Inventori',
      value: analytics.totalValue,
      format: 'currency',
      icon: DollarSign,
      color: 'success',
      growth: analytics.totalValueGrowth,
      subtitle: `${analytics.totalValueGrowth > 0 ? 'Naik' : 'Turun'} dari periode sebelumnya`
    },
    {
      title: 'Pergerakan Stok',
      value: analytics.stockMovements,
      format: 'number',
      icon: BarChart3,
      color: 'accent',
      subtitle: `${formatNumber(analytics.avgDailyMovements)} per hari rata-rata`
    },
    {
      title: 'Status Stok',
      value: analytics.stockHealth,
      format: 'percentage',
      icon: AlertTriangle,
      color: analytics.stockHealth > 80 ? 'success' : analytics.stockHealth > 60 ? 'warning' : 'destructive',
      subtitle: `${analytics.lowStockCount} rendah, ${analytics.outOfStockCount} habis`
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {kpiCards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="relative overflow-hidden group hover-lift glass">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <card.icon className={`w-5 h-5 text-${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">
                    {card.format === 'currency' ? formatCurrency(card.value) :
                     card.format === 'percentage' ? `${Math.round(card.value)}%` :
                     formatNumber(card.value)}
                  </span>
                  {card.growth !== undefined && (
                    <Badge 
                      variant={card.growth > 0 ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {card.growth > 0 ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {Math.abs(card.growth)}%
                    </Badge>
                  )}
                </div>
                
                {card.format === 'percentage' && (
                  <Progress 
                    value={card.value} 
                    className={`h-2 bg-${card.color}-light`}
                  />
                )}
                
                <p className="text-xs text-muted-foreground">
                  {card.subtitle}
                </p>
              </div>
            </CardContent>
            
            {/* Hover effect overlay */}
            <div className={`absolute inset-0 bg-${card.color}/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default KPIDashboard;