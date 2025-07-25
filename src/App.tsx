// BriefCam Log Collection Tool v2.8 - Fixed Expand Button Layout in Collapsed Panel
import React, { useEffect, useState } from 'react';
import { useLogCollection } from './hooks/useLogCollection';
import ServiceSelector from './components/ServiceSelector';
import OutputLocation from './components/OutputLocation';
import CollectionProgress from './components/CollectionProgress';
import CollectionResults from './components/CollectionResults';
import AIAnalysis from './components/AIAnalysis';
import BriefCamLogo from './components/BriefCamLogo';
import './App.css';

function App() {
  const {
    state,
    currentPreset,
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
    downloadLogs,
    toggleLogLineVisibility,
    resetHiddenLogLines,
    toggleLogLineMarking,
    resetMarkedLogLines,
    resetToDefault,
  } = useLogCollection();

  // Initially expanded, but collapses when analysis starts
  const [isConfigPanelExpanded, setIsConfigPanelExpanded] = useState(true);
  const [configChanged, setConfigChanged] = useState(false);
  const [activeTab, setActiveTab] = useState<'services' | 'upload'>('services');

  // Track configuration changes after results are shown
  useEffect(() => {
    if (state.showResults) {
      setConfigChanged(true);
    }
  }, [
    state.selectedServices,
    state.uploadedFiles,
    state.timeRange,
    state.customStartDate,
    state.customEndDate,
    state.outputPath,
  ]);

  // Auto-collapse config panel when analysis starts
  useEffect(() => {
    if (state.isCollecting || state.showResults) {
      setIsConfigPanelExpanded(false);
    }
  }, [state.isCollecting, state.showResults]);

  const handleCollectLogs = () => {
    if (state.selectedServices.length === 0 && state.uploadedFiles.length === 0) {
      alert('Please select at least one service or upload a file');
      return;
    }
    setConfigChanged(false); // Reset config changed flag
    startCollection();
  };

  const handleRedoAnalysis = () => {
    setConfigChanged(false); // Reset config changed flag
    handleCollectLogs();
  };

  const toggleConfigPanel = () => {
    setIsConfigPanelExpanded(!isConfigPanelExpanded);
  };

  const handleLogoClick = () => {
    resetToDefault(); // This now includes resetting hiddenLogLines in the global state
    setIsConfigPanelExpanded(true);
    setConfigChanged(false);
  };

  // Determine if we should show the working area
  const showWorkingArea = state.isCollecting || state.showResults;

  return (
    <div className="h-screen bg-gray-900 text-gray-100 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 flex-shrink-0">
        <div className="w-full px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div 
                className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={handleLogoClick}
                title="Click to reset to default state"
              >
                {/* BriefCam Logo */}
                <BriefCamLogo width={120} height={28} />
                <div>
                  <div className="text-sm text-blue-400 -mt-1">Log Collection and Analysis Tool</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 overflow-hidden">
        <div className={`flex w-full h-full ${!showWorkingArea ? 'justify-center overflow-y-auto scrollbar-hide' : ''}`} style={!showWorkingArea ? {scrollbarWidth: 'none', msOverflowStyle: 'none'} : {}}>
          {/* Configuration Panel */}
          <div className={`transition-all duration-300 flex flex-col ${
            showWorkingArea ? (isConfigPanelExpanded ? 'w-1/3 bg-gray-800 border-r border-gray-700 overflow-y-auto scrollbar-hide' : 'w-12 bg-gray-800 border-r border-gray-700') : 'w-1/2'
          }`} style={showWorkingArea ? {scrollbarWidth: 'none', msOverflowStyle: 'none'} : {}}>
                          {/* Toggle Button - Only show when working area is visible */}
            {showWorkingArea && (
              <div className={`flex items-center border-b border-gray-700 flex-shrink-0 ${
                isConfigPanelExpanded ? 'justify-between p-3' : 'justify-center p-1'
              }`}>
                {isConfigPanelExpanded && (
                  <h2 className="text-xl font-semibold text-white">Configuration</h2>
                )}
                <button
                  onClick={toggleConfigPanel}
                  className={`hover:bg-gray-700 rounded-lg transition-colors ${
                    isConfigPanelExpanded ? 'p-2' : 'p-1'
                  }`}
                  title={isConfigPanelExpanded ? 'Collapse panel' : 'Expand panel'}
                >
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      isConfigPanelExpanded ? '' : 'rotate-180'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
            )}



            {/* Configuration Content */}
            {(!showWorkingArea || isConfigPanelExpanded) && (
              <div className={`space-y-6 ${showWorkingArea ? 'flex-1 overflow-y-auto scrollbar-hide p-6 pb-32' : 'p-8 pb-32'}`}>
                

                {/* Services and File Upload */}
                <ServiceSelector
                  selectedServices={state.selectedServices}
                  uploadedFiles={state.uploadedFiles}
                  currentPreset={currentPreset}
                  timeRange={state.timeRange}
                  customStartDate={state.customStartDate}
                  customEndDate={state.customEndDate}
                  onToggleService={toggleService}
                  onSetPreset={setPreset}
                  onAddUploadedFile={addUploadedFile}
                  onRemoveUploadedFile={removeUploadedFile}
                  onTimeRangeChange={setTimeRange}
                  onCustomDateChange={setCustomDateRange}
                  onActiveTabChange={setActiveTab}
                />

                {/* Output Location */}
                <OutputLocation
                  outputPath={state.outputPath}
                  onOutputPathChange={setOutputPath}
                />
              </div>
            )}
          </div>

          {/* Right Panel - Working Area (Only shown when needed) */}
          {showWorkingArea && (
            <div className="flex-1 flex flex-col overflow-hidden">


              {/* Main Content Area */}
              <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
                {/* First Screen - Centered 50% Width */}
                {!state.isCollecting && !state.showResults && (
                  <div className="w-1/2 flex flex-col items-center justify-center">
                    {/* Setup Header */}
                    <div className="text-center mb-12">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6">
                        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h1 className="text-3xl font-bold text-white mb-4">
                        Configure Collection Scope
                      </h1>
                      <p className="text-lg text-gray-400">
                        Choose services, upload files, set time range, and collection parameters
                      </p>
                    </div>
                  </div>
                )}

                {/* Collection Progress */}
                {state.isCollecting && (
                  <div className="w-1/2 mx-auto">
                    <CollectionProgress
                      progress={state.collectionProgress}
                      selectedServices={state.selectedServices}
                    />
                  </div>
                )}

                {/* Collection Results */}
                {state.showResults && (
                  <div className="w-full h-full overflow-y-auto pb-32">
                    <CollectionResults
                      results={state.results}
                      onShowAIAnalysis={showAIAnalysis}
                      onDownloadLogs={downloadLogs}
                      hiddenLogLines={state.hiddenLogLines}
                      onToggleLogLineVisibility={toggleLogLineVisibility}
                      markedLogLines={state.markedLogLines}
                      onToggleLogLineMarking={toggleLogLineMarking}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Floating Action Buttons - Fixed to bottom of screen, within results area only */}
          {state.showResults && showWorkingArea && (
            <div className={`fixed bottom-0 right-0 p-6 backdrop-blur-md bg-gray-900/30 border-t border-gray-700/50 z-50 ${
              isConfigPanelExpanded ? 'left-1/3' : 'left-12'
            }`}>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleRedoAnalysis}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg shadow-2xl transition-all duration-200 hover:shadow-blue-500/25 hover:scale-105 min-w-[200px] text-lg flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Redo analysis
                </button>
                <button
                  onClick={showAIAnalysis}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-lg shadow-2xl transition-all duration-200 hover:shadow-purple-500/25 hover:scale-105 min-w-[200px] text-lg flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                  </svg>
                  AI Assistant
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* AI Analysis Side Drawer */}
      <>
        {/* Backdrop */}
        <div 
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
            state.showAIAnalysis ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={hideAIAnalysis}
        />
        
        {/* Drawer Panel */}
        <div className={`fixed top-0 right-0 h-full w-1/2 bg-gray-900 border-l border-gray-700 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          state.showAIAnalysis ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700 flex-shrink-0">
            <h2 className="text-xl font-bold text-white">AI-Powered Insights</h2>
            <button
              onClick={hideAIAnalysis}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <AIAnalysis />
            </div>
          </div>
        </div>
      </>

      {/* Fixed Floating Action Button - Only show before results and not collecting */}
      {!state.showResults && !state.isCollecting && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-6 backdrop-blur-md bg-gray-900/30 border-t border-gray-700/50">
          <div className="flex justify-center">
            <button
              onClick={handleCollectLogs}
              disabled={state.selectedServices.length === 0 && state.uploadedFiles.length === 0}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-lg shadow-2xl transition-all duration-200 hover:shadow-blue-500/25 hover:scale-105 disabled:hover:scale-100 min-w-[300px] text-lg"
            >
              {activeTab === 'services' ? 'Collect and analyse logs' : 'Analyse logs'}
            </button>
          </div>
        </div>
      )}


    </div>
  );
}

export default App;
