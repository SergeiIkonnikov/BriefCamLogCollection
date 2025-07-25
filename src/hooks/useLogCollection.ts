import { useState, useCallback } from 'react';
import type { AppState, ServiceResult, UploadedFile } from '../types';
import { defaultAppState, serviceConfigs, allServices } from '../utils/constants';

export const useLogCollection = () => {
  const [state, setState] = useState<AppState>(defaultAppState);
  const [customSelection, setCustomSelection] = useState<string[]>([]);
  const [currentPreset, setCurrentPreset] = useState<string>('review');

  const updateSelectedServices = useCallback((services: string[]) => {
    setState(prev => ({
      ...prev,
      selectedServices: services
    }));
  }, []);

  const toggleService = useCallback((serviceId: string) => {
    setState(prev => {
      const isSelected = prev.selectedServices.includes(serviceId);
      const newServices = isSelected
        ? prev.selectedServices.filter(id => id !== serviceId)
        : [...prev.selectedServices, serviceId];
      
      // Update custom selection if we're in custom mode
      if (currentPreset === 'none') {
        setCustomSelection(newServices);
      }
      
      return {
        ...prev,
        selectedServices: newServices
      };
    });
  }, [currentPreset]);

  const addUploadedFile = useCallback((file: File) => {
    const uploadedFile: UploadedFile = {
      id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date(),
    };

    setState(prev => ({
      ...prev,
      uploadedFiles: [...prev.uploadedFiles, uploadedFile]
    }));

    return uploadedFile;
  }, []);

  const removeUploadedFile = useCallback((fileId: string) => {
    setState(prev => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter(file => file.id !== fileId)
    }));
  }, []);

  const clearUploadedFiles = useCallback(() => {
    setState(prev => ({
      ...prev,
      uploadedFiles: []
    }));
  }, []);

  const setPreset = useCallback((presetKey: string) => {
    // Save current selection as custom if switching away from 'none' (Custom)
    if (currentPreset === 'none' && presetKey !== 'none') {
      setCustomSelection(state.selectedServices);
    }
    
    // Update current preset
    setCurrentPreset(presetKey);
    
    if (presetKey === 'none') {
      // Restore custom selection
      updateSelectedServices(customSelection);
    } else {
      // Use predefined preset
      const services = serviceConfigs[presetKey] || [];
      updateSelectedServices(services);
    }
  }, [updateSelectedServices, currentPreset, state.selectedServices, customSelection]);

  const setTimeRange = useCallback((timeRange: string) => {
    setState(prev => ({
      ...prev,
      timeRange
    }));
  }, []);

  const setCustomDateRange = useCallback((startDate: string, endDate: string) => {
    setState(prev => ({
      ...prev,
      customStartDate: startDate,
      customEndDate: endDate
    }));
  }, []);

  const setOutputPath = useCallback((path: string) => {
    setState(prev => ({
      ...prev,
      outputPath: path
    }));
  }, []);

  const startCollection = useCallback(async () => {
    setState(prev => ({
      ...prev,
      isCollecting: true,
      showResults: false,
      collectionProgress: {
        currentService: '',
        progress: 0,
        isComplete: false
      }
    }));

    // Simulate collection process
    const selectedServicesList = allServices.filter(service => 
      state.selectedServices.includes(service.id)
    );

    const results: ServiceResult[] = [];
    
    for (let i = 0; i < selectedServicesList.length; i++) {
      const service = selectedServicesList[i];
      
      // Update progress
      setState(prev => ({
        ...prev,
        collectionProgress: {
          currentService: service.name,
          progress: Math.round(((i + 1) / selectedServicesList.length) * 100),
          isComplete: false
        }
      }));

      // Simulate collection time
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate mock results
      const result: ServiceResult = {
        serviceName: service.name,
        status: Math.random() > 0.7 ? 'error' : Math.random() > 0.5 ? 'warning' : 'success',
        entries: Math.floor(Math.random() * 1000) + 100,
        errors: Math.floor(Math.random() * 10),
        warnings: Math.floor(Math.random() * 20),
        duration: `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 9)}s`
      };

      results.push(result);
    }

    // Complete collection
    setState(prev => ({
      ...prev,
      isCollecting: false,
      showResults: true,
      results,
      collectionProgress: {
        currentService: '',
        progress: 100,
        isComplete: true
      }
    }));
  }, [state.selectedServices]);

  const showAIAnalysis = useCallback(() => {
    setState(prev => ({
      ...prev,
      showAIAnalysis: true
    }));
  }, []);

  const hideAIAnalysis = useCallback(() => {
    setState(prev => ({
      ...prev,
      showAIAnalysis: false
    }));
  }, []);

  const newCollection = useCallback(() => {
    setState(prev => ({
      ...prev,
      showResults: false,
      showAIAnalysis: false,
      results: [],
      collectionProgress: {
        currentService: '',
        progress: 0,
        isComplete: false
      }
    }));
  }, []);

  const downloadLogs = useCallback(() => {
    // Generate mock log content
    const logContent = `BriefCam Log Collection Report
Generated on: ${new Date().toISOString()}
Time Range: ${state.timeRange}
Services: ${state.selectedServices.join(', ')}

=== COLLECTION SUMMARY ===
${state.results.map(result => 
  `${result.serviceName}: ${result.entries} entries, ${result.errors} errors, ${result.warnings} warnings`
).join('\n')}

=== DETAILED LOGS ===
${state.results.map(result => 
  `--- ${result.serviceName} ---\n[2024-01-20 10:30:15] [INFO] Service started\n[2024-01-20 10:30:16] [WARN] Sample warning message\n[2024-01-20 10:30:17] [ERROR] Sample error message\n`
).join('\n')}`;

    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `briefcam-logs-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [state]);

  const saveApiKey = useCallback((apiKey: string) => {
    setState(prev => ({
      ...prev,
      config: {
        ...prev.config,
        geminiApiKey: apiKey
      }
    }));
    localStorage.setItem('gemini-api-key', apiKey);
  }, []);

  const toggleLogLineVisibility = useCallback((logLineId: string) => {
    setState(prev => {
      const newHiddenLines = new Set(prev.hiddenLogLines);
      if (newHiddenLines.has(logLineId)) {
        newHiddenLines.delete(logLineId);
      } else {
        newHiddenLines.add(logLineId);
      }
      return {
        ...prev,
        hiddenLogLines: newHiddenLines
      };
    });
  }, []);

  const resetHiddenLogLines = useCallback(() => {
    setState(prev => ({
      ...prev,
      hiddenLogLines: new Set<string>()
    }));
  }, []);

  const toggleLogLineMarking = useCallback((logLineId: string) => {
    setState(prev => {
      const newMarkedLines = new Set(prev.markedLogLines);
      if (newMarkedLines.has(logLineId)) {
        newMarkedLines.delete(logLineId);
      } else {
        newMarkedLines.add(logLineId);
      }
      return {
        ...prev,
        markedLogLines: newMarkedLines
      };
    });
  }, []);

  const resetMarkedLogLines = useCallback(() => {
    setState(prev => ({
      ...prev,
      markedLogLines: new Set<string>()
    }));
  }, []);

  const resetToDefault = useCallback(() => {
    setState(defaultAppState);
    setCustomSelection([]);
    setCurrentPreset('review');
  }, []);

  return {
    // State
    state,
    currentPreset,
    
    // Actions
    updateSelectedServices,
    toggleService,
    addUploadedFile,
    removeUploadedFile,
    clearUploadedFiles,
    setPreset,
    setTimeRange,
    setCustomDateRange,
    setOutputPath,
    startCollection,
    showAIAnalysis,
    hideAIAnalysis,
    newCollection,
    downloadLogs,
    saveApiKey,
    toggleLogLineVisibility,
    resetHiddenLogLines,
    toggleLogLineMarking,
    resetMarkedLogLines,
    resetToDefault,
  };
}; 