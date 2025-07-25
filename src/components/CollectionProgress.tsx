import React from 'react';
import type { CollectionProgress as ProgressType } from '../types';

interface CollectionProgressProps {
  progress: ProgressType;
  selectedServices: string[];
}

const CollectionProgress: React.FC<CollectionProgressProps> = ({
  progress,
  selectedServices,
}) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Collecting Logs</h2>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-300">
            {progress.currentService ? `Collecting: ${progress.currentService}` : 'Initializing...'}
          </span>
          <span className="text-sm text-gray-400">{progress.progress}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="progress-fill h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress.progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-medium text-gray-300 mb-4">Services</h3>
        {selectedServices.map((serviceId, index) => {
          const isCompleted = (index + 1) <= (selectedServices.length * progress.progress / 100);
          
          return (
            <div key={serviceId} className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${isCompleted ? 'bg-green-600' : 'bg-gray-600'}`} />
              <span className={`text-sm ${isCompleted ? 'text-green-400' : 'text-gray-400'}`}>
                {serviceId.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CollectionProgress; 