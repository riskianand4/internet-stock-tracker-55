import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, AlertTriangle, Target, Lightbulb, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DUMMY_PRODUCTS } from '@/data/dummyProducts';
import { PRODUCT_VELOCITY, STOCK_ALERTS, formatCurrency, formatNumber } from '@/data/mockHistoricalData';
import { TimeFilter } from '../AdvancedStatsOverview';

interface SmartInsightsProps {
  timeFilter: TimeFilter;
}

const SmartInsights = ({ timeFilter }: SmartInsightsProps) => {
  const insights = useMemo(() => {
    // Generate smart insights based on data analysis
    const totalValue = DUMMY_PRODUCTS.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const lowStockProducts = DUMMY_PRODUCTS.filter(p => p.status === 'low_stock');
    const fastMovingProducts = PRODUCT_VELOCITY.filter(p => p.turnoverRate > 40);
    const slowMovingProducts = PRODUCT_VELOCITY.filter(p => p.turnoverRate < 10);
    const criticalAlerts = STOCK_ALERTS.filter(a => a.type === 'critical');
    
    return [
      {
        id: 1,
        type: 'opportunity',
        icon: TrendingUp,
        title: 'Peluang Optimisasi Stok',
        message: `${slowMovingProducts.length} produk memiliki turnover rate rendah. Pertimbangkan untuk mengurangi stok atau promosi khusus.`,
        impact: 'high',
        timeframe: '1-2 minggu',
        actionable: true,
        data: {
          products: slowMovingProducts.slice(0, 3).map(p => p.productName),
          potentialSavings: slowMovingProducts.reduce((sum, p) => {
            const product = DUMMY_PRODUCTS.find(dp => dp.id === p.productId);
            return sum + (product ? product.price * product.stock * 0.1 : 0);
          }, 0)
        }
      },
      {
        id: 2,
        type: 'alert',
        icon: AlertTriangle,
        title: 'Prediksi Stok Habis',
        message: `${PRODUCT_VELOCITY.filter(p => p.daysUntilOutOfStock < 7).length} produk diprediksi akan habis dalam 7 hari berdasarkan pola konsumsi.`,
        impact: 'critical',
        timeframe: '3-7 hari',
        actionable: true,
        data: {
          products: PRODUCT_VELOCITY
            .filter(p => p.daysUntilOutOfStock < 7)
            .slice(0, 3)
            .map(p => p.productName),
          urgency: 'immediate'
        }
      },
      {
        id: 3,
        type: 'insight',
        icon: Brain,
        title: 'Analisis Pola Seasonal',
        message: `Network Equipment menunjukkan peningkatan aktivitas 30% dibanding periode sebelumnya. Antisipasi permintaan tinggi.`,
        impact: 'medium',
        timeframe: '2-4 minggu',
        actionable: true,
        data: {
          category: 'Network Equipment',
          growthRate: 30,
          recommendation: 'Increase stock by 25%'
        }
      },
      {
        id: 4,
        type: 'performance',
        icon: Target,
        title: 'Efisiensi Inventory',
        message: `Tingkat turnover inventory saat ini ${((fastMovingProducts.length / DUMMY_PRODUCTS.length) * 100).toFixed(1)}%. Target optimal adalah 60%.`,
        impact: 'medium',
        timeframe: 'Ongoing',
        actionable: true,
        data: {
          currentRate: (fastMovingProducts.length / DUMMY_PRODUCTS.length) * 100,
          targetRate: 60,
          gap: 60 - (fastMovingProducts.length / DUMMY_PRODUCTS.length) * 100
        }
      },
      {
        id: 5,
        type: 'recommendation',
        icon: Lightbulb,
        title: 'Rekomendasi Pembelian',
        message: `Berdasarkan analisis velocity, disarankan untuk melakukan reorder untuk ${PRODUCT_VELOCITY.filter(p => p.reorderRecommended).length} produk.`,
        impact: 'high',
        timeframe: 'Segera',
        actionable: true,
        data: {
          reorderCount: PRODUCT_VELOCITY.filter(p => p.reorderRecommended).length,
          estimatedCost: PRODUCT_VELOCITY
            .filter(p => p.reorderRecommended)
            .reduce((sum, p) => {
              const product = DUMMY_PRODUCTS.find(dp => dp.id === p.productId);
              return sum + (product ? product.price * product.minStock : 0);
            }, 0)
        }
      },
      {
        id: 6,
        type: 'trend',
        icon: Clock,
        title: 'Tren Temporal',
        message: `Pola aktivitas menunjukkan puncak pergerakan stok pada hari Selasa-Kamis. Optimalkan jadwal pengiriman.`,
        impact: 'low',
        timeframe: 'Ongoing',
        actionable: false,
        data: {
          peakDays: ['Selasa', 'Rabu', 'Kamis'],
          improvement: '15% efficiency gain'
        }
      }
    ];
  }, [timeFilter]);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'destructive';
      case 'high': return 'warning';
      case 'medium': return 'accent';
      default: return 'secondary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return TrendingUp;
      case 'alert': return AlertTriangle;
      case 'insight': return Brain;
      case 'performance': return Target;
      case 'recommendation': return Lightbulb;
      default: return Clock;
    }
  };

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-accent" />
          Smart Insights & Rekomendasi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => {
          const IconComponent = getTypeIcon(insight.type);
          
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-lg border bg-card/50 hover:bg-card/80 transition-all duration-300 group"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-${getImpactColor(insight.impact)}/10 group-hover:scale-110 transition-transform`}>
                  <IconComponent className={`w-4 h-4 text-${getImpactColor(insight.impact)}`} />
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={insight.impact === 'critical' ? 'destructive' : 'secondary'} 
                        className="text-xs"
                      >
                        {insight.impact}
                      </Badge>
                      {insight.actionable && (
                        <Badge variant="outline" className="text-xs">
                          Actionable
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {insight.message}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {insight.timeframe}
                    </span>
                    
                    {insight.data && (
                      <div className="text-right">
                        {insight.data.potentialSavings && (
                          <span className="text-success font-medium">
                            Potensi penghematan: {formatCurrency(insight.data.potentialSavings)}
                          </span>
                        )}
                        {insight.data.estimatedCost && (
                          <span className="text-warning font-medium">
                            Estimasi biaya: {formatCurrency(insight.data.estimatedCost)}
                          </span>
                        )}
                        {insight.data.currentRate && (
                          <div className="flex items-center gap-2">
                            <span>Progress: {insight.data.currentRate.toFixed(1)}%</span>
                            <Progress 
                              value={insight.data.currentRate} 
                              className="w-16 h-1"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {insight.data?.products && (
                    <div className="pt-2 border-t border-border/50">
                      <p className="text-xs text-muted-foreground mb-1">Produk terkait:</p>
                      <div className="flex flex-wrap gap-1">
                        {insight.data.products.map((product, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {product}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
        
        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="pt-4 border-t border-border/50"
        >
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 rounded-lg bg-primary/5">
              <div className="text-lg font-bold text-primary">
                {insights.filter(i => i.actionable).length}
              </div>
              <div className="text-xs text-muted-foreground">
                Insights Actionable
              </div>
            </div>
            <div className="p-3 rounded-lg bg-warning/5">
              <div className="text-lg font-bold text-warning">
                {insights.filter(i => i.impact === 'critical' || i.impact === 'high').length}
              </div>
              <div className="text-xs text-muted-foreground">
                Prioritas Tinggi
              </div>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default SmartInsights;