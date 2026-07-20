import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from './Input';
import { useTranslation } from 'react-i18next';

export interface FilterBarProps {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  children?: React.ReactNode;
  filterContent?: React.ReactNode;
  activeFiltersCount?: number;
  onClearFilters?: () => void;
  className?: string;
  compact?: boolean;
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'חיפוש...',
  children,
  filterContent,
  activeFiltersCount = 0,
  onClearFilters,
  className = '',
  compact = false
}: FilterBarProps) {
  const { t } = useTranslation();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`flex gap-3 md:gap-4 items-center w-full ${compact ? 'flex-row' : 'flex-col md:flex-row bg-white p-3 md:p-4 rounded-xl border border-gray-200 shadow-sm'} ${className}`}>
      {onSearchChange !== undefined && (
        <div className={`relative ${children || filterContent ? (compact ? 'flex-1 md:flex-none w-full md:w-64' : 'w-full md:w-1/3 lg:w-1/4') : 'w-full md:max-w-md'}`}>
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder={searchPlaceholder === 'חיפוש...' ? t('filterBar.search') : searchPlaceholder}
            value={searchQuery || ''}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`w-full px-4 py-2 ${compact ? 'bg-white border-gray-200 focus:border-[#00857e]' : '!bg-gray-50'}`}
          />
        </div>
      )}
      
      {filterContent && (
        <div className="relative" ref={filterRef}>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-xl transition-colors font-medium h-full cursor-pointer ${
              activeFiltersCount > 0 
                ? 'bg-teal-50 border-teal-200 text-[#00857e]' 
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter size={18} />
            <span className="hidden sm:inline">{t('filterBar.filter')}</span>
          </button>

          {isFilterOpen && (
            <div className="absolute end-0 top-full mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <span className="font-bold text-gray-800">{t('filterBar.filter')}</span>
                {activeFiltersCount > 0 && onClearFilters && (
                  <button onClick={onClearFilters} className="text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer">
                    {t('filterBar.clearFilter')}
                  </button>
                )}
              </div>
              
              <div className="p-4 max-h-96 overflow-y-auto space-y-6 text-start">
                {filterContent}
              </div>
            </div>
          )}
        </div>
      )}

      {children && (
        <div className="flex flex-wrap md:flex-nowrap w-full md:flex-1 gap-3 md:gap-4 items-center">
          {children}
        </div>
      )}
    </div>
  );
}
