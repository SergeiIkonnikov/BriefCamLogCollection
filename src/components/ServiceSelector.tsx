// Tabbed Service Selector with Expandable Categories - v5.30 - Added Back Keywords Textarea
import React, { useState } from 'react';
import { presetOptions, allServices, timeRangeOptions } from '../utils/constants';
import CustomCheckbox from './CustomCheckbox';
import CustomRadio from './CustomRadio';
import type { UploadedFile } from '../types';

interface ServiceSelectorProps {
  selectedServices: string[];
  uploadedFiles: UploadedFile[];
  currentPreset: string;
  timeRange: string;
  customStartDate: string;
  customEndDate: string;
  onToggleService: (serviceId: string) => void;
  onSetPreset: (presetKey: string) => void;
  onAddUploadedFile: (file: File) => UploadedFile;
  onRemoveUploadedFile: (fileId: string) => void;
  onTimeRangeChange: (timeRange: string) => void;
  onCustomDateChange: (startDate: string, endDate: string) => void;
  onActiveTabChange?: (tab: 'services' | 'upload') => void;
}

const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  selectedServices,
  uploadedFiles,
  currentPreset,
  timeRange,
  customStartDate,
  customEndDate,
  onToggleService,
  onSetPreset,
  onAddUploadedFile,
  onRemoveUploadedFile,
  onTimeRangeChange,
  onCustomDateChange,
  onActiveTabChange,
}) => {
  const [activeTab, setActiveTab] = useState<'services' | 'upload'>('services');

  const handleTabChange = (tab: 'services' | 'upload') => {
    setActiveTab(tab);
    onActiveTabChange?.(tab);
  };
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showDistinctErrors, setShowDistinctErrors] = useState(true);
  const [keywords, setKeywords] = useState('');

  const handlePresetChange = (presetKey: string) => {
    onSetPreset(presetKey);
  };

  const toggleCategory = (categoryKey: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryKey)) {
        newSet.delete(categoryKey);
      } else {
        newSet.add(categoryKey);
      }
      return newSet;
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        onAddUploadedFile(file);
      });
      // Clear the input so the same file can be uploaded again if needed
      event.target.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Filter out upload from radio options
  const radioPresetOptions = presetOptions.filter(preset => preset.key !== 'upload');

  // Organize services by type
  const coreServices = allServices.filter(service => service.type === 'core');
  const recognitionServices = allServices.filter(service => service.type === 'recognition');
  const webServices = allServices.filter(service => service.type === 'web');
  const engineServices = allServices.filter(service => service.type === 'engine');
  const hubServices = allServices.filter(service => service.type === 'hub');
  const systemServices = allServices.filter(service => service.type === 'system');

  const ServiceGrid = ({ services, categoryName, categoryKey }: { services: any[], categoryName: string, categoryKey: string }) => {
    const isExpanded = expandedCategories.has(categoryKey);
    const selectedCount = services.filter(service => selectedServices.includes(service.id)).length;
    
    return (
      <div>
        <button
          onClick={() => toggleCategory(categoryKey)}
          className="flex items-center justify-between w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg hover:bg-gray-700 hover:border-gray-500 transition-colors group"
        >
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">{categoryName}</span>
            {selectedCount > 0 && (
              <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded-full">
                {selectedCount}
              </span>
            )}
          </div>
          <svg 
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isExpanded && (
          <div className="mt-1 px-4 pb-2 grid grid-cols-2 gap-1">
            {services.map((service) => (
                          <label
              key={service.id}
              className="flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-all"
            >
                <CustomCheckbox
                  checked={selectedServices.includes(service.id)}
                  onChange={() => onToggleService(service.id)}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-200 truncate">{service.name}</div>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      {/* Tab Headers */}
      <div className="border-b border-gray-700">
        <div className="flex space-x-8">
          <button
            onClick={() => handleTabChange('services')}
            className={`py-3 px-1 text-sm font-medium tracking-wider transition-colors relative focus:outline-none focus:ring-0 focus:border-none outline-none border-none ${
              activeTab === 'services'
                ? 'text-[#0083FF]'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Collect log to analyse
            {selectedServices.length > 0 && (
              <span className="ml-2 px-2 py-1 text-xs bg-blue-600 text-white rounded-full">
                {selectedServices.length}
              </span>
            )}
            {activeTab === 'services' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0083FF]"></div>
            )}
          </button>
          <button
            onClick={() => handleTabChange('upload')}
            className={`py-3 px-1 text-sm font-medium tracking-wider transition-colors relative focus:outline-none focus:ring-0 focus:border-none outline-none border-none ${
              activeTab === 'upload'
                ? 'text-[#0083FF]'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Upload files to analyse
            {uploadedFiles.length > 0 && (
              <span className="ml-2 px-2 py-1 text-xs bg-blue-600 text-white rounded-full">
                {uploadedFiles.length}
              </span>
            )}
            {activeTab === 'upload' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0083FF]"></div>
            )}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            {/* Quick Presets */}
            <div className="pt-4">
              <h3 className="text-lg font-semibold text-white mb-2">Select product</h3>
              <div className="flex flex-wrap gap-6">
                {radioPresetOptions.map((preset) => (
                  <CustomRadio
                    key={preset.key}
                    label={preset.label}
                    value={preset.key}
                    checked={currentPreset === preset.key}
                    onChange={handlePresetChange}
                    name="preset"
                  />
                ))}
              </div>
            </div>

            {/* Individual Services - All Categories */}
            <div className="pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Services to collect ({selectedServices.length})</h3>
                <button
                  onClick={() => {
                    // Clear all selections
                    selectedServices.forEach(id => onToggleService(id));
                  }}
                  className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Clear Selection
                </button>
              </div>
              
              <div className="bg-gray-800/30 rounded-lg" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {/* Core Services */}
                {coreServices.length > 0 && (
                  <ServiceGrid services={coreServices} categoryName="Core Services" categoryKey="core" />
                )}

                {/* Recognition & Matching */}
                {recognitionServices.length > 0 && (
                  <ServiceGrid services={recognitionServices} categoryName="Recognition & Matching" categoryKey="recognition" />
                )}

                {/* Web & Gateway Services */}
                {webServices.length > 0 && (
                  <ServiceGrid services={webServices} categoryName="Web & Gateway Services" categoryKey="web" />
                )}

                {/* Engine Services */}
                {engineServices.length > 0 && (
                  <ServiceGrid services={engineServices} categoryName="Engine Services" categoryKey="engine" />
                )}

                {/* Multi-Site (Hub) Services */}
                {hubServices.length > 0 && (
                  <ServiceGrid services={hubServices} categoryName="Multi-Site (Hub) Services" categoryKey="hub" />
                )}

                {/* Other System Logs */}
                {systemServices.length > 0 && (
                  <ServiceGrid services={systemServices} categoryName="Other System Logs" categoryKey="system" />
                )}
              </div>
            </div>

            {/* Time Range */}
            <div className="pt-4">
              <h3 className="text-lg font-semibold text-white mb-2">Time Range</h3>
              <div className="flex flex-wrap gap-6">
                {timeRangeOptions.map((option) => (
                  <CustomRadio
                    key={option.value}
                    label={option.label}
                    value={option.value}
                    checked={timeRange === option.value}
                    onChange={onTimeRangeChange}
                    name="timeRange"
                  />
                ))}
              </div>
              
              {/* Custom Date Range */}
              {timeRange === 'custom' && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-gray-800/30 border border-gray-700/50 rounded-lg">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Start Date</label>
                    <input
                      type="datetime-local"
                      value={customStartDate}
                      onChange={(e) => onCustomDateChange(e.target.value, customEndDate)}
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">End Date</label>
                    <input
                      type="datetime-local"
                      value={customEndDate}
                      onChange={(e) => onCustomDateChange(customStartDate, e.target.value)}
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Advanced Settings */}
            <div className="pt-4">
              <h3 className="text-lg font-semibold text-white mb-2">Advanced Settings</h3>
              
              <div className="space-y-4">
                <label className="flex items-center space-x-2 p-2 hover:bg-gray-700/50 rounded-lg cursor-pointer transition-all">
                  <CustomCheckbox
                    checked={showDistinctErrors}
                    onChange={() => setShowDistinctErrors(!showDistinctErrors)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-200">Show Distinct Errors/Warnings</div>
                  </div>
                </label>

                <div>
                  <textarea
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="Enter keywords separated by commas (e.g., fatal, critical, failed)"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                    rows={3}
                  />
                  <p className="mt-1 text-xs text-gray-500">AI analysis will prioritize these keywords.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Files Tab */}
        {activeTab === 'upload' && (
          <div className="space-y-4">
            {/* File Upload Area */}
            <div>
              <label className="block">
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                  <svg className="w-10 h-10 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-base text-gray-300 font-medium">Click to upload files</p>
                  <p className="text-sm text-gray-500 mt-1">Support for multiple log files (.log, .txt, .json, .xml, .csv)</p>
                </div>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".log,.txt,.json,.xml,.csv"
                />
              </label>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-gray-300 mb-3">Uploaded Files ({uploadedFiles.length})</h5>
                <div className="space-y-2">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600/50"
                    >
                      <div className="flex items-center space-x-3">
                        <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <div className="text-sm font-medium text-gray-200">{file.name}</div>
                          <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => onRemoveUploadedFile(file.id)}
                        className="text-red-400 hover:text-red-300 transition-colors p-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Time Range */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Time Range</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-gray-800/30 border border-gray-700/50 rounded-lg">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Start Date</label>
                  <input
                    type="datetime-local"
                    value={customStartDate}
                    onChange={(e) => onCustomDateChange(e.target.value, customEndDate)}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">End Date</label>
                  <input
                    type="datetime-local"
                    value={customEndDate}
                    onChange={(e) => onCustomDateChange(customStartDate, e.target.value)}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceSelector; 