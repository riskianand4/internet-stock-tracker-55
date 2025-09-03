import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, TrendingUp, Calendar, Target } from 'lucide-react';
import { PRODUCT_VELOCITY, formatCurrency, formatNumber } from '@/data/mockHistoricalData';

const PredictiveAnalytics = () => {
  const predictions = useMemo(() => {
    // Generate predictive data for the next 30 days
    const futureData = [];
    const baseDate = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() + i);
      
      // Simulate predictions with some seasonality
      const seasonalFactor = 1 + Math.sin((i / 30) * Math.PI * 2) * 0.2;
      const trendFactor = 1 + (i / 30) * 0.1; // slight upward trend
      const randomFactor = 0.9 + Math.random() * 0.2;
      
      const baseDemand = 15;
      const predictedDemand = baseDemand * seasonalFactor * trendFactor * randomFactor;
      
      futureData.push({
        date: date.toISOString().split('T')[0],
        formattedDate: date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
        predictedDemand: Math.round(predictedDemand),
        confidenceHigh: Math.round(predictedDemand * 1.2),
        confidenceLow: Math.round(predictedDemand * 0.8),
        reorderAlert: Math.random() > 0.8,
        stockoutRisk: Math.random() * 100,
        demandSpike: Math.random() > 0.9
      });
    }
    
    return futureData;
  }, []);

  const reorderPredictions = useMemo(() => {
    return PRODUCT_VELOCITY
      .filter(p => p.daysUntilOutOfStock < 30)
      .sort((a, b) => a.daysUntilOutOfStock - b.daysUntilOutOfStock)
      .slice(0, 8)
      .map(p => ({
        ...p,
        predictedStockout: new Date(Date.now() + p.daysUntilOutOfStock * 24 * 60 * 60 * 1000),
        reorderDate: new Date(Date.now() + (p.daysUntilOutOfStock - 3) * 24 * 60 * 60 * 1000),
        confidence: 85 + Math.random() * 10,
        seasonalAdjustment: p.seasonalIndex
      }));
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((item: any, index: number) => (
            <p key={index} style={{ color: item.color }} className="text-sm">
              {item.name}: {formatNumber(item.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getRiskColor = (risk: number) => {
    if (risk > 70) return 'destructive';
    if (risk > 40) return 'warning';
    return 'success';
  };

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-accent" />
          Predictive Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="demand" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="demand">Prediksi Demand</TabsTrigger>
            <TabsTrigger value="reorder">Reorder Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="demand" className="space-y-6">
            {/* Demand Prediction Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-80"
            >
              <h3 className="text-sm font-medium mb-4">Prediksi Permintaan 30 Hari Kedepan</h3>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={predictions}>
                  <defs>
                    <linearGradient id="demandGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--muted))" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="hsl(var(--muted))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="formattedDate" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="confidenceHigh" 
                    stackId="1"
                    stroke="none"
                    fill="url(#confidenceGradient)"
                    name="Confidence High"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="confidenceLow" 
                    stackId="1"
                    stroke="none"
                    fill="url(#confidenceGradient)"
                    name="Confidence Low"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predictedDemand" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={2}
                    name="Prediksi Demand"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Risk Indicators */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border bg-card/50">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium">Demand Spikes</span>
                </div>
                <div className="text-2xl font-bold text-accent">
                  {predictions.filter(p => p.demandSpike).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Prediksi lonjakan dalam 30 hari
                </p>
              </div>
              
              <div className="p-4 rounded-lg border bg-card/50">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-warning" />
                  <span className="text-sm font-medium">Avg Stockout Risk</span>
                </div>
                <div className="text-2xl font-bold text-warning">
                  {(predictions.reduce((sum, p) => sum + p.stockoutRisk, 0) / predictions.length).toFixed(0)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Risiko rata-rata kehabisan stok
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reorder" className="space-y-4">
            {/* Reorder Timeline */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Timeline Reorder Prediksi</h3>
              {reorderPredictions.map((item, index) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg border bg-card/50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{item.productName}</span>
                      <Badge 
                        variant={item.daysUntilOutOfStock < 7 ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {item.daysUntilOutOfStock} hari
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Confidence: {item.confidence.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Reorder Date:</span>
                      <span className="font-medium">
                        {item.reorderDate.toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Predicted Stockout:</span>
                      <span className={`font-medium text-${getRiskColor(item.daysUntilOutOfStock * 10)}`}>
                        {item.predictedStockout.toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Seasonal Factor:</span>
                      <span className="font-medium">
                        {item.seasonalAdjustment > 1 ? '+' : ''}{((item.seasonalAdjustment - 1) * 100).toFixed(0)}%
                      </span>
                    </div>
                    
                    <Progress 
                      value={item.confidence} 
                      className="h-1 mt-2"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PredictiveAnalytics;