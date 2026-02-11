
import React from 'react';

interface ToggleSwitchProps {
  label: string;
  toggled: boolean;
  onToggle: (toggled: boolean) => void;
  onLabel: string;
  offLabel: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  toggled,
  onToggle,
  onLabel,
  offLabel,
}) => {
  return (
    <div className="flex items-center justify-center">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={toggled}
          onChange={(e) => onToggle(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-64 h-20 bg-red-500 rounded-full peer peer-checked:bg-green-500 transition-colors duration-300 flex items-center justify-between px-4 text-white font-bold text-xl">
          <span className={`transition-opacity duration-200 ${!toggled ? 'opacity-100' : 'opacity-0'}`}>{offLabel}</span>
          <span className={`transition-opacity duration-200 ${toggled ? 'opacity-100' : 'opacity-0'}`}>{onLabel}</span>
        </div>
        <div className="absolute top-2 left-2 w-16 h-16 bg-white rounded-full transition-transform duration-300 ease-in-out peer-checked:translate-x-44 shadow-lg flex items-center justify-center">
            <div className={`w-10 h-10 rounded-full transition-colors duration-300 ${toggled ? 'bg-green-500' : 'bg-red-500'}`}></div>
        </div>
      </label>
    </div>
  );
};

export default ToggleSwitch;
