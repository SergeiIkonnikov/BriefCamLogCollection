import React from 'react';

interface TimeRangeSelectorProps {
  timeRange: string;
  customStartDate: string;
  customEndDate: string;
  onTimeRangeChange: (timeRange: string) => void;
  onCustomDateChange: (startDate: string, endDate: string) => void;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  timeRange,
  customStartDate,
  customEndDate,
  onTimeRangeChange,
  onCustomDateChange,
}) => {
  const timeOptions = [
    { value: 'last-hour', label: 'Last Hour' },
    { value: 'last-4-hours', label: 'Last 4 Hours' },
    { value: 'last-24-hours', label: 'Last 24 Hours' },
    { value: 'last-week', label: 'Last Week' },
    { value: 'custom', label: 'Custom Range' },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-2">Time Range</h3>

      <div className="grid grid-cols-2 gap-1">
        {timeOptions.map((option) => (
          <label
            key={option.value}
            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-700 p-2 rounded-md transition-colors"
          >
            <input
              type="radio"
              name="timeRange"
              value={option.value}
              checked={timeRange === option.value}
              onChange={() => onTimeRangeChange(option.value)}
              className="w-4 h-4 text-blue-600 bg-gray-600 border-gray-500"
            />
            <span className="text-sm font-medium text-gray-200">{option.label}</span>
          </label>
        ))}
      </div>

      {timeRange === 'custom' && (
        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Start Date & Time
            </label>
            <input
              type="datetime-local"
              value={customStartDate}
              onChange={(e) => onCustomDateChange(e.target.value, customEndDate)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              End Date & Time
            </label>
            <input
              type="datetime-local"
              value={customEndDate}
              onChange={(e) => onCustomDateChange(customStartDate, e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeRangeSelector; 