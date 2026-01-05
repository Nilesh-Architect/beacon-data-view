import { Indicator, IndicatorData, UploadSubmission, Chapter } from '@/types';

export const sampleIndicators: Indicator[] = [
  {
    id: 'ind-001',
    name: 'Literacy Rate',
    unit: 'Percentage',
    source: 'Census of India',
    category: 'Education',
    isEnabled: true,
    isDeleted: false,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-12-01T14:30:00Z',
  },
  {
    id: 'ind-002',
    name: 'Female Workforce Participation Rate',
    unit: 'Percentage',
    source: 'PLFS Survey',
    category: 'Employment',
    isEnabled: true,
    isDeleted: false,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-11-28T09:15:00Z',
  },
  {
    id: 'ind-003',
    name: 'Infant Mortality Rate',
    unit: 'Per 1000 live births',
    source: 'SRS Bulletin',
    category: 'Health',
    isEnabled: true,
    isDeleted: false,
    createdAt: '2024-02-20T11:00:00Z',
    updatedAt: '2024-11-15T16:45:00Z',
  },
  {
    id: 'ind-004',
    name: 'GDP Growth Rate',
    unit: 'Percentage',
    source: 'CSO',
    category: 'Economy',
    isEnabled: false,
    isDeleted: false,
    createdAt: '2024-03-10T08:00:00Z',
    updatedAt: '2024-10-20T12:00:00Z',
  },
];

export const sampleIndicatorData: IndicatorData[] = [
  // Literacy Rate - Year-wise National Data
  { id: 'd-001', indicatorId: 'ind-001', year: 2011, state: 'India', value: 74.04, uploadedAt: '2024-12-01T14:30:00Z', uploadedBy: 'contributor1' },
  { id: 'd-002', indicatorId: 'ind-001', year: 2015, state: 'India', value: 77.5, uploadedAt: '2024-12-01T14:30:00Z', uploadedBy: 'contributor1' },
  { id: 'd-003', indicatorId: 'ind-001', year: 2018, state: 'India', value: 79.2, uploadedAt: '2024-12-01T14:30:00Z', uploadedBy: 'contributor1' },
  { id: 'd-004', indicatorId: 'ind-001', year: 2021, state: 'India', value: 81.4, uploadedAt: '2024-12-01T14:30:00Z', uploadedBy: 'contributor1' },
  { id: 'd-005', indicatorId: 'ind-001', year: 2023, state: 'India', value: 83.1, uploadedAt: '2024-12-01T14:30:00Z', uploadedBy: 'contributor1' },

  // Literacy Rate - State-wise Data (2023)
  { id: 'd-006', indicatorId: 'ind-001', year: 2023, state: 'Kerala', value: 96.2, uploadedAt: '2024-12-01T14:30:00Z', uploadedBy: 'contributor1' },
  { id: 'd-007', indicatorId: 'ind-001', year: 2023, state: 'Maharashtra', value: 84.8, uploadedAt: '2024-12-01T14:30:00Z', uploadedBy: 'contributor1' },
  { id: 'd-008', indicatorId: 'ind-001', year: 2023, state: 'Tamil Nadu', value: 82.9, uploadedAt: '2024-12-01T14:30:00Z', uploadedBy: 'contributor1' },
  { id: 'd-009', indicatorId: 'ind-001', year: 2023, state: 'Gujarat', value: 79.3, uploadedAt: '2024-12-01T14:30:00Z', uploadedBy: 'contributor1' },
  { id: 'd-010', indicatorId: 'ind-001', year: 2023, state: 'Uttar Pradesh', value: 73.0, uploadedAt: '2024-12-01T14:30:00Z', uploadedBy: 'contributor1' },
  { id: 'd-011', indicatorId: 'ind-001', year: 2023, state: 'Bihar', value: 70.9, uploadedAt: '2024-12-01T14:30:00Z', uploadedBy: 'contributor1' },

  // Female Workforce Participation - Year-wise
  { id: 'd-012', indicatorId: 'ind-002', year: 2011, state: 'India', value: 23.3, uploadedAt: '2024-11-28T09:15:00Z', uploadedBy: 'contributor2' },
  { id: 'd-013', indicatorId: 'ind-002', year: 2015, state: 'India', value: 22.5, uploadedAt: '2024-11-28T09:15:00Z', uploadedBy: 'contributor2' },
  { id: 'd-014', indicatorId: 'ind-002', year: 2018, state: 'India', value: 24.5, uploadedAt: '2024-11-28T09:15:00Z', uploadedBy: 'contributor2' },
  { id: 'd-015', indicatorId: 'ind-002', year: 2021, state: 'India', value: 25.1, uploadedAt: '2024-11-28T09:15:00Z', uploadedBy: 'contributor2' },
  { id: 'd-016', indicatorId: 'ind-002', year: 2023, state: 'India', value: 37.0, uploadedAt: '2024-11-28T09:15:00Z', uploadedBy: 'contributor2' },

  // Female Workforce - State-wise (2023)
  { id: 'd-017', indicatorId: 'ind-002', year: 2023, state: 'Himachal Pradesh', value: 52.4, uploadedAt: '2024-11-28T09:15:00Z', uploadedBy: 'contributor2' },
  { id: 'd-018', indicatorId: 'ind-002', year: 2023, state: 'Chhattisgarh', value: 48.2, uploadedAt: '2024-11-28T09:15:00Z', uploadedBy: 'contributor2' },
  { id: 'd-019', indicatorId: 'ind-002', year: 2023, state: 'Andhra Pradesh', value: 44.8, uploadedAt: '2024-11-28T09:15:00Z', uploadedBy: 'contributor2' },
  { id: 'd-020', indicatorId: 'ind-002', year: 2023, state: 'Gujarat', value: 32.1, uploadedAt: '2024-11-28T09:15:00Z', uploadedBy: 'contributor2' },
  { id: 'd-021', indicatorId: 'ind-002', year: 2023, state: 'Delhi', value: 15.4, uploadedAt: '2024-11-28T09:15:00Z', uploadedBy: 'contributor2' },

  // Infant Mortality Rate - Year-wise
  { id: 'd-022', indicatorId: 'ind-003', year: 2011, state: 'India', value: 44, uploadedAt: '2024-11-15T16:45:00Z', uploadedBy: 'contributor1' },
  { id: 'd-023', indicatorId: 'ind-003', year: 2015, state: 'India', value: 37, uploadedAt: '2024-11-15T16:45:00Z', uploadedBy: 'contributor1' },
  { id: 'd-024', indicatorId: 'ind-003', year: 2018, state: 'India', value: 32, uploadedAt: '2024-11-15T16:45:00Z', uploadedBy: 'contributor1' },
  { id: 'd-025', indicatorId: 'ind-003', year: 2021, state: 'India', value: 28, uploadedAt: '2024-11-15T16:45:00Z', uploadedBy: 'contributor1' },
  { id: 'd-026', indicatorId: 'ind-003', year: 2023, state: 'India', value: 26, uploadedAt: '2024-11-15T16:45:00Z', uploadedBy: 'contributor1' },
];

