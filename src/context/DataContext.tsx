import React, { createContext, useContext, useState, useCallback } from 'react';
import { Indicator, IndicatorData, UploadSubmission } from '@/types';
import { sampleIndicators, sampleIndicatorData, sampleSubmissions } from '@/data/sampleData';

interface DataContextType {
  indicators: Indicator[];
  indicatorData: IndicatorData[];
  submissions: UploadSubmission[];
  updateIndicator: (id: string, updates: Partial<Indicator>) => void;
  toggleIndicator: (id: string) => void;
  deleteIndicator: (id: string) => void;
  addIndicatorData: (data: IndicatorData[]) => void;
  addSubmission: (submission: UploadSubmission) => void;
  getIndicatorById: (id: string) => Indicator | undefined;
  getDataByIndicator: (indicatorId: string) => IndicatorData[];
  getLastUpdated: () => string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [indicators, setIndicators] = useState<Indicator[]>(sampleIndicators);
  const [indicatorData, setIndicatorData] = useState<IndicatorData[]>(sampleIndicatorData);
  const [submissions, setSubmissions] = useState<UploadSubmission[]>(sampleSubmissions);

  const updateIndicator = useCallback((id: string, updates: Partial<Indicator>) => {
    setIndicators(prev =>
      prev.map(ind =>
        ind.id === id
          ? { ...ind, ...updates, updatedAt: new Date().toISOString() }
          : ind
      )
    );
  }, []);

  const toggleIndicator = useCallback((id: string) => {
    setIndicators(prev =>
      prev.map(ind =>
        ind.id === id
          ? { ...ind, isEnabled: !ind.isEnabled, updatedAt: new Date().toISOString() }
          : ind
      )
    );
  }, []);

  const deleteIndicator = useCallback((id: string) => {
    setIndicators(prev =>
      prev.map(ind =>
        ind.id === id
          ? { ...ind, isDeleted: true, updatedAt: new Date().toISOString() }
          : ind
      )
    );
  }, []);

  const addIndicatorData = useCallback((data: IndicatorData[]) => {
    setIndicatorData(prev => [...prev, ...data]);
  }, []);

  const addSubmission = useCallback((submission: UploadSubmission) => {
    setSubmissions(prev => [submission, ...prev]);
  }, []);

  const getIndicatorById = useCallback((id: string) => {
    return indicators.find(ind => ind.id === id);
  }, [indicators]);

  const getDataByIndicator = useCallback((indicatorId: string) => {
    return indicatorData.filter(d => d.indicatorId === indicatorId);
  }, [indicatorData]);

  const getLastUpdated = useCallback(() => {
    const dates = indicatorData.map(d => new Date(d.uploadedAt).getTime());
    if (dates.length === 0) return 'N/A';
    const latest = new Date(Math.max(...dates));
    return latest.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }, [indicatorData]);

  return (
    <DataContext.Provider
      value={{
        indicators,
        indicatorData,
        submissions,
        updateIndicator,
        toggleIndicator,
        deleteIndicator,
        addIndicatorData,
        addSubmission,
        getIndicatorById,
        getDataByIndicator,
        getLastUpdated,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
