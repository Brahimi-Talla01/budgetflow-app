import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Calendar, TrendingUp, DollarSign } from 'lucide-react';

interface SelectOption {
      label: string;
      value: string;
      icon: React.ElementType; 
}

interface StyledSelectProps {
  onChange: (value: string) => void;
}

const timeOptions: SelectOption[] = [
      { label: "7 derniers jours", value: "last_7_days", icon: Calendar },
      { label: "Ce mois-ci", value: "this_month", icon: DollarSign },
      { label: "6 derniers mois", value: "last_6_months", icon: TrendingUp },
      { label: "Cette année", value: "this_year", icon: Calendar },
];

const StyledSelect = ({ onChange }: StyledSelectProps) => {
      const [selectedOption, setSelectedOption] = useState<SelectOption>(timeOptions[2]);
      const [isOpen, setIsOpen] = useState(false);   
      const selectRef = useRef<HTMLDivElement>(null);

      const handleSelect = useCallback((option: SelectOption) => {
            setSelectedOption(option);
            onChange(option.value);
            setIsOpen(false); 
      }, []);

      useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                  if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                        setIsOpen(false);
                  }
            };

            document.addEventListener("mousedown", handleClickOutside);

            return () => {
                  document.removeEventListener("mousedown", handleClickOutside);
            };
      }, []);

      const SelectedIcon = selectedOption.icon; 

      return (
            <div ref={selectRef} className="relative inline-block text-left z-5">
                  <button
                        type="button"
                        className="inline-flex justify-center items-center w-full rounded-md border border-gray-200 px-4 py-2.5 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-150 cursor-pointer"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-haspopup="true"
                        aria-expanded={isOpen}
                  >
                        <SelectedIcon className="w-4 h-4 mr-2 text-primary" />
                              {selectedOption.label}
                        <ChevronDown 
                              className={`-mr-1 ml-2 h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                        />
                  </button>

                  <div
                        className={`absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-opacity-5 transition-all duration-300 ease-out transform origin-top-right 
                              ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}
                        `}
                  >
                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
                              {timeOptions.map((option) => (
                                    <div
                                          key={option.value}
                                          onClick={() => handleSelect(option)}
                                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary cursor-pointer transition duration-150"
                                          role="menuitem"
                                    >
                                          <option.icon className="w-4 h-4 mr-3" />
                                          {option.label}
                                    </div>
                              ))}
                        </div>
                  </div>
            </div>
      );
};

export default StyledSelect;