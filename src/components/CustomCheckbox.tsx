import React from 'react';

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  indeterminate?: boolean;
  className?: string;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked,
  onChange,
  disabled = false,
  indeterminate = false,
  className = '',
}) => {
  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const getCheckboxStyles = () => {
    const baseStyles = "w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 cursor-pointer relative";
    
    if (disabled) {
      return `${baseStyles} bg-gray-700 border-gray-600 cursor-not-allowed opacity-50`;
    }
    
    if (checked) {
      return `${baseStyles} bg-blue-600 border-blue-600 hover:bg-blue-700 hover:border-blue-700`;
    }
    
    if (indeterminate) {
      return `${baseStyles} bg-blue-600 border-blue-600 hover:bg-blue-700 hover:border-blue-700`;
    }
    
    return `${baseStyles} bg-transparent border-gray-500 hover:border-blue-400 hover:bg-blue-600/10`;
  };

  const renderCheckIcon = () => {
    if (disabled) {
      return null;
    }
    
    if (indeterminate) {
      return (
        <div className="w-2.5 h-0.5 bg-white rounded-full" />
      );
    }
    
    if (checked) {
      return (
        <svg 
          className="w-3 h-3 text-white" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
            clipRule="evenodd" 
          />
        </svg>
      );
    }
    
    return null;
  };

  return (
    <div 
      className={`${getCheckboxStyles()} ${className}`}
      onClick={handleClick}
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : checked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {renderCheckIcon()}
      
      {/* Hidden native checkbox for form compatibility */}
      <input
        type="checkbox"
        checked={checked}
        onChange={() => {}} // Controlled by parent component
        className="sr-only"
        disabled={disabled}
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  );
};

export default CustomCheckbox; 