import { useData } from '@/context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';

export default function Dashboard() {
  const { indicators, indicatorData, getLastUpdated } = useData();

  const enabledIndicators = indicators.filter(ind => ind.isEnabled && !ind.isDeleted);

  const getTimeSeriesData = (indicatorId: string) => {
    return indicatorData
      .filter(d => d.indicatorId === indicatorId && d.state === 'India')
      .sort((a, b) => a.year - b.year)
      .map(d => ({ year: d.year, value: d.value }));
  };

  const getStateWiseData = (indicatorId: string, year: number) => {
    return indicatorData
      .filter(d => d.indicatorId === indicatorId && d.year === year && d.state !== 'India')
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  };

  const getLatestValue = (indicatorId: string) => {
    const data = getTimeSeriesData(indicatorId);
    return data.length > 0 ? data[data.length - 1] : null;
  };

  const getTrend = (indicatorId: string) => {
    const data = getTimeSeriesData(indicatorId);
    if (data.length < 2) return null;
    const latest = data[data.length - 1].value;
    const previous = data[data.length - 2].value;
    return ((latest - previous) / previous) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Key statistical indicators at a glance</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Last Updated: {getLastUpdated()}</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {enabledIndicators.slice(0, 3).map(indicator => {
          const latest = getLatestValue(indicator.id);
          const trend = getTrend(indicator.id);

          return (
            <Card key={indicator.id}>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center justify-between">
                  <span>{indicator.category}</span>
                  <Badge variant="outline">{indicator.source}</Badge>
                </CardDescription>
                <CardTitle className="text-lg">{indicator.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-primary">
                      {latest?.value.toFixed(1)}
                      <span className="text-sm font-normal text-muted-foreground ml-1">
                        {indicator.unit}
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Year: {latest?.year}
                    </p>
                  </div>
                  {trend !== null && (
                    <div className={`flex items-center gap-1 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {trend >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">
                        {Math.abs(trend).toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {enabledIndicators.slice(0, 2).map(indicator => {
          const timeSeriesData = getTimeSeriesData(indicator.id);
          const stateData = getStateWiseData(indicator.id, 2023);

          return (
            <Card key={indicator.id} className="col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">{indicator.name}</CardTitle>
                <CardDescription>Year-wise trend (National)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="year" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '0.375rem',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--primary))' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* State-wise Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">State-wise Comparison (2023)</CardTitle>
          <CardDescription>Top performing states by Literacy Rate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={getStateWiseData('ind-001', 2023)}
                layout="vertical"
                margin={{ left: 100 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" domain={[0, 100]} className="text-xs" />
                <YAxis type="category" dataKey="state" className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.375rem',
                  }}
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
