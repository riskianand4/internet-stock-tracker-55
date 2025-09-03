import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import StatsFilters from './stats/StatsFilters';
import KPIDashboard from './stats/KPIDashboard';
import TrendAnalysis from './stats/TrendAnalysis';
import CategoryAnalysis from './stats/CategoryAnalysis';
import VelocityAnalysis from './stats/VelocityAnalysis';
import SmartInsights from './stats/SmartInsights';

import PredictiveAnalytics from './stats/PredictiveAnalytics';

export type TimeFilter = 'week' | 'month' | 'quarter' | 'year' | 'custom';
export type DateRange = {
  from: Date;
  to: Date;
};

const AdvancedStatsOverview = () => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('month');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date()
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-muted/10 mobile-responsive-padding py-3 md:py-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto mobile-responsive-spacing"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="mobile-responsive-text font-bold text-primary mb-2">
            Dashboard Analitik Lanjutan
          </h1>
          <p className="text-muted-foreground text-sm md:text-lg">
            Wawasan inventori cerdas dan analitik prediktif
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants}>
          <StatsFilters 
            timeFilter={timeFilter}
            onTimeFilterChange={setTimeFilter}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
        </motion.div>


        {/* KPI Dashboard */}
        <motion.div variants={itemVariants}>
          <KPIDashboard timeFilter={timeFilter} dateRange={dateRange} />
        </motion.div>

        {/* Two-column layout for main analytics */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 md:gap-8">
          {/* Left column - Charts */}
          <div className="xl:col-span-2 space-y-3 md:space-y-8">
            <motion.div variants={itemVariants}>
              <TrendAnalysis timeFilter={timeFilter} dateRange={dateRange} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <CategoryAnalysis timeFilter={timeFilter} dateRange={dateRange} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <VelocityAnalysis />
            </motion.div>
          </div>

          {/* Right column - Insights & Predictions */}
          <div className="space-y-3 md:space-y-8">
            <motion.div variants={itemVariants}>
              <SmartInsights timeFilter={timeFilter} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <PredictiveAnalytics />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdvancedStatsOverview;