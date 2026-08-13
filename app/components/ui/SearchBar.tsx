import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface SearchBarProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, event?: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'minimal';
  loading?: boolean;
  showClearButton?: boolean;
  debounceMs?: number;
  containerClassName?: string;
}

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      value: controlledValue,
      defaultValue = '',
      onChange,
      onSearch,
      onClear,
      placeholder,
      size = 'md',
      variant = 'default',
      loading = false,
      showClearButton = true,
      debounceMs = 0,
      containerClassName = '',
      className = '',
      disabled = false,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const { t, i18n } = useTranslation();
    const isEn = i18n.language?.startsWith('en');
    const [internalValue, setInternalValue] = useState(
      controlledValue !== undefined ? controlledValue : defaultValue
    );

    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : internalValue;

    // Sync controlled value
    useEffect(() => {
      if (isControlled) {
        setInternalValue(controlledValue);
      }
    }, [controlledValue, isControlled]);

    // Optional Debounce support
    const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => {
      if (debounceMs > 0 && onSearch) {
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }
        debounceTimeoutRef.current = setTimeout(() => {
          onSearch(currentValue);
        }, debounceMs);
      }
      return () => {
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }
      };
    }, [currentValue, debounceMs, onSearch]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue, e);
      if (debounceMs === 0) {
        onSearch?.(newValue);
      }
    };

    const handleClear = () => {
      if (disabled) return;
      if (!isControlled) {
        setInternalValue('');
      }
      onChange?.('');
      onSearch?.('');
      onClear?.();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape' && currentValue) {
        e.preventDefault();
        handleClear();
      } else if (e.key === 'Enter') {
        onSearch?.(currentValue);
      }
      onKeyDown?.(e);
    };

    // Size variants
    const sizeConfig = {
      sm: {
        container: 'h-9 text-xs',
        inputPadding: isEn ? 'pl-8 pr-7' : 'pr-8 pl-7',
        iconSize: 14,
        iconOffset: isEn ? 'left-2.5' : 'right-2.5',
        clearOffset: isEn ? 'right-2' : 'left-2',
      },
      md: {
        container: 'h-10 text-sm',
        inputPadding: isEn ? 'pl-9 pr-8' : 'pr-9 pl-8',
        iconSize: 16,
        iconOffset: isEn ? 'left-3' : 'right-3',
        clearOffset: isEn ? 'right-2.5' : 'left-2.5',
      },
      lg: {
        container: 'h-12 text-base',
        inputPadding: isEn ? 'pl-11 pr-10' : 'pr-11 pl-10',
        iconSize: 20,
        iconOffset: isEn ? 'left-3.5' : 'right-3.5',
        clearOffset: isEn ? 'right-3' : 'left-3',
      },
    }[size];

    // Background & border variants
    const variantClasses = {
      default:
        'bg-white dark:bg-[#17211f] border-gray-200 dark:border-[#263330] text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-[#00857e] focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/50',
      filled:
        'bg-gray-50 dark:bg-[#131d1b] border-gray-200 dark:border-[#263330] text-gray-900 dark:text-white placeholder:text-gray-400 focus:bg-white dark:focus:bg-[#17211f] focus:border-[#00857e] focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/50',
      minimal:
        'bg-transparent border-transparent text-gray-900 dark:text-white placeholder:text-gray-400 focus:bg-white dark:focus:bg-[#17211f] focus:border-gray-200 dark:focus:border-[#263330]',
    }[variant];

    return (
      <div className={`relative flex items-center w-full ${containerClassName}`}>
        {/* Leading Search / Loading Icon */}
        <div
          className={`absolute ${sizeConfig.iconOffset} pointer-events-none text-gray-400 dark:text-gray-500 flex items-center justify-center`}
        >
          {loading ? (
            <Loader2 size={sizeConfig.iconSize} className="animate-spin text-[#00857e]" />
          ) : (
            <Search size={sizeConfig.iconSize} />
          )}
        </div>

        {/* Search Input Field */}
        <input
          ref={ref}
          type="text"
          value={currentValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || (t('filterBar.search') || 'חיפוש...')}
          disabled={disabled}
          className={`w-full ${sizeConfig.container} ${sizeConfig.inputPadding} rounded-xl border font-medium transition-all outline-none ${variantClasses} ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          } ${className}`}
          {...props}
        />

        {/* Trailing Clear Button */}
        {showClearButton && currentValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className={`absolute ${sizeConfig.clearOffset} p-1 text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer`}
            aria-label="Clear search"
          >
            <X size={sizeConfig.iconSize} />
          </button>
        )}
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';
