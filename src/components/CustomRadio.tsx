import React, { useState } from 'react';

interface CustomRadioProps {
  label: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  name: string;
}

const CustomRadio: React.FC<CustomRadioProps> = ({
  label,
  value,
  checked,
  onChange,
  name,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="box-border content-stretch flex flex-row gap-3 items-center justify-start p-0 relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onChange(value)}
    >
      {/* Radio Button */}
      <div className="relative shrink-0 size-6">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={() => onChange(value)}
          className="sr-only"
        />
        

        
        {/* Main radio circle */}
        <div className="absolute inset-[16.667%] w-4 h-4">
          <div 
            className={`w-4 h-4 rounded-full border-2 ${
              checked ? 'border-[#0083FF]' : 'border-[#576777]'
            }`} 
          />
        </div>
        
        {/* Selected inner dot */}
        {checked && (
          <div className="absolute inset-[33.333%] w-2 h-2">
            <div className="w-2 h-2 bg-[#0083FF] rounded-full" />
          </div>
        )}
      </div>
      
      {/* Label */}
      <div className="flex flex-col font-['Lato:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-left text-nowrap tracking-[0.4px]">
        <p 
          className={`adjustLetterSpacing block leading-[20px] whitespace-pre ${
            checked 
              ? 'text-[#ffffff]' 
              : isHovered 
              ? 'text-[#ffffff]' 
              : 'text-[#808f98]'
          }`}
        >
          {label}
        </p>
      </div>
    </div>
  );
};

export default CustomRadio; 