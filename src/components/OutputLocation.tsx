import React from 'react';

interface OutputLocationProps {
  outputPath: string;
  onOutputPathChange: (path: string) => void;
}

const OutputLocation: React.FC<OutputLocationProps> = ({
  outputPath,
  onOutputPathChange,
}) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-2">Where to store the aggregated file</h3>

      <div>
        <label className="block text-xs font-medium text-gray-400 mb-2">
          Output Directory
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={outputPath}
            onChange={(e) => onOutputPathChange(e.target.value)}
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="/var/log/briefcam"
          />
          <button
            type="button"
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white text-sm font-medium rounded-lg border border-gray-500 transition-colors"
          >
            Browse
          </button>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Specify where collected logs should be saved
        </p>
      </div>
    </div>
  );
};

export default OutputLocation; 