export const sampleSubmissions: UploadSubmission[] = [
  {
    id: 'sub-001',
    indicatorId: 'ind-001',
    indicatorName: 'Literacy Rate',
    fileName: 'literacy_2023.xlsx',
    status: 'approved',
    uploadedAt: '2024-12-01T14:30:00Z',
    uploadedBy: 'contributor1',
    rowCount: 36,
    errors: [],
  },
  {
    id: 'sub-002',
    indicatorId: 'ind-002',
    indicatorName: 'Female Workforce Participation Rate',
    fileName: 'fwpr_2023.csv',
    status: 'validated',
    uploadedAt: '2024-11-28T09:15:00Z',
    uploadedBy: 'contributor2',
    rowCount: 28,
    errors: [],
  },
];

export const virtualBookChapters: Chapter[] = [
  {
    id: 'ch-1',
    title: 'Introduction',
    sections: [
      {
        id: 'sec-1-1',
        title: 'About This Publication',
        type: 'text',
        content: `This Statistical Yearbook presents a comprehensive overview of India's key socio-economic indicators. The data compiled in this publication is sourced from various government surveys, censuses, and administrative records.

The yearbook aims to provide policymakers, researchers, and citizens with reliable statistical information to support evidence-based decision making. All data presented has undergone rigorous validation processes to ensure accuracy and consistency.

Key highlights of this edition include:
• Updated literacy statistics from the latest surveys
• Comprehensive analysis of female workforce participation trends
• State-wise comparisons across multiple development indicators
• Time-series data spanning over a decade`,
      },
    ],
  },
  {
    id: 'ch-2',
    title: 'Education Statistics',
    sections: [
      {
        id: 'sec-2-1',
        title: 'Literacy Rate Overview',
        type: 'text',
        content: `Literacy is one of the most fundamental indicators of human development. India has made significant strides in improving literacy rates over the past decades. The national literacy rate has risen from 74.04% in 2011 to 83.1% in 2023.

This chapter presents detailed statistics on literacy rates across states and union territories, highlighting regional disparities and progress made in bridging the literacy gap.`,
      },
      {
        id: 'sec-2-2',
        title: 'Literacy Rate Trends',
        type: 'chart',
        indicatorId: 'ind-001',
      },
      {
        id: 'sec-2-3',
        title: 'State-wise Literacy Data',
        type: 'table',
        indicatorId: 'ind-001',
      },
    ],
  },
  {
    id: 'ch-3',
    title: 'Employment Statistics',
    sections: [
      {
        id: 'sec-3-1',
        title: 'Female Workforce Participation',
        type: 'text',
        content: `Female labour force participation is a crucial indicator of women's economic empowerment and gender equality. This section analyzes trends in female workforce participation rates based on the Periodic Labour Force Survey (PLFS) data.

Recent data shows a significant improvement in female workforce participation, rising from 23.3% in 2011 to 37.0% in 2023, indicating positive shifts in women's economic engagement.`,
      },
      {
        id: 'sec-3-2',
        title: 'FWPR Trends',
        type: 'chart',
        indicatorId: 'ind-002',
      },
      {
        id: 'sec-3-3',
        title: 'State-wise FWPR Data',
        type: 'table',
        indicatorId: 'ind-002',
      },
    ],
  },
  {
    id: 'ch-4',
    title: 'Health Statistics',
    sections: [
      {
        id: 'sec-4-1',
        title: 'Infant Mortality Rate',
        type: 'text',
        content: `The Infant Mortality Rate (IMR) is a key indicator of the health status of a population and the quality of healthcare infrastructure. India has achieved remarkable progress in reducing IMR over the years.

The national IMR has declined from 44 per 1,000 live births in 2011 to 26 per 1,000 live births in 2023, reflecting improvements in maternal and child healthcare services.`,
      },
      {
        id: 'sec-4-2',
        title: 'IMR Trends',
        type: 'chart',
        indicatorId: 'ind-003',
      },
    ],
  },
];

export const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'India'
];
