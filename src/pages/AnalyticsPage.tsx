import React, { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ModernLoginPage from '@/components/auth/ModernLoginPage';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Brain, 
  Download,
  Calendar,
  Target,
  Zap,
  Eye
} from 'lucide-react';
import AdvancedStatsOverview from '@/components/dashboard/AdvancedStatsOverview';
import SalesForecasting from '@/components/analytics/SalesForecasting';
import DemandPrediction from '@/components/analytics/DemandPrediction';
import SeasonalAnalysis from '@/components/analytics/SeasonalAnalysis';
import ROIAnalysis from '@/components/analytics/ROIAnalysis';

const AnalyticsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) {
    return <ModernLoginPage />;
  }

  // Check role access
  if (!['admin', 'super_admin'].includes(user.role)) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Card className="p-6 text-center">
            <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Akses Terbatas</h3>
            <p className="text-muted-foreground">Anda tidak memiliki izin untuk melihat analitik.</p>
          </Card>
        </div>
      </MainLayout>
    );
  }

  const tabs = [
    {
      id: 'overview',
      label: 'Ikhtisar',
      icon: BarChart3,
      description: 'Dashboard analitik komprehensif'
    },
    {
      id: 'forecasting',
      label: 'Peramalan Penjualan',
      icon: TrendingUp,
      description: 'Prediksi tren dan penjualan masa depan'
    },
    {
      id: 'demand',
      label: 'Prediksi Permintaan',
      icon: Brain,
      description: 'Peramalan permintaan berbasis AI'
    },
    {
      id: 'seasonal',
      label: 'Analisis Musiman',
      icon: Calendar,
      description: 'Identifikasi pola musiman'
    },
    {
      id: 'roi',
      label: 'Analisis ROI',
      icon: Target,
      description: 'Metrik return on investment'
    }
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-muted/10 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto space-y-6"
        >
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 rounded-full bg-primary/10">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-primary">
                  Analitik Lanjutan
                </h1>
                <p className="text-muted-foreground text-lg">
                  Business Intelligence & Analitik Prediktif Berbasis AI
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                { label: 'Model Aktif', value: '12', icon: Brain, color: 'primary' },
                { label: 'Tingkat Akurasi', value: '94.2%', icon: Target, color: 'success' },
                { label: 'Prediksi', value: '1,247', icon: TrendingUp, color: 'accent' },
                { label: 'Wawasan', value: '38', icon: Zap, color: 'warning' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-4 text-center glass">
                    <stat.icon className={`w-6 h-6 text-${stat.color} mx-auto mb-2`} />
                    <div className="text-xl font-bold">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Analytics Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {/* Tab Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-2 glass">
                <TabsList className="grid grid-cols-5 w-full h-auto p-1">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="flex flex-col items-center gap-2 p-4 h-auto data-[state=active]:bg-primary/10"
                    >
                      <tab.icon className="w-5 h-5" />
                      <div className="text-center">
                        <div className="font-medium text-sm">{tab.label}</div>
                        <div className="text-xs text-muted-foreground hidden lg:block">
                          {tab.description}
                        </div>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Card>
            </motion.div>

            {/* Tab Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <TabsContent value="overview" className="space-y-6">
                <AdvancedStatsOverview />
              </TabsContent>

              <TabsContent value="forecasting" className="space-y-6">
                <SalesForecasting />
              </TabsContent>

              <TabsContent value="demand" className="space-y-6">
                <DemandPrediction />
              </TabsContent>

              <TabsContent value="seasonal" className="space-y-6">
                <SeasonalAnalysis />
              </TabsContent>

              <TabsContent value="roi" className="space-y-6">
                <ROIAnalysis />
              </TabsContent>
            </motion.div>

            {/* Export Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <Card className="p-4 glass">
                <div className="flex items-center justify-center gap-4">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Ekspor Laporan PDF
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Ekspor Data Excel
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Jadwalkan Laporan
                  </Button>
                </div>
              </Card>
            </motion.div>
          </Tabs>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default AnalyticsPage;