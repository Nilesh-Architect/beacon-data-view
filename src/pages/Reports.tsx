import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { FileText, Download, Printer } from 'lucide-react';

export default function Reports() {
  const { indicators, indicatorData, getIndicatorById } = useData();
  const [selectedIndicator, setSelectedIndicator] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const enabledIndicators = indicators.filter(ind => ind.isEnabled && !ind.isDeleted);

  const getTimeSeriesData = (indicatorId: string) => {
    return indicatorData
      .filter(d => d.indicatorId === indicatorId && d.state === 'India')
      .sort((a, b) => a.year - b.year)
      .map(d => ({ year: d.year, value: d.value }));
  };

  const getStateData = (indicatorId: string) => {
    return indicatorData
      .filter(d => d.indicatorId === indicatorId && d.state !== 'India')
      .sort((a, b) => b.value - a.value);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowReport(true);
    }, 1000);
  };

  const handlePrint = () => {
    window.print();
  };

  const indicator = selectedIndicator ? getIndicatorById(selectedIndicator) : null;
  const chartData = selectedIndicator ? getTimeSeriesData(selectedIndicator) : [];
  const tableData = selectedIndicator ? getStateData(selectedIndicator) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Report Generation</h1>
        <p className="text-muted-foreground">Generate downloadable reports for indicators</p>
      </div>

      <Card className="no-print">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Generate Report
          </CardTitle>
          <CardDescription>
            Select an indicator to generate a comprehensive report
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Indicator</label>
              <Select value={selectedIndicator} onValueChange={setSelectedIndicator}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an indicator" />
                </SelectTrigger>
                <SelectContent>
                  {enabledIndicators.map(ind => (
                    <SelectItem key={ind.id} value={ind.id}>
                      {ind.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleGenerate}
              disabled={!selectedIndicator || isGenerating}
              className="gap-2"
            >
              <FileText className="w-4 h-4" />
              {isGenerating ? 'Generating...' : 'Generate Report'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {showReport && indicator && (
        <Card id="report-content">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between no-print">
              <div>
                <CardTitle>Generated Report</CardTitle>
                <CardDescription>
                  Report generated on {new Date().toLocaleDateString('en-IN')}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            {/* Report Header */}
            <div className="text-center border-b pb-6">
              <p className="text-sm text-muted-foreground mb-2">
                Government of India | Ministry of Statistics & Programme Implementation
              </p>
              <h2 className="text-2xl font-bold text-foreground">{indicator.name}</h2>
              <p className="text-muted-foreground mt-2">Statistical Report</p>
              <div className="flex justify-center gap-4 mt-4">
                <Badge variant="outline">Category: {indicator.category}</Badge>
                <Badge variant="outline">Unit: {indicator.unit}</Badge>
                <Badge variant="outline">Source: {indicator.source}</Badge>
              </div>
            </div>

            {/* Summary Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Summary</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Latest Value</p>
                  <p className="text-2xl font-bold text-primary">
                    {chartData.length > 0 ? chartData[chartData.length - 1].value.toFixed(2) : 'N/A'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Year: {chartData.length > 0 ? chartData[chartData.length - 1].year : 'N/A'}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Data Points</p>
                  <p className="text-2xl font-bold text-primary">{chartData.length + tableData.length}</p>
                  <p className="text-sm text-muted-foreground">Records</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">States Covered</p>
                  <p className="text-2xl font-bold text-primary">{tableData.length}</p>
                  <p className="text-sm text-muted-foreground">States/UTs</p>
                </div>
              </div>
            </div>

            {/* Chart Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">National Trend</h3>
              <div className="h-72 border rounded-lg p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
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
            </div>

            {/* Table Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">State-wise Data</h3>
              <div className="overflow-x-auto border rounded-lg">
                <table className="gov-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>State/UT</th>
                      <th>Year</th>
                      <th>Value ({indicator.unit})</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, idx) => (
                      <tr key={row.id}>
                        <td>{idx + 1}</td>
                        <td>{row.state}</td>
                        <td>{row.year}</td>
                        <td className="font-medium">{row.value.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t pt-6 text-center text-sm text-muted-foreground">
              <p>This report is auto-generated from the Statistical Data Portal.</p>
              <p>For official use. Data sourced from {indicator.source}.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
