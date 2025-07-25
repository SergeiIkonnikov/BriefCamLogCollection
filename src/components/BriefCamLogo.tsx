import React from 'react';

// BriefCam text title component
interface BriefCamLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

const BriefCamLogo: React.FC<BriefCamLogoProps> = ({ 
  className = ""
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <h1 className="text-2xl font-bold text-white">
        BriefCam
      </h1>
    </div>
  );
};

export default BriefCamLogo; 