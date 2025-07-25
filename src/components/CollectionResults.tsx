import React, { useState, useImperativeHandle, forwardRef, useRef, useEffect } from 'react';
import type { ServiceResult } from '../types';

interface LogExcerpt {
  timestamp: string;
  level: string;
  message: string;
}

interface ServiceAnalysis {
  summary: string;
  logExcerpts: LogExcerpt[];
}

interface CollectionResultsProps {
  results: ServiceResult[];
  onShowAIAnalysis: () => void;
  onDownloadLogs: () => void;
  hiddenLogLines: Set<string>;
  onToggleLogLineVisibility: (logLineId: string) => void;
  markedLogLines: Set<string>;
  onToggleLogLineMarking: (logLineId: string) => void;
  onResetSession?: () => void;
}

export interface CollectionResultsRef {
  resetHiddenLines: () => void;
  resetMarkedLines: () => void;
}

const CollectionResults = forwardRef<CollectionResultsRef, CollectionResultsProps>(({
  onShowAIAnalysis,
  hiddenLogLines,
  onToggleLogLineVisibility,
  markedLogLines,
  onToggleLogLineMarking,
}, ref) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'chronological'>('summary');
  const [filterText, setFilterText] = useState('');
  const [expandedServices, setExpandedServices] = useState<Set<number>>(new Set());
  const [highlightedLogIndex, setHighlightedLogIndex] = useState<number | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [selectedSourceLog, setSelectedSourceLog] = useState<any>(null);
  const scrollContainerRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Sample data to match the image structure with expand functionality
  const summaryData = [
    { server: 'PrimaryServer', service: 'VSServer Service', errors: 15, warnings: 45 },
    { server: 'PrimaryServer', service: 'Processing Server', errors: 2, warnings: 102 },
    { server: 'GPU-Node-01', service: 'Fetching Service', errors: 0, warnings: 12 },
    { server: 'PrimaryServer', service: 'Filtering Service', errors: 28, warnings: 5 },
  ];

  // Filter data based on search text
  const filteredData = summaryData.filter(item =>
    item.server.toLowerCase().includes(filterText.toLowerCase()) ||
    item.service.toLowerCase().includes(filterText.toLowerCase())
  );

  const toggleServiceExpansion = (index: number) => {
    const newExpanded = new Set(expandedServices);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedServices(newExpanded);
  };

  // Service analysis data
  const getServiceAnalysis = (serviceName: string): ServiceAnalysis => {
    const analyses: { [key: string]: ServiceAnalysis } = {
      'VSServer Service': {
        summary: 'AI detected potential misconfigurations and unexpected restarts. The main issue is a missing configuration file preventing proper initialization.',
        logExcerpts: [
          { timestamp: '2025-07-21 10:30:15', level: 'ERROR', message: 'Failed to initialize configuration: Config file missing.' },
          { timestamp: '2025-07-21 10:30:12', level: 'ERROR', message: 'Authentication service connection failed: Connection refused.' },
          { timestamp: '2025-07-21 10:30:08', level: 'ERROR', message: 'Database schema validation failed: Missing table "user_sessions".' },
          { timestamp: '2025-07-21 10:30:05', level: 'ERROR', message: 'License verification timeout after 30 seconds.' },
          { timestamp: '2025-07-21 10:29:58', level: 'ERROR', message: 'SSL certificate validation failed: Certificate expired.' },
          { timestamp: '2025-07-21 10:29:55', level: 'ERROR', message: 'Memory allocation error: Out of heap space (4GB limit reached).' },
          { timestamp: '2025-07-21 10:29:52', level: 'ERROR', message: 'Plugin loading failed: "analytics_plugin.dll" not found.' },
          { timestamp: '2025-07-21 10:29:48', level: 'ERROR', message: 'Backup service unreachable: Network timeout after 60s.' },
          { timestamp: '2025-07-21 10:29:45', level: 'ERROR', message: 'Codec initialization failed: H.264 decoder not available.' },
          { timestamp: '2025-07-21 10:29:42', level: 'ERROR', message: 'User privilege escalation failed: Insufficient permissions.' },
          { timestamp: '2025-07-21 10:29:38', level: 'ERROR', message: 'Cache invalidation error: Redis connection lost.' },
          { timestamp: '2025-07-21 10:29:35', level: 'ERROR', message: 'Video stream processing failed: Corrupted frame data.' },
          { timestamp: '2025-07-21 10:29:32', level: 'ERROR', message: 'API rate limit exceeded: 1000 requests/minute threshold.' },
          { timestamp: '2025-07-21 10:29:28', level: 'ERROR', message: 'Configuration reload failed: Invalid JSON syntax.' },
          { timestamp: '2025-07-21 10:29:25', level: 'ERROR', message: 'Thread pool exhaustion: All 64 worker threads busy.' },
          { timestamp: '2025-07-21 10:29:01', level: 'WARN', message: 'Service restart detected. Reason: Unhandled exception.' },
          { timestamp: '2025-07-21 10:28:58', level: 'WARN', message: 'High CPU usage detected: 95% average over 5 minutes.' },
          { timestamp: '2025-07-21 10:28:55', level: 'WARN', message: 'Disk space running low: 85% usage on C: drive.' },
          { timestamp: '2025-07-21 10:28:50', level: 'WARN', message: 'Database connection timeout after 30 seconds.' },
          { timestamp: '2025-07-21 10:28:47', level: 'WARN', message: 'Garbage collection triggered: 250MB threshold reached.' },
          { timestamp: '2025-07-21 10:28:44', level: 'WARN', message: 'Camera connection unstable: 3 reconnects in 10 minutes.' },
          { timestamp: '2025-07-21 10:28:41', level: 'WARN', message: 'Login attempt rate spike: 150 attempts/minute detected.' },
          { timestamp: '2025-07-21 10:28:38', level: 'WARN', message: 'Background task queue growing: 45 pending operations.' },
          { timestamp: '2025-07-21 10:28:35', level: 'WARN', message: 'License expiration warning: 30 days remaining.' },
          { timestamp: '2025-07-21 10:28:32', level: 'WARN', message: 'Network latency spike: 500ms average to database.' },
          { timestamp: '2025-07-21 10:28:29', level: 'WARN', message: 'Session cleanup required: 1,200 expired sessions found.' },
          { timestamp: '2025-07-21 10:28:26', level: 'WARN', message: 'Memory usage approaching limit: 3.7GB of 4GB used.' },
          { timestamp: '2025-07-21 10:28:23', level: 'WARN', message: 'Backup synchronization delayed: 2 hours behind schedule.' },
          { timestamp: '2025-07-21 10:28:20', level: 'WARN', message: 'Configuration drift detected: 12 settings differ from baseline.' },
          { timestamp: '2025-07-21 10:28:17', level: 'WARN', message: 'Alert threshold exceeded: Error rate >5% for video processing.' },
          { timestamp: '2025-07-21 10:28:14', level: 'WARN', message: 'Service dependency check failed: Analytics service unavailable.' },
          { timestamp: '2025-07-21 10:28:11', level: 'WARN', message: 'Cache hit ratio below optimal: 65% (target: 85%).' },
          { timestamp: '2025-07-21 10:28:08', level: 'WARN', message: 'User session limit approaching: 480 of 500 sessions active.' },
          { timestamp: '2025-07-21 10:28:05', level: 'WARN', message: 'Performance degradation detected: Response time >2 seconds.' },
          { timestamp: '2025-07-21 10:28:02', level: 'WARN', message: 'Log rotation overdue: Log files >100MB, rotation needed.' },
          { timestamp: '2025-07-21 10:27:59', level: 'WARN', message: 'Database connection pool near capacity: 18 of 20 connections used.' },
          { timestamp: '2025-07-21 10:27:56', level: 'WARN', message: 'External API response slow: 5+ second delays from licensing server.' },
          { timestamp: '2025-07-21 10:27:53', level: 'WARN', message: 'Temporary file cleanup needed: 2.3GB in temp directory.' },
          { timestamp: '2025-07-21 10:27:50', level: 'WARN', message: 'Concurrent user limit warning: 85% of licensed capacity reached.' },
          { timestamp: '2025-07-21 10:27:47', level: 'WARN', message: 'Video quality degradation: Bitrate dropped to 1.2Mbps from 5Mbps.' },
          { timestamp: '2025-07-21 10:27:44', level: 'WARN', message: 'Plugin compatibility warning: Version mismatch with core system.' },
          { timestamp: '2025-07-21 10:27:41', level: 'WARN', message: 'Index fragmentation detected: Database query performance impact.' },
          { timestamp: '2025-07-21 10:27:38', level: 'WARN', message: 'Certificate renewal reminder: SSL cert expires in 60 days.' },
          { timestamp: '2025-07-21 10:27:35', level: 'WARN', message: 'Event processing backlog: 2,500 events queued for analysis.' },
          { timestamp: '2025-07-21 10:27:32', level: 'WARN', message: 'Hardware monitoring alert: GPU temperature 78°C (threshold: 80°C).' },
          { timestamp: '2025-07-21 10:27:29', level: 'WARN', message: 'Audit log size warning: 500MB log file requires archival.' },
          { timestamp: '2025-07-21 10:27:26', level: 'WARN', message: 'Resource allocation inefficiency: 40% CPU cores idle during peak.' },
          { timestamp: '2025-07-21 10:27:23', level: 'WARN', message: 'Configuration backup outdated: Last backup 7 days ago.' },
          { timestamp: '2025-07-21 10:27:20', level: 'WARN', message: 'Analytics pipeline delay: 15-minute lag in real-time processing.' },
          { timestamp: '2025-07-21 10:27:17', level: 'WARN', message: 'User interface response timeout: Dashboard loading >10 seconds.' },
          { timestamp: '2025-07-21 10:27:14', level: 'WARN', message: 'Storage replication lag: Secondary backup 3 hours behind primary.' },
          { timestamp: '2025-07-21 10:27:11', level: 'WARN', message: 'Service mesh connectivity issue: 2 nodes unreachable intermittently.' },
          { timestamp: '2025-07-21 10:27:08', level: 'WARN', message: 'Load balancer health check warning: Response time variance >500ms.' },
          { timestamp: '2025-07-21 10:27:05', level: 'WARN', message: 'Scheduled maintenance overdue: System updates pending for 14 days.' },
          { timestamp: '2025-07-21 10:27:02', level: 'WARN', message: 'API version deprecation notice: v1.2 endpoints scheduled for removal.' },
          { timestamp: '2025-07-21 10:26:59', level: 'WARN', message: 'Metadata synchronization drift: 500 records out of sync with master.' },
          { timestamp: '2025-07-21 10:26:56', level: 'WARN', message: 'Connection pool exhaustion risk: Peak usage patterns suggest scaling needed.' },
          { timestamp: '2025-07-21 10:26:53', level: 'WARN', message: 'Background service unresponsive: Heartbeat missed for 2 minutes.' },
          { timestamp: '2025-07-21 10:26:50', level: 'WARN', message: 'Data retention policy violation: 180-day-old records not archived.' }
        ]
      },
      'Processing Server': {
        summary: 'High resource utilization detected with multiple task queue overflows. GPU memory limitations are causing processing failures.',
        logExcerpts: [
          { timestamp: '2025-07-21 11:05:22', level: 'ERROR', message: 'GPU memory allocation failed. Required: 4.2GB, Available: 3.8GB' },
          { timestamp: '2025-07-21 11:05:21', level: 'ERROR', message: 'Processing task failed: Invalid video stream from camera_001.' },
          { timestamp: '2025-07-21 11:04:15', level: 'WARN', message: 'Task queue overflow: 150 pending tasks, max capacity reached.' },
          { timestamp: '2025-07-21 11:04:12', level: 'WARN', message: 'High GPU utilization detected: 98% usage sustained for 10+ minutes.' },
          { timestamp: '2025-07-21 11:04:08', level: 'WARN', message: 'Video processing latency exceeding threshold: 2.5s average delay.' },
          { timestamp: '2025-07-21 11:04:05', level: 'WARN', message: 'Memory fragmentation detected: 45% fragmented heap space.' },
          { timestamp: '2025-07-21 11:04:02', level: 'WARN', message: 'Processing queue backlog: 500+ frames pending analysis.' },
          { timestamp: '2025-07-21 11:03:58', level: 'WARN', message: 'Thermal throttling warning: GPU temperature 85°C (limit: 90°C).' },
          { timestamp: '2025-07-21 11:03:55', level: 'WARN', message: 'Camera stream quality degraded: Multiple frame drops detected.' },
          { timestamp: '2025-07-21 11:03:52', level: 'WARN', message: 'Processing thread pool near capacity: 28 of 32 threads active.' },
          { timestamp: '2025-07-21 11:03:48', level: 'WARN', message: 'Real-time processing lag: 3.2s behind live stream.' },
          { timestamp: '2025-07-21 11:03:45', level: 'WARN', message: 'Video codec performance warning: H.264 decode speed below optimal.' },
          { timestamp: '2025-07-21 11:03:42', level: 'WARN', message: 'Buffer overflow risk: Input buffer 90% capacity for camera_007.' },
          { timestamp: '2025-07-21 11:03:38', level: 'WARN', message: 'Analysis pipeline stall: Motion detection module unresponsive 15s.' },
          { timestamp: '2025-07-21 11:03:35', level: 'WARN', message: 'Resource contention detected: Multiple streams competing for GPU memory.' },
          { timestamp: '2025-07-21 11:03:32', level: 'WARN', message: 'Frame synchronization warning: Timestamps out of sequence for 2+ minutes.' },
          { timestamp: '2025-07-21 11:03:28', level: 'WARN', message: 'Processing efficiency down 25%: Increased computational overhead detected.' },
          { timestamp: '2025-07-21 11:03:25', level: 'WARN', message: 'AI model inference slow: Object detection taking 250ms+ per frame.' },
          { timestamp: '2025-07-21 11:03:22', level: 'WARN', message: 'Video stream interruption: Camera_003 connection unstable for 5 minutes.' },
          { timestamp: '2025-07-21 11:03:18', level: 'WARN', message: 'Memory leak detection: Heap usage increased 500MB over 30 minutes.' },
          { timestamp: '2025-07-21 11:03:15', level: 'WARN', message: 'Processing quality threshold breach: Accuracy dropped below 95%.' },
          { timestamp: '2025-07-21 11:03:12', level: 'WARN', message: 'Batch processing delay: Analytics jobs queued for 45+ minutes.' },
          { timestamp: '2025-07-21 11:03:08', level: 'WARN', message: 'Network bandwidth congestion: Video stream quality auto-reduced.' },
          { timestamp: '2025-07-21 11:03:05', level: 'WARN', message: 'Processing statistics anomaly: Frame rate variance >30% detected.' },
          { timestamp: '2025-07-21 11:03:02', level: 'WARN', message: 'Storage write performance degraded: Processing output delay 2+ seconds.' },
          { timestamp: '2025-07-21 11:02:58', level: 'WARN', message: 'Multi-stream processing overload: Reducing concurrent analysis threads.' },
          { timestamp: '2025-07-21 11:02:55', level: 'WARN', message: 'Video enhancement module warning: Noise reduction taking excessive time.' },
          { timestamp: '2025-07-21 11:02:52', level: 'WARN', message: 'Processing configuration drift: Settings differ from optimization baseline.' },
          { timestamp: '2025-07-21 11:02:48', level: 'WARN', message: 'Algorithm performance warning: Detection accuracy variation detected.' },
          { timestamp: '2025-07-21 11:02:45', level: 'WARN', message: 'System resource alert: CPU usage >90% during peak processing periods.' },
          { timestamp: '2025-07-21 11:02:42', level: 'WARN', message: 'Processing workflow interruption: Manual intervention required for stuck job.' },
          { timestamp: '2025-07-21 11:02:38', level: 'WARN', message: 'Video metadata inconsistency: Timestamp synchronization issues detected.' },
          { timestamp: '2025-07-21 11:02:35', level: 'WARN', message: 'Processing engine health check: Performance metrics below expected range.' },
          { timestamp: '2025-07-21 11:02:32', level: 'WARN', message: 'Camera calibration warning: Auto-focus adjustment affecting video quality.' },
          { timestamp: '2025-07-21 11:02:28', level: 'WARN', message: 'Processing schedule conflict: Multiple high-priority jobs competing for resources.' },
          { timestamp: '2025-07-21 11:02:25', level: 'WARN', message: 'Video compression efficiency warning: Output size larger than expected.' },
          { timestamp: '2025-07-21 11:02:22', level: 'WARN', message: 'Real-time analysis backlog: Event detection delayed 90+ seconds.' },
          { timestamp: '2025-07-21 11:02:18', level: 'WARN', message: 'Processing node communication warning: Inter-node latency >100ms.' },
          { timestamp: '2025-07-21 11:02:15', level: 'WARN', message: 'Video stream validation warning: Resolution mismatch detected camera_012.' },
          { timestamp: '2025-07-21 11:02:12', level: 'WARN', message: 'Processing cache inefficiency: Hit ratio dropped to 65% (target: 85%).' },
          { timestamp: '2025-07-21 11:02:08', level: 'WARN', message: 'Algorithm model loading delay: AI weights taking 15+ seconds to initialize.' },
          { timestamp: '2025-07-21 11:02:05', level: 'WARN', message: 'Video processing audit warning: Quality assurance checks taking excessive time.' },
          { timestamp: '2025-07-21 11:02:02', level: 'WARN', message: 'Processing environment monitoring: Temperature sensors indicating thermal stress.' },
          { timestamp: '2025-07-21 11:01:58', level: 'WARN', message: 'Video analytics slowdown: Object tracking accuracy decreased 12%.' },
          { timestamp: '2025-07-21 11:01:55', level: 'WARN', message: 'Processing dependency warning: External service response time >5 seconds.' },
          { timestamp: '2025-07-21 11:01:52', level: 'WARN', message: 'Video frame buffer warning: Near capacity for multiple simultaneous streams.' },
          { timestamp: '2025-07-21 11:01:48', level: 'WARN', message: 'Processing optimization needed: Current algorithms 40% slower than baseline.' },
          { timestamp: '2025-07-21 11:01:45', level: 'WARN', message: 'Video quality assessment warning: Automated QC detected anomalies.' },
          { timestamp: '2025-07-21 11:01:42', level: 'WARN', message: 'Processing resource allocation warning: Uneven workload distribution detected.' },
          { timestamp: '2025-07-21 11:01:38', level: 'WARN', message: 'Video stream continuity warning: Gap detection in 3 camera feeds.' },
          { timestamp: '2025-07-21 11:01:35', level: 'WARN', message: 'Processing maintenance alert: Scheduled cleanup operations overdue by 2 hours.' },
          { timestamp: '2025-07-21 11:01:32', level: 'WARN', message: 'Video enhancement pipeline warning: Color correction taking 3x normal time.' },
          { timestamp: '2025-07-21 11:01:28', level: 'WARN', message: 'Processing load balancing inefficiency: 80% load on 2 of 8 available nodes.' },
          { timestamp: '2025-07-21 11:01:25', level: 'WARN', message: 'Video format compatibility warning: Legacy codec requiring software decode.' },
          { timestamp: '2025-07-21 11:01:22', level: 'WARN', message: 'Processing job prioritization conflict: High-priority job delayed by routine tasks.' },
          { timestamp: '2025-07-21 11:01:18', level: 'WARN', message: 'Video stream health monitoring: 5 cameras showing intermittent signal loss.' },
          { timestamp: '2025-07-21 11:01:15', level: 'WARN', message: 'Processing algorithm update needed: Current version 3 releases behind stable.' },
          { timestamp: '2025-07-21 11:01:12', level: 'WARN', message: 'Video processing completion rate: 85% (target >95%) over last hour.' },
          { timestamp: '2025-07-21 11:01:08', level: 'WARN', message: 'Processing infrastructure warning: Network bandwidth utilization >90%.' },
          { timestamp: '2025-07-21 11:01:05', level: 'WARN', message: 'Video quality regression detected: Compression artifacts in output increased.' },
          { timestamp: '2025-07-21 11:01:02', level: 'WARN', message: 'Processing workflow validation warning: Missing checkpoints in 15% of jobs.' },
          { timestamp: '2025-07-21 11:00:58', level: 'WARN', message: 'Video metadata validation warning: Inconsistent frame rate data detected.' },
          { timestamp: '2025-07-21 11:00:55', level: 'WARN', message: 'Processing error recovery: Auto-restart triggered for failed analysis modules.' },
          { timestamp: '2025-07-21 11:00:52', level: 'WARN', message: 'Video stream processing lag: 2.8 second average delay across all cameras.' },
          { timestamp: '2025-07-21 11:00:48', level: 'WARN', message: 'Processing capacity planning warning: Current growth rate will exceed limits in 30 days.' },
          { timestamp: '2025-07-21 11:00:45', level: 'WARN', message: 'Video analytics configuration warning: Detection sensitivity settings may need adjustment.' },
          { timestamp: '2025-07-21 11:00:42', level: 'WARN', message: 'Processing system maintenance: Performance degradation expected during update window.' },
          { timestamp: '2025-07-21 11:00:38', level: 'WARN', message: 'Video processing efficiency report: 25% increase in processing time per frame.' },
          { timestamp: '2025-07-21 11:00:35', level: 'WARN', message: 'Processing queue management warning: Job scheduling algorithm showing bias toward newer requests.' },
          { timestamp: '2025-07-21 11:00:32', level: 'WARN', message: 'Video stream multiplexing warning: Channel conflict detected on input port 7.' },
          { timestamp: '2025-07-21 11:00:28', level: 'WARN', message: 'Processing redundancy check: Backup processing nodes showing increased response times.' },
          { timestamp: '2025-07-21 11:00:25', level: 'WARN', message: 'Video analysis precision warning: Edge detection accuracy variance >10%.' },
          { timestamp: '2025-07-21 11:00:22', level: 'WARN', message: 'Processing resource monitoring: Memory usage pattern suggests potential optimization needed.' },
          { timestamp: '2025-07-21 11:00:18', level: 'WARN', message: 'Video processing audit trail: Missing processing timestamps for 8% of completed jobs.' },
          { timestamp: '2025-07-21 11:00:15', level: 'WARN', message: 'Processing scalability assessment: Current architecture may limit horizontal scaling.' },
          { timestamp: '2025-07-21 11:00:12', level: 'WARN', message: 'Video quality assurance warning: Automated validation catching 15% more issues than baseline.' },
          { timestamp: '2025-07-21 11:00:08', level: 'WARN', message: 'Processing workflow optimization: Manual intervention rate increased 40% this week.' },
          { timestamp: '2025-07-21 11:00:05', level: 'WARN', message: 'Video stream diagnostic warning: Signal integrity issues detected on 3 camera channels.' },
          { timestamp: '2025-07-21 11:00:02', level: 'WARN', message: 'Processing performance baseline: Current metrics 20% below historical averages.' },
          { timestamp: '2025-07-21 10:59:58', level: 'WARN', message: 'Video processing pipeline warning: Intermediate stage bottleneck identified in motion analysis.' },
          { timestamp: '2025-07-21 10:59:55', level: 'WARN', message: 'Processing job distribution inefficiency: Load imbalance causing queue buildup on node 3.' },
          { timestamp: '2025-07-21 10:59:52', level: 'WARN', message: 'Video format standardization warning: Mixed codec usage impacting processing efficiency.' },
          { timestamp: '2025-07-21 10:59:48', level: 'WARN', message: 'Processing algorithm convergence warning: Machine learning models showing training drift.' },
          { timestamp: '2025-07-21 10:59:45', level: 'WARN', message: 'Video stream coordination warning: Multi-camera synchronization timing issues detected.' },
          { timestamp: '2025-07-21 10:59:42', level: 'WARN', message: 'Processing infrastructure capacity: Peak hour utilization approaching design limits.' },
          { timestamp: '2025-07-21 10:59:38', level: 'WARN', message: 'Video analytics accuracy warning: False positive rate increased 8% over last 24 hours.' },
          { timestamp: '2025-07-21 10:59:35', level: 'WARN', message: 'Processing maintenance window: Scheduled downtime may impact real-time analysis capabilities.' },
          { timestamp: '2025-07-21 10:59:32', level: 'WARN', message: 'Video processing compliance warning: Audit requirements may need updated processing logs.' },
          { timestamp: '2025-07-21 10:59:28', level: 'WARN', message: 'Processing redundancy verification: Failover mechanisms tested with 2.3s switchover time.' },
          { timestamp: '2025-07-21 10:59:25', level: 'WARN', message: 'Video stream health assessment: 12% of cameras reporting marginal signal quality.' },
          { timestamp: '2025-07-21 10:59:22', level: 'WARN', message: 'Processing optimization recommendation: Algorithm tuning could improve throughput by 15%.' },
          { timestamp: '2025-07-21 10:59:18', level: 'WARN', message: 'Video processing environmental monitoring: Server room temperature elevated 3°C above normal.' },
          { timestamp: '2025-07-21 10:59:15', level: 'WARN', message: 'Processing workflow checkpoint: Intermediate results validation taking longer than expected.' },
          { timestamp: '2025-07-21 10:59:12', level: 'WARN', message: 'Video quality enhancement warning: Upscaling algorithms consuming 40% more GPU resources.' },
          { timestamp: '2025-07-21 10:59:08', level: 'WARN', message: 'Processing data integrity check: Checksums verification identified 0.02% corruption rate.' },
          { timestamp: '2025-07-21 10:59:05', level: 'WARN', message: 'Video stream buffer management: Overflow prevention mechanisms activated on 4 channels.' },
          { timestamp: '2025-07-21 10:59:02', level: 'WARN', message: 'Processing system health: Overall performance index dropped 5 points below optimal range.' },
          { timestamp: '2025-07-21 10:58:58', level: 'WARN', message: 'Video processing completion notification: Delay in job status updates affecting downstream systems.' },
          { timestamp: '2025-07-21 10:58:55', level: 'WARN', message: 'Processing resource allocation adjustment: Dynamic scaling triggered due to increased workload.' },
          { timestamp: '2025-07-21 10:58:52', level: 'WARN', message: 'Video analytics model warning: Training data drift detected, retraining recommended.' },
          { timestamp: '2025-07-21 10:58:48', level: 'WARN', message: 'Processing pipeline configuration: Non-optimal settings detected in video enhancement stage.' }
        ]
      },
      'Fetching Service': {
        summary: 'Network connectivity issues detected with packet loss and VMS connection timeouts affecting data retrieval.',
        logExcerpts: [
          { timestamp: '2025-07-21 10:29:45', level: 'WARN', message: 'Packet loss detected: 15.3% over last 60 seconds.' },
          { timestamp: '2025-07-21 10:29:42', level: 'WARN', message: 'VMS connection latency spike: 850ms average response time.' },
          { timestamp: '2025-07-21 10:29:38', level: 'WARN', message: 'Data retrieval timeout: Camera feed request exceeded 30s limit.' },
          { timestamp: '2025-07-21 10:29:35', level: 'WARN', message: 'Network bandwidth utilization: 92% of available capacity.' },
          { timestamp: '2025-07-21 10:29:32', level: 'WARN', message: 'Connection pool near exhaustion: 18 of 20 connections active.' },
          { timestamp: '2025-07-21 10:29:28', level: 'WARN', message: 'VMS authentication slow: Token refresh taking 12+ seconds.' },
          { timestamp: '2025-07-21 10:29:25', level: 'WARN', message: 'Data synchronization lag: 45 second delay from source.' },
          { timestamp: '2025-07-21 10:29:22', level: 'WARN', message: 'Network route inefficiency: Packets taking suboptimal path.' },
          { timestamp: '2025-07-21 10:29:18', level: 'WARN', message: 'Connection retry mechanism: 3 failed attempts for VMS endpoint.' },
          { timestamp: '2025-07-21 10:29:15', level: 'WARN', message: 'Data integrity check warning: 2% of fetched data requires re-validation.' },
          { timestamp: '2025-07-21 10:29:12', level: 'WARN', message: 'Load balancer health check: 1 of 3 VMS nodes responding slowly.' },
          { timestamp: '2025-07-21 10:29:08', level: 'WARN', message: 'Fetch operation backlog: 25 pending requests queued for processing.' }
        ]
      },
      'Filtering Service': {
        summary: 'Filter rule compilation failures and performance degradation affecting content processing pipeline.',
        logExcerpts: [
          { timestamp: '2025-07-21 10:45:30', level: 'ERROR', message: 'Filter rule compilation failed: Invalid regex pattern in rule #45.' },
          { timestamp: '2025-07-21 10:45:27', level: 'ERROR', message: 'Content filter engine crash: Null pointer exception in pattern matcher.' },
          { timestamp: '2025-07-21 10:45:24', level: 'ERROR', message: 'Rule validation error: Circular dependency detected in filter chain.' },
          { timestamp: '2025-07-21 10:45:21', level: 'ERROR', message: 'Filter initialization failed: Required library libpcre2.so not found.' },
          { timestamp: '2025-07-21 10:45:18', level: 'ERROR', message: 'Pattern matching error: Regular expression stack overflow.' },
          { timestamp: '2025-07-21 10:45:15', level: 'ERROR', message: 'Filter configuration load error: Malformed XML in rules file.' },
          { timestamp: '2025-07-21 10:45:12', level: 'ERROR', message: 'Content analysis engine failure: Classification module unresponsive.' },
          { timestamp: '2025-07-21 10:45:09', level: 'ERROR', message: 'Filter rule execution error: Memory access violation in pattern engine.' },
          { timestamp: '2025-07-21 10:45:06', level: 'ERROR', message: 'Database connection failed: Cannot update filter statistics table.' },
          { timestamp: '2025-07-21 10:45:03', level: 'ERROR', message: 'Filter chain validation error: Missing required input parameters.' },
          { timestamp: '2025-07-21 10:45:00', level: 'ERROR', message: 'Content filtering crash: Segmentation fault in text processor.' },
          { timestamp: '2025-07-21 10:44:57', level: 'ERROR', message: 'Rule compiler error: Syntax error at line 342 of custom filter.' },
          { timestamp: '2025-07-21 10:44:54', level: 'ERROR', message: 'Filter engine deadlock: Mutex contention in rule evaluation.' },
          { timestamp: '2025-07-21 10:44:51', level: 'ERROR', message: 'Content analysis failure: Unicode decoder returned invalid sequence.' },
          { timestamp: '2025-07-21 10:44:48', level: 'ERROR', message: 'Filter rule optimization error: Infinite loop detected in pattern.' },
          { timestamp: '2025-07-21 10:44:45', level: 'ERROR', message: 'Pipeline initialization failed: Cannot allocate buffer pool.' },
          { timestamp: '2025-07-21 10:44:42', level: 'ERROR', message: 'Filter configuration error: Duplicate rule ID #127 found.' },
          { timestamp: '2025-07-21 10:44:39', level: 'ERROR', message: 'Content processor crash: Exception in natural language analysis.' },
          { timestamp: '2025-07-21 10:44:36', level: 'ERROR', message: 'Filter rule application error: Cannot access content metadata.' },
          { timestamp: '2025-07-21 10:44:33', level: 'ERROR', message: 'Regex engine failure: Pattern compilation exceeded memory limit.' },
          { timestamp: '2025-07-21 10:44:30', level: 'ERROR', message: 'Filter validation error: Unsupported operation in rule set.' },
          { timestamp: '2025-07-21 10:44:27', level: 'ERROR', message: 'Content analysis engine error: Dictionary lookup service unavailable.' },
          { timestamp: '2025-07-21 10:44:24', level: 'ERROR', message: 'Filter rule execution timeout: Pattern matching exceeded 30s limit.' },
          { timestamp: '2025-07-21 10:44:21', level: 'ERROR', message: 'Pipeline configuration error: Invalid filter ordering specified.' },
          { timestamp: '2025-07-21 10:44:18', level: 'ERROR', message: 'Content filtering failure: Text normalization service crashed.' },
          { timestamp: '2025-07-21 10:44:15', level: 'ERROR', message: 'Filter engine resource error: Thread pool exhaustion detected.' },
          { timestamp: '2025-07-21 10:44:12', level: 'WARN', message: 'Content analysis pipeline stalled for 30+ seconds.' },
          { timestamp: '2025-07-21 10:44:09', level: 'WARN', message: 'Filter performance degradation: Processing speed down 40%.' },
          { timestamp: '2025-07-21 10:44:06', level: 'WARN', message: 'Rule compilation slow: Average compile time >5 seconds.' },
          { timestamp: '2025-07-21 10:44:03', level: 'WARN', message: 'Content filter accuracy warning: False positive rate increased.' },
          { timestamp: '2025-07-21 10:44:00', level: 'WARN', message: 'Filter rule maintenance needed: 15 deprecated patterns detected.' },
          { timestamp: '2025-07-21 10:43:57', level: 'ERROR', message: 'Filter checkpoint validation failed: Integrity check returned errors.' },
          { timestamp: '2025-07-21 10:43:54', level: 'ERROR', message: 'Content processing abort: Critical filter rule dependency missing.' }
        ]
      }
    };
    return analyses[serviceName] || { summary: 'Analysis not available.', logExcerpts: [] };
  };

  const getLogLevelColor = (level: string) => {
    const colors: { [key: string]: string } = {
      'ERROR': 'text-red-400',
      'WARN': 'text-yellow-400',
      'INFO': 'text-blue-400',
      'DEBUG': 'text-gray-400',
    };
    return colors[level] || 'text-gray-400';
  };

  // Generate chronological events for the story view
  const generateChronologicalEvents = () => {
    const events: Array<{timestamp: string; server: string; service: string; message: string; type: string}> = [];
    
    // Create a mapping of service names to servers
    const serviceToServer: { [key: string]: string } = {};
    summaryData.forEach(item => {
      serviceToServer[item.service] = item.server;
    });
    
    // Add ALL log excerpts from service analysis for each service
    const services = ['VSServer Service', 'Processing Server', 'Fetching Service', 'Filtering Service'];
    
    services.forEach(serviceName => {
      const analysis = getServiceAnalysis(serviceName);
      analysis.logExcerpts.forEach(excerpt => {
        const type = excerpt.level.toLowerCase() === 'error' ? 'error' : 
                    excerpt.level.toLowerCase() === 'warn' ? 'warning' : 'info';
        events.push({
          timestamp: excerpt.timestamp,
          server: serviceToServer[serviceName] || 'PrimaryServer',
          service: serviceName,
          message: excerpt.message,
          type: type
        });
      });
    });

    // Add additional sample events for services without detailed analysis
    const additionalEvents = [
      { timestamp: '2025-07-21 10:25:00', server: 'PrimaryServer', service: 'Task Management Service', message: 'Task scheduler started successfully.', type: 'info' },
      { timestamp: '2025-07-21 10:35:22', server: 'PrimaryServer', service: 'Notification Service', message: 'Alert threshold breached for CPU usage.', type: 'warning' },
      { timestamp: '2025-07-21 10:40:15', server: 'PrimaryServer', service: 'Task Management Service', message: 'Workflow orchestration completed.', type: 'info' },
      { timestamp: '2025-07-21 10:50:45', server: 'PrimaryServer', service: 'Notification Service', message: 'Email notification delivery failed.', type: 'error' },
      { timestamp: '2025-07-21 11:10:30', server: 'PrimaryServer', service: 'Task Management Service', message: 'Priority queue rebalancing initiated.', type: 'info' },
    ];

    events.push(...additionalEvents);
    
    // Sort events by timestamp
    events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    return events;
  };

  const chronologicalEvents = generateChronologicalEvents();

  const getServiceColor = (serviceName: string) => {
    const colors: { [key: string]: string } = {
      'VSServer Service': 'text-blue-400',
      'Fetching Service': 'text-green-400',
      'Processing Server': 'text-orange-400',
      'Filtering Service': 'text-purple-400',
      'Task Management Service': 'text-pink-400',
      'Notification Service': 'text-cyan-400',
    };
    return colors[serviceName] || 'text-gray-400';
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'critical': 'text-red-400',
      'error': 'text-red-400',
      'warning': 'text-yellow-400',
      'info': 'text-blue-400',
    };
    return colors[type] || 'text-gray-400';
  };

  const handleViewFullLog = (serviceName: string, logExcerpt: LogExcerpt) => {
    // Find the matching log in chronological events
    const logIndex = chronologicalEvents.findIndex(event => 
      event.service === serviceName && 
      event.message === logExcerpt.message &&
      event.timestamp === logExcerpt.timestamp
    );
    
    if (logIndex !== -1) {
      setHighlightedLogIndex(logIndex);
      setActiveTab('chronological');
      
      // Scroll to the highlighted log after tab switch
      setTimeout(() => {
        const logElement = document.getElementById(`log-entry-${logIndex}`);
        if (logElement) {
          logElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
         }
   };

  const handleGoToSource = (serviceName: string, logExcerpt: LogExcerpt) => {
    // Create detailed source log information
    const sourceLogData = {
      serviceName,
      logExcerpt,
      fullContext: {
        fileName: `/var/log/briefcam/${serviceName.toLowerCase().replace(/\s+/g, '_')}.log`,
        lineNumber: Math.floor(Math.random() * 10000) + 1000,
        contextBefore: [
          `[${logExcerpt.timestamp}] [INFO] Service initialization completed`,
          `[${logExcerpt.timestamp}] [DEBUG] Loading configuration parameters`,
          `[${logExcerpt.timestamp}] [INFO] Starting background processes`,
        ],
        contextAfter: [
          `[${logExcerpt.timestamp}] [INFO] Attempting recovery procedure`,
          `[${logExcerpt.timestamp}] [DEBUG] Checking system resources`,
          `[${logExcerpt.timestamp}] [INFO] Recovery completed successfully`,
        ]
      }
    };
    
    setSelectedSourceLog(sourceLogData);
    setShowSourceModal(true);
  };

  // Generate unique ID for each log line
  const generateLogLineId = (service: string, excerpt: any, index: number) => {
    return `${service}-${excerpt.timestamp}-${index}`;
  };

  // Function to handle unhiding with scroll preservation
  const handleToggleLogLineVisibility = (logLineId: string, serviceName: string) => {
    const scrollContainer = scrollContainerRefs.current.get(serviceName);
    const wasHidden = hiddenLogLines.has(logLineId);
    
    if (wasHidden && scrollContainer) {
      // Store scroll position before unhiding
      const scrollTop = scrollContainer.scrollTop;
      
      // Unhide the line
      onToggleLogLineVisibility(logLineId);
      
      // Restore scroll position after a brief delay to allow re-render
      requestAnimationFrame(() => {
        scrollContainer.scrollTop = scrollTop;
      });
    } else {
      // For hiding, just proceed normally
      onToggleLogLineVisibility(logLineId);
    }
  };

  // Function to handle marking/unmarking log lines
  const handleToggleLogLineMarking = (logLineId: string) => {
    onToggleLogLineMarking(logLineId);
  };

  // Expose resetHiddenLines function to parent components
  useImperativeHandle(ref, () => ({
    resetHiddenLines: () => {
      // This is now handled by the global state, so we don't need to do anything here
      // The function is kept for backward compatibility
    },
    resetMarkedLines: () => {
      // This is now handled by the global state, so we don't need to do anything here
      // The function is kept for backward compatibility
    },
  }));

  const handleExportPDF = () => {
    setShowExportModal(false);
    // Generate PDF export logic
    console.log('Exporting as PDF...');
    // You can integrate with a PDF library like jsPDF here
  };

  const handleExportJSON = () => {
    setShowExportModal(false);
    // Generate JSON export
    const exportData = {
      timestamp: new Date().toISOString(),
      summary: summaryData,
      chronologicalEvents: chronologicalEvents,
      serviceAnalysis: summaryData.map(item => ({
        service: item.service,
        analysis: getServiceAnalysis(item.service)
      }))
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `briefcam-analysis-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    setShowExportModal(false);
    // Generate CSV export for issues
    const csvHeader = 'Server,Service,Error Count,Warning Count,Issue Type,Timestamp,Message\n';
    const csvRows = summaryData.flatMap(item => {
      const analysis = getServiceAnalysis(item.service);
      return analysis.logExcerpts.map(excerpt => 
        `"${item.server}","${item.service}",${item.errors},${item.warnings},"${excerpt.level}","${excerpt.timestamp}","${excerpt.message}"`
      );
    }).join('\n');
    
    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `briefcam-issues-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header with Title */}
      <div className="px-6 py-4">
        <h2 className="text-2xl font-bold text-white">Collection and Analysis</h2>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-between items-center px-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('summary')}
            className={`py-3 px-1 text-sm font-medium tracking-wider transition-colors relative focus:outline-none focus:ring-0 focus:border-none outline-none border-none ${
              activeTab === 'summary'
                ? 'text-[#0083FF]'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Initial scan summary
            {activeTab === 'summary' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0083FF]"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('chronological')}
            className={`py-3 px-1 text-sm font-medium tracking-wider transition-colors relative focus:outline-none focus:ring-0 focus:border-none outline-none border-none ${
              activeTab === 'chronological'
                ? 'text-[#0083FF]'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Chronological story
            {activeTab === 'chronological' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0083FF]"></div>
            )}
          </button>
        </div>
        
        {/* Export Button - positioned next to tabs */}
        <button
          onClick={() => setShowExportModal(true)}
          className="border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-medium py-2 px-4 rounded-lg transition-colors bg-transparent hover:bg-gray-700/50"
        >
          {activeTab === 'summary' ? 'Export Summary' : 'Export chronological mix log'}
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6">
        <div className="w-full space-y-6">
        {activeTab === 'summary' ? (
          <>
            {/* Filter Search */}
            <div className="w-full">
              <input
                type="text"
                placeholder="Filter services..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Summary List */}
            <div className="w-full bg-gray-800 rounded-lg overflow-hidden">
              {/* List Body */}
              <div className="divide-y divide-gray-700">
                {filteredData.map((item, index) => (
                  <div key={index}>
                    {/* Main Row - Clickable */}
                    <div
                      onClick={() => toggleServiceExpansion(index)}
                      className={`w-full flex items-center justify-between px-6 py-4 hover:bg-gray-700/30 transition-colors cursor-pointer ${
                        expandedServices.has(index) ? 'border-b-2 border-b-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-center">
                        <svg 
                          className={`w-4 h-4 text-gray-500 mr-3 transition-transform duration-200 ${
                            expandedServices.has(index) ? 'rotate-90' : ''
                          }`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-gray-200 font-medium">{item.server}</span>
                        <span className="text-gray-400 mx-2">-</span>
                        <span className="text-gray-200">{item.service}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`font-semibold ${item.errors > 0 ? 'text-red-400' : 'text-gray-500'}`}>
                          {item.errors} errors
                        </span>
                        <span className={`font-semibold ${item.warnings > 20 ? 'text-yellow-400' : 'text-gray-400'}`}>
                          {item.warnings} warnings
                        </span>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedServices.has(index) && (
                      <div className="border-t border-gray-700 p-6 bg-gray-800/50 space-y-4">
                        {/* Critical Log Excerpts */}
                        <div>
                          <div className="mb-3">
                            <h4 className="text-gray-400 font-medium">Critical Log Excerpts</h4>
                          </div>
                          
                          <div 
                            ref={(el) => {
                              if (el) {
                                scrollContainerRefs.current.set(item.service, el);
                              }
                            }}
                            className="bg-gray-900 rounded-lg p-3 font-mono text-xs space-y-1 max-h-96 overflow-y-auto"
                          >
                            {(() => {
                              const excerpts = getServiceAnalysis(item.service).logExcerpts;
                              const visibleExcerpts: Array<{ excerpt: LogExcerpt; excerptIndex: number; logLineId: string; isHidden: boolean; isMarked: boolean }> = [];
                              const hiddenExcerpts: Array<{ excerpt: LogExcerpt; excerptIndex: number; logLineId: string; isHidden: boolean; isMarked: boolean }> = [];
                              
                              // Separate visible and hidden excerpts
                              excerpts.forEach((excerpt, excerptIndex) => {
                                const logLineId = generateLogLineId(item.service, excerpt, excerptIndex);
                                const isHidden = hiddenLogLines.has(logLineId);
                                const isMarked = markedLogLines.has(logLineId);
                                
                                if (isHidden) {
                                  hiddenExcerpts.push({ excerpt, excerptIndex, logLineId, isHidden, isMarked });
                                } else {
                                  visibleExcerpts.push({ excerpt, excerptIndex, logLineId, isHidden, isMarked });
                                }
                              });
                              
                              // Combine with visible first, hidden at the end
                              const sortedExcerpts = [...visibleExcerpts, ...hiddenExcerpts];
                              
                              return sortedExcerpts.map(({ excerpt, excerptIndex, logLineId, isHidden, isMarked }) => (
                                <div 
                                  key={excerptIndex} 
                                  className={`rounded px-2 py-1 transition-colors group flex items-center justify-between cursor-pointer ${
                                    isHidden 
                                      ? 'text-gray-600 bg-gray-800/30' 
                                      : isMarked
                                        ? 'text-gray-300 bg-yellow-900/20 border-l-4 border-yellow-400 hover:bg-yellow-900/30'
                                        : 'text-gray-300 hover:bg-gray-800/50'
                                  }`}
                                  onClick={() => handleToggleLogLineMarking(logLineId)}
                                >
                                  <div className="flex-1 min-w-0 flex items-center">
                                    <div className="flex-1 min-w-0">
                                      <span className={isHidden ? 'text-gray-600' : 'text-gray-500'}>[{excerpt.timestamp}]</span>{' '}
                                      <span className={`font-bold ${isHidden ? 'text-gray-600' : getLogLevelColor(excerpt.level)}`}>[{excerpt.level}]</span>{' '}
                                      <span className="break-words">{excerpt.message}</span>
                                    </div>
                                  </div>
                                  <div className="flex space-x-2 ml-4 transition-opacity opacity-0 group-hover:opacity-100">
                                    {isHidden ? (
                                      <>
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggleLogLineVisibility(logLineId, item.service);
                                          }}
                                          className="px-2 py-1 bg-green-600 hover:bg-green-500 text-white text-xs rounded transition-colors whitespace-nowrap"
                                        >
                                          Unhide
                                        </button>
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleViewFullLog(item.service, excerpt);
                                          }}
                                          className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded transition-colors whitespace-nowrap"
                                        >
                                          Show in context
                                        </button>
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleGoToSource(item.service, excerpt);
                                          }}
                                          className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded transition-colors whitespace-nowrap"
                                        >
                                          View full log
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggleLogLineVisibility(logLineId, item.service);
                                          }}
                                          className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white text-xs rounded transition-colors whitespace-nowrap"
                                        >
                                          Hide
                                        </button>
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleViewFullLog(item.service, excerpt);
                                          }}
                                          className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded transition-colors whitespace-nowrap"
                                        >
                                          Show in context
                                        </button>
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleGoToSource(item.service, excerpt);
                                          }}
                                          className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded transition-colors whitespace-nowrap"
                                        >
                                          View full log
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              ));
                            })()}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>


          </>
        ) : (
          /* Chronological Story View */
          <div>
            <p className="text-gray-400 mb-4 text-sm">
              This view presents a chronological story of events across all selected logs, highlighting interdependencies and causal chains.
            </p>
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm space-y-2 h-96 overflow-y-auto border border-gray-700">
              {chronologicalEvents.map((event, index) => (
                <div 
                  key={index} 
                  id={`log-entry-${index}`}
                  className={`text-gray-300 p-2 rounded transition-colors ${
                    highlightedLogIndex === index ? 'bg-blue-600/30 border border-blue-500' : ''
                  }`}
                >
                  <span className="text-gray-500">[{event.timestamp}]</span>{' '}
                  <span className="text-gray-400">{event.server},</span>{' '}
                  <span className={getServiceColor(event.service)}>{event.service}:</span>{' '}
                  <span className={getTypeColor(event.type)}>{event.message}</span>
                  {event.type === 'critical' && <span className="text-red-400 font-bold"> (Critical)</span>}
                </div>
              ))}
            </div>


          </div>
        )}
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Export Report</h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4">
              <p className="text-gray-400 mb-6">Select the format for your exported report.</p>
              
              {/* Export as PDF */}
              <button
                onClick={handleExportPDF}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
              >
                Export as PDF
              </button>

              {/* Export as JSON */}
              <button
                onClick={handleExportJSON}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
              >
                Export as JSON
              </button>

              {/* Export Issues as CSV */}
              <button
                onClick={handleExportCSV}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
              >
                Export Issues as CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Source Log Modal */}
      {showSourceModal && selectedSourceLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h3 className="text-xl font-bold text-white">Source Log Details</h3>
              <button
                onClick={() => setShowSourceModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400 font-medium">Service:</span>
                  <span className="ml-2 text-white">{selectedSourceLog.serviceName}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-medium">File:</span>
                  <span className="ml-2 text-blue-400 font-mono">{selectedSourceLog.fullContext.fileName}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-medium">Line:</span>
                  <span className="ml-2 text-yellow-400">{selectedSourceLog.fullContext.lineNumber}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-medium">Timestamp:</span>
                  <span className="ml-2 text-gray-300">{selectedSourceLog.logExcerpt.timestamp}</span>
                </div>
              </div>
              
              <div>
                <h4 className="text-gray-400 font-medium mb-2">Full Log Context</h4>
                <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs space-y-1 max-h-96 overflow-y-auto">
                  {/* Context Before */}
                  {selectedSourceLog.fullContext.contextBefore.map((line: string, index: number) => (
                    <div key={`before-${index}`} className="text-gray-500">
                      <span className="text-gray-600 mr-2">{selectedSourceLog.fullContext.lineNumber - 3 + index}</span>
                      {line}
                    </div>
                  ))}
                  
                  {/* Target Line */}
                  <div className="bg-yellow-600/20 border-l-4 border-yellow-400 pl-2 text-yellow-200">
                    <span className="text-yellow-400 mr-2 font-bold">{selectedSourceLog.fullContext.lineNumber}</span>
                    [{selectedSourceLog.logExcerpt.timestamp}] [{selectedSourceLog.logExcerpt.level}] {selectedSourceLog.logExcerpt.message}
                  </div>
                  
                  {/* Context After */}
                  {selectedSourceLog.fullContext.contextAfter.map((line: string, index: number) => (
                    <div key={`after-${index}`} className="text-gray-500">
                      <span className="text-gray-600 mr-2">{selectedSourceLog.fullContext.lineNumber + 1 + index}</span>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    // Simulate opening the actual log file
                    alert(`Opening ${selectedSourceLog.fullContext.fileName} at line ${selectedSourceLog.fullContext.lineNumber}`);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Open in Editor
                </button>
                <button
                  onClick={() => {
                    // Copy file path to clipboard
                    navigator.clipboard.writeText(selectedSourceLog.fullContext.fileName);
                  }}
                  className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Copy Path
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

CollectionResults.displayName = 'CollectionResults';

export default CollectionResults; 