import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { virtualBookChapters } from '@/data/sampleData';
import { Chapter, ChapterSection } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { BookOpen, Search, Download, ChevronRight } from 'lucide-react';

export default function VirtualBook() {
  const { indicatorData, getIndicatorById } = useData();
  const [activeChapter, setActiveChapter] = useState(virtualBookChapters[0].id);
  const [activeSection, setActiveSection] = useState(virtualBookChapters[0].sections[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  const currentChapter = virtualBookChapters.find(ch => ch.id === activeChapter);
  const currentSection = currentChapter?.sections.find(sec => sec.id === activeSection);

  const getChartData = (indicatorId: string) => {
    return indicatorData
      .filter(d => d.indicatorId === indicatorId && d.state === 'India')
      .sort((a, b) => a.year - b.year)
      .map(d => ({ year: d.year, value: d.value }));
  };

  const getTableData = (indicatorId: string) => {
    return indicatorData
      .filter(d => d.indicatorId === indicatorId && d.state !== 'India')
      .sort((a, b) => b.value - a.value);
  };

  const renderSection = (section: ChapterSection) => {
    if (section.type === 'text') {
      return (
        <div className="prose max-w-none">
          {section.content?.split('\n\n').map((para, idx) => (
            <p key={idx} className="mb-4 text-foreground leading-relaxed">
              {para}
            </p>
          ))}
        </div>
      );
    }

    if (section.type === 'chart' && section.indicatorId) {
      const data = getChartData(section.indicatorId);
      const indicator = getIndicatorById(section.indicatorId);
      
      return (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Source: {indicator?.source} | Unit: {indicator?.unit}
          </p>
          <div className="h-72 border rounded-lg p-4 bg-card">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
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
      );
    }

    if (section.type === 'table' && section.indicatorId) {
      const data = getTableData(section.indicatorId);
      const indicator = getIndicatorById(section.indicatorId);

      return (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Source: {indicator?.source} | Unit: {indicator?.unit}
          </p>
          <div className="overflow-x-auto border rounded-lg">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>State/UT</th>
                  <th>Year</th>
                  <th>Value ({indicator?.unit})</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
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
      );
    }

    return null;
  };

  const filteredChapters = searchQuery
    ? virtualBookChapters.filter(ch =>
        ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ch.sections.some(sec =>
          sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sec.content?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : virtualBookChapters;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Statistical Yearbook 2023
          </h1>
          <p className="text-muted-foreground">Interactive publication with live data</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Left Navigation */}
        <Card className="w-72 shrink-0">
          <CardContent className="p-4">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search in book..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <ScrollArea className="h-[calc(100vh-20rem)]">
              <nav className="space-y-1">
                {filteredChapters.map(chapter => (
                  <div key={chapter.id}>
                    <button
                      className={cn(
                        'w-full text-left px-3 py-2 rounded-md font-medium transition-colors',
                        activeChapter === chapter.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      )}
                      onClick={() => {
                        setActiveChapter(chapter.id);
                        setActiveSection(chapter.sections[0].id);
                      }}
                    >
                      {chapter.title}
                    </button>
                    {activeChapter === chapter.id && (
                      <div className="ml-4 mt-1 space-y-1">
                        {chapter.sections.map(section => (
                          <button
                            key={section.id}
                            className={cn(
                              'w-full text-left px-3 py-1.5 text-sm rounded-md flex items-center gap-1 transition-colors',
                              activeSection === section.id
                                ? 'bg-muted text-foreground font-medium'
                                : 'text-muted-foreground hover:text-foreground'
                            )}
                            onClick={() => setActiveSection(section.id)}
                          >
                            <ChevronRight className="w-3 h-3" />
                            {section.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Right Content */}
        <Card className="flex-1">
          <CardContent className="p-8">
            {currentChapter && currentSection && (
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <p className="text-sm text-muted-foreground mb-1">
                    {currentChapter.title}
                  </p>
                  <h2 className="text-2xl font-bold text-foreground">
                    {currentSection.title}
                  </h2>
                </div>
                {renderSection(currentSection)}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
