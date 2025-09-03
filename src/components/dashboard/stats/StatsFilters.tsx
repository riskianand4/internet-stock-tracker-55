import React from 'react';
import { Calendar, Clock, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { TimeFilter, DateRange } from '../AdvancedStatsOverview';

interface StatsFiltersProps {
  timeFilter: TimeFilter;
  onTimeFilterChange: (filter: TimeFilter) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

const StatsFilters = ({
  timeFilter,
  onTimeFilterChange,
  dateRange,
  onDateRangeChange
}: StatsFiltersProps) => {
  const handleQuickFilter = (days: number) => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - days);
    
    onDateRangeChange({ from, to });
    
    if (days === 7) onTimeFilterChange('week');
    else if (days === 30) onTimeFilterChange('month');
    else if (days === 90) onTimeFilterChange('quarter');
    else if (days === 365) onTimeFilterChange('year');
  };

  return (
    <Card className="p-6 glass">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Time Period Filters */}
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-muted-foreground" />
          <div className="flex gap-2">
            {[
              { label: '7 Hari', value: 'week', days: 7 },
              { label: '30 Hari', value: 'month', days: 30 },
              { label: '3 Bulan', value: 'quarter', days: 90 },
              { label: '1 Tahun', value: 'year', days: 365 }
            ].map((period) => (
              <Button
                key={period.value}
                variant={timeFilter === period.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleQuickFilter(period.days)}
                className="relative overflow-hidden transition-all duration-300"
              >
                {period.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Date Range */}
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd MMM")} - {format(dateRange.to, "dd MMM yyyy")}
                    </>
                  ) : (
                    format(dateRange.from, "dd MMM yyyy")
                  )
                ) : (
                  <span>Pilih tanggal</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={{
                  from: dateRange?.from,
                  to: dateRange?.to
                }}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    onDateRangeChange({ from: range.from, to: range.to });
                    onTimeFilterChange('custom');
                  }
                }}
                numberOfMonths={2}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter Lanjut
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default StatsFilters;