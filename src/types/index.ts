export type UserRole = 'admin' | 'contributor' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Indicator {
  id: string;
  name: string;
  unit: string;
  source: string;
  category: string;
  isEnabled: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IndicatorData {
  id: string;
  indicatorId: string;
  year: number;
  state: string;
  value: number;
  uploadedAt: string;
  uploadedBy: string;
}

export interface UploadSubmission {
  id: string;
  indicatorId: string;
  indicatorName: string;
  fileName: string;
  status: 'pending' | 'validated' | 'failed' | 'approved';
  uploadedAt: string;
  uploadedBy: string;
  rowCount: number;
  errors: ValidationError[];
}

export interface ValidationError {
  row: number;
  column: string;
  message: string;
  value: string;
}

export interface ParsedRow {
  year: number | null;
  state: string;
  value: number | null;
  isValid: boolean;
  errors: string[];
}

export interface ChapterSection {
  id: string;
  title: string;
  type: 'text' | 'table' | 'chart';
  content?: string;
  indicatorId?: string;
}

export interface Chapter {
  id: string;
  title: string;
  sections: ChapterSection[];
}
