export interface Service {
  id: string;
  name: string;
  type: 'core' | 'recognition' | 'web' | 'engine' | 'hub' | 'system';
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
}

export interface ServiceResult {
  serviceName: string;
  status: 'success' | 'error' | 'warning';
  entries: number;
  errors: number;
  warnings: number;
  duration: string;
  isUploadedFile?: boolean;
}

export interface CollectionProgress {
  currentService: string;
  progress: number;
  isComplete: boolean;
}

export interface AppState {
  selectedServices: string[];
  uploadedFiles: UploadedFile[];
  timeRange: string;
  customStartDate: string;
  customEndDate: string;
  outputPath: string;
  isCollecting: boolean;
  collectionProgress: CollectionProgress;
  results: ServiceResult[];
  showResults: boolean;
  showAIAnalysis: boolean;
  hiddenLogLines: Set<string>;
  markedLogLines: Set<string>;
  config: {
    geminiApiKey: string;
  };
}

export interface ServiceConfig {
  [key: string]: string[];
}

export interface AIInsight {
  id: string;
  type: 'critical' | 'warning' | 'optimization';
  title: string;
  description: string;
  recommendation: string;
  confidence: number;
  affectedServices: string[];
}

 