// Updated presets: replaced "Custom" with "All" and reordered - v1.2
import type { Service, ServiceConfig } from '../types';

export const allServices: Service[] = [
  // Core Services
  { id: 'vsserver_service', name: 'VSServer Service', type: 'core' },
  { id: 'processing_server', name: 'Processing Server', type: 'core' },
  { id: 'fetching_service', name: 'Fetching Service', type: 'core' },
  { id: 'filtering_service', name: 'Filtering Service', type: 'core' },
  { id: 'task_management_service', name: 'Task Management Service', type: 'core' },
  { id: 'rendering_service', name: 'Rendering Service', type: 'core' },
  { id: 'notification_service', name: 'Notification Service', type: 'core' },
  { id: 'maintenance_service', name: 'Maintenance Service', type: 'core' },
  { id: 'storage_gateway_service', name: 'Storage Gateway Service', type: 'core' },
  { id: 'lighthouse_service', name: 'Lighthouse Service', type: 'core' },
  { id: 'telemetry_agent', name: 'Telemetry Agent', type: 'core' },
  
  // Recognition & Matching
  { id: 'face_recognition_service', name: 'Face Recognition Service', type: 'recognition' },
  { id: 'face_recognition_matching', name: 'Face Recognition Matching', type: 'recognition' },
  { id: 'lpr_matching_service', name: 'LPR Matching Service', type: 'recognition' },
  { id: 'bi_face_recognition_service', name: 'BI Face Recognition Service', type: 'recognition' },
  
  // Web & Gateway Services
  { id: 'briefcam_web_services', name: 'BriefCam Web Services', type: 'web' },
  { id: 'video_processing_gateway', name: 'Video Processing Gateway', type: 'web' },
  { id: 'video_streaming_gateway', name: 'Video Streaming Gateway', type: 'web' },
  
  // Engine Services
  { id: 'alert_processing_server', name: 'Alert Processing Server (APS)', type: 'engine' },
  { id: 'ox6_engine_service', name: 'OX6.Engine Service', type: 'engine' },
  { id: 'ox6_engine_gateway_service', name: 'OX6.Engine Gateway Service', type: 'engine' },
  { id: 'ox6_visual_assets_service', name: 'OX6.Visual Assets Service', type: 'engine' },
  { id: 'ox_vms_adaptor', name: 'OX.VMS Adaptor', type: 'engine' },
  
  // Multi-Site (Hub) Services
  { id: 'hub_sso_gateway', name: 'Hub SSO Gateway', type: 'hub' },
  { id: 'outbound_api_gateway', name: 'Outbound API Gateway', type: 'hub' },
  
  // Other System Logs
  { id: 'windows_event_view_logs', name: 'Windows Event View logs', type: 'system' },
  { id: 'iis_setting_logs', name: 'IIS setting & logs', type: 'system' },
  { id: 'rabbitmq_logs', name: 'RabbitMQ logs', type: 'system' },
];

export const serviceConfigs: ServiceConfig = {
  all: allServices.map(service => service.id),
  review: ['vsserver_service', 'fetching_service', 'processing_server'],
  respond: ['vsserver_service', 'fetching_service', 'processing_server', 'notification_service', 'task_management_service'],
  research: ['vsserver_service', 'fetching_service', 'processing_server', 'face_recognition_service', 'lpr_matching_service', 'face_recognition_matching', 'bi_face_recognition_service'],
};

export const timeRangeOptions = [
  { value: 'last-hour', label: 'Last Hour' },
  { value: 'last-4-hours', label: 'Last 4 Hours' },
  { value: 'last-24-hours', label: 'Last 24 Hours' },
  { value: 'last-week', label: 'Last Week' },
  { value: 'custom', label: 'Custom Range' },
];

export const presetOptions = [
  { key: 'review', label: 'REVIEW', description: 'Basic review services' },
  { key: 'respond', label: 'RESPOND', description: 'Response services' },
  { key: 'research', label: 'RESEARCH', description: 'Research and analysis' },
  { key: 'all', label: 'All', description: 'Select all services' },
];

export const defaultAppState = {
  selectedServices: ['vsserver_service', 'fetching_service', 'processing_server'],
  uploadedFiles: [],
  timeRange: 'last-hour',
  customStartDate: '',
  customEndDate: '',
  outputPath: '/var/log/briefcam',
  isCollecting: false,
  collectionProgress: {
    currentService: '',
    progress: 0,
    isComplete: false,
  },
  results: [],
  showResults: false,
  showAIAnalysis: false,
  hiddenLogLines: new Set<string>(),
  markedLogLines: new Set<string>(),
  config: {
    geminiApiKey: localStorage.getItem('gemini-api-key') || '',
  },
}; 