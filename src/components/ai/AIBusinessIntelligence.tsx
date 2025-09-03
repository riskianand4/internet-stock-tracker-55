import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Brain, TrendingUp, Target, Lightbulb, Zap, DollarSign, ShoppingCart, AlertTriangle, Users, Calendar } from 'lucide-react';
import { DUMMY_PRODUCTS } from '@/data/dummyProducts';
import { PRODUCT_VELOCITY, formatCurrency, formatNumber } from '@/data/mockHistoricalData';
interface BusinessInsight {
  id: string;
  title: string;
  type: 'trend' | 'prediction' | 'optimization' | 'risk' | 'opportunity';
  priority: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  impact: {
    financial: number;
    operational: number;
    strategic: number;
  };
  description: string;
  recommendations: string[];
  dataSource: string;
  aiModel: string;
  generatedAt: Date;
  expiresAt: Date;
}
interface MarketSegment {
  name: string;
  value: number;
  growth: number;
  potential: number;
  saturation: number;
}
interface PerformanceMetric {
  category: string;
  current: number;
  target: number;
  trend: number;
  forecast: number;
}
const AIBusinessIntelligence = () => {
  const [selectedInsight, setSelectedInsight] = useState<BusinessInsight | null>(null);
  const [timeHorizon, setTimeHorizon] = useState<'1m' | '3m' | '6m' | '1y'>('3m');

  // AI-generated business insights
  const businessInsights = useMemo((): BusinessInsight[] => {
    const insights: BusinessInsight[] = [];

    // Revenue optimization insight
    insights.push({
      id: 'revenue-opt-1',
      title: 'Optimalisasi Portofolio Produk untuk Maksimalisasi Revenue',
      type: 'optimization',
      priority: 'high',
      confidence: 87,
      impact: {
        financial: 850000,
        operational: 65,
        strategic: 80
      },
      description: 'AI mengidentifikasi peluang peningkatan revenue 15-20% melalui rebalancing portofolio produk berdasarkan margin dan velocity analysis.',
      recommendations: ['Fokus promosi pada produk high-margin dengan velocity tinggi', 'Reduce inventory untuk produk slow-moving dengan margin rendah', 'Implementasi dynamic pricing berdasarkan demand forecasting'],
      dataSource: 'Sales data, inventory turnover, margin analysis',
      aiModel: 'Revenue Optimization Neural Network v2.1',
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    // Market trend prediction
    insights.push({
      id: 'trend-pred-1',
      title: 'Prediksi Perubahan Tren Pasar Q2 2024',
      type: 'prediction',
      priority: 'medium',
      confidence: 78,
      impact: {
        financial: 450000,
        operational: 70,
        strategic: 90
      },
      description: 'Model prediksi menunjukkan shift preferensi konsumen ke produk eco-friendly dengan growth rate 35% dalam 6 bulan ke depan.',
      recommendations: ['Ekspansi kategori produk ramah lingkungan', 'Partnership dengan supplier berkelanjutan', 'Marketing campaign fokus sustainability value'],
      dataSource: 'Market research, consumer behavior, external trends',
      aiModel: 'Trend Prediction Transformer v3.0',
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    });

    // Risk assessment
    insights.push({
      id: 'risk-assess-1',
      title: 'Early Warning: Supply Chain Risk Assessment',
      type: 'risk',
      priority: 'critical',
      confidence: 92,
      impact: {
        financial: -1200000,
        operational: 85,
        strategic: 75
      },
      description: 'AI mendeteksi peningkatan risiko supply chain disruption 85% dalam 30 hari ke depan berdasarkan geopolitical events dan supplier performance.',
      recommendations: ['Diversifikasi supplier portfolio segera', 'Increase safety stock untuk produk critical', 'Activate contingency suppliers yang sudah di-qualify'],
      dataSource: 'Supplier data, external risk factors, historical disruptions',
      aiModel: 'Risk Assessment Deep Learning v2.5',
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    });

    // Growth opportunity
    insights.push({
      id: 'growth-opp-1',
      title: 'Peluang Ekspansi Kategori Baru dengan ROI Tinggi',
      type: 'opportunity',
      priority: 'high',
      confidence: 81,
      impact: {
        financial: 2100000,
        operational: 60,
        strategic: 95
      },
      description: 'Analisis market gap menunjukkan peluang masuk ke kategori smart home devices dengan potential revenue 2.1M dan ROI 340%.',
      recommendations: ['Market research mendalam untuk smart home segment', 'Pilot program dengan 3-5 produk strategis', 'Partnership dengan tech vendors untuk competitive advantage'],
      dataSource: 'Market analysis, competitor intelligence, customer surveys',
      aiModel: 'Opportunity Discovery Engine v1.8',
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)
    });
    return insights;
  }, [timeHorizon]);

  // Market segmentation analysis
  const marketSegments = useMemo((): MarketSegment[] => [{
    name: 'Electronics',
    value: 35,
    growth: 12,
    potential: 85,
    saturation: 65
  }, {
    name: 'Home & Living',
    value: 25,
    growth: 8,
    potential: 70,
    saturation: 45
  }, {
    name: 'Sports & Outdoor',
    value: 20,
    growth: 15,
    potential: 90,
    saturation: 30
  }, {
    name: 'Books & Media',
    value: 12,
    growth: -5,
    potential: 40,
    saturation: 80
  }, {
    name: 'Fashion',
    value: 8,
    growth: 22,
    potential: 95,
    saturation: 25
  }], []);

  // Performance metrics radar
  const performanceMetrics = useMemo((): PerformanceMetric[] => [{
    category: 'Revenue',
    current: 85,
    target: 100,
    trend: 12,
    forecast: 95
  }, {
    category: 'Margin',
    current: 78,
    target: 85,
    trend: 8,
    forecast: 82
  }, {
    category: 'Inventory Turn',
    current: 72,
    target: 90,
    trend: 15,
    forecast: 88
  }, {
    category: 'Customer Satisfaction',
    current: 89,
    target: 95,
    trend: 5,
    forecast: 92
  }, {
    category: 'Operational Efficiency',
    current: 76,
    target: 85,
    trend: 18,
    forecast: 83
  }, {
    category: 'Market Share',
    current: 68,
    target: 80,
    trend: 10,
    forecast: 75
  }], []);

  // Revenue forecast data
  const revenueForcast = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => ({
      month,
      actual: 850000 + Math.random() * 200000 + index * 50000,
      predicted: 900000 + Math.random() * 150000 + index * 60000,
      aiOptimized: 950000 + Math.random() * 100000 + index * 80000,
      confidence: 0.8 + Math.random() * 0.15
    }));
  }, []);
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'warning';
      default:
        return 'secondary';
    }
  };
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'trend':
        return TrendingUp;
      case 'prediction':
        return Brain;
      case 'optimization':
        return Target;
      case 'risk':
        return AlertTriangle;
      case 'opportunity':
        return Lightbulb;
      default:
        return Zap;
    }
  };
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  return <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-end">
        
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setTimeHorizon('1m')}>1M</Button>
          <Button variant="outline" onClick={() => setTimeHorizon('3m')}>3M</Button>
          <Button variant="outline" onClick={() => setTimeHorizon('6m')}>6M</Button>
          <Button variant="outline" onClick={() => setTimeHorizon('1y')}>1Y</Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Predicted Revenue</span>
            </div>
            <div className="text-2xl font-bold">Rp 12.5M</div>
            <div className="text-sm text-green-600">+18.5% vs last quarter</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">AI Confidence</span>
            </div>
            <div className="text-2xl font-bold">84.5%</div>
            <div className="text-sm text-blue-600">High accuracy</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Active Insights</span>
            </div>
            <div className="text-2xl font-bold">{businessInsights.length}</div>
            <div className="text-sm text-orange-600">2 critical actions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Growth Potential</span>
            </div>
            <div className="text-2xl font-bold">+32%</div>
            <div className="text-sm text-purple-600">Next 6 months</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="insights">Strategic Insights</TabsTrigger>
          <TabsTrigger value="forecasting">Revenue Forecasting</TabsTrigger>
          <TabsTrigger value="market">Market Analysis</TabsTrigger>
          <TabsTrigger value="performance">Performance Radar</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <div className="space-y-4">
            {businessInsights.map((insight, index) => {
            const Icon = getTypeIcon(insight.type);
            return <motion.div key={insight.id} initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: index * 0.1
            }}>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedInsight(insight)}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`p-2 rounded-full ${insight.priority === 'critical' ? 'bg-destructive/20' : insight.priority === 'high' ? 'bg-destructive/10' : insight.priority === 'medium' ? 'bg-warning/20' : 'bg-secondary'}`}>
                            <Icon className={`h-4 w-4 ${insight.priority === 'critical' ? 'text-destructive' : insight.priority === 'high' ? 'text-destructive' : insight.priority === 'medium' ? 'text-warning' : 'text-muted-foreground'}`} />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{insight.title}</h3>
                              <Badge variant={getPriorityColor(insight.priority) as any}>
                                {insight.priority.toUpperCase()}
                              </Badge>
                              <Badge variant="outline">
                                {insight.confidence}% AI Confidence
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-3">
                              {insight.description}
                            </p>
                            
                            <div className="grid md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Financial Impact</p>
                                <p className="font-medium text-green-600">
                                  {insight.impact.financial > 0 ? '+' : ''}
                                  {formatCurrency(insight.impact.financial)}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">AI Model</p>
                                <p className="font-medium">{insight.aiModel}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Expires</p>
                                <p className="font-medium">{insight.expiresAt.toLocaleDateString('id-ID')}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>;
          })}
          </div>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Revenue Forecasting</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={revenueForcast}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => formatCurrency(value)} />
                  <Area type="monotone" dataKey="actual" stackId="1" stroke="hsl(var(--muted))" fill="hsl(var(--muted))" name="Actual" />
                  <Area type="monotone" dataKey="predicted" stackId="2" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" name="AI Predicted" />
                  <Area type="monotone" dataKey="aiOptimized" stackId="3" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" name="AI Optimized" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="market" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Segmentation</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={marketSegments} cx="50%" cy="50%" innerRadius={60} outerRadius={120} paddingAngle={5} dataKey="value">
                      {marketSegments.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Growth vs Potential</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketSegments.map((segment, index) => <div key={segment.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{segment.name}</span>
                        <span>Growth: {segment.growth}%</span>
                      </div>
                      <Progress value={segment.potential} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        Potential: {segment.potential}% | Saturation: {segment.saturation}%
                      </div>
                    </div>)}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics Radar</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={performanceMetrics}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Current" dataKey="current" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                  <Radar name="Target" dataKey="target" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.3} />
                  <Radar name="Forecast" dataKey="forecast" stroke="hsl(var(--muted))" fill="hsl(var(--muted))" fillOpacity={0.2} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
};
export default AIBusinessIntelligence;