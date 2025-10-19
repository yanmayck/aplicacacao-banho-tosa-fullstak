import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

interface SelectTriggerProps {
  className?: string;
  children: React.ReactNode;
}

interface SelectValueProps {
  placeholder?: string;
}

interface SelectContentProps {
  children: React.ReactNode;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Select: React.FC<SelectProps> = ({ value, onValueChange, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {React.Children.map(children, (child) =>
        React.cloneElement(child as React.ReactElement, {
          isOpen,
          setIsOpen,
          value,
          onValueChange,
        })
      )}
    </div>
  );
};

export const SelectTrigger: React.FC<SelectTriggerProps & { isOpen?: boolean; setIsOpen?: (open: boolean) => void }> = ({
  className = '',
  children,
  isOpen,
  setIsOpen,
}) => (
  <button
    type="button"
    className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    onClick={() => setIsOpen?.(!isOpen)}
  >
    {children}
    <ChevronDown className="h-4 w-4 opacity-50" />
  </button>
);

export const SelectValue: React.FC<SelectValueProps & { value?: string }> = ({
  placeholder = 'Selecione...',
  value,
}) => (
  <span className={value ? '' : 'text-muted-foreground'}>
    {value || placeholder}
  </span>
);

export const SelectContent: React.FC<SelectContentProps & { isOpen?: boolean }> = ({
  children,
  isOpen,
}) => (
  isOpen ? (
    <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-md border bg-popover text-popover-foreground shadow-md">
      <div className="p-1">
        {children}
      </div>
    </div>
  ) : null
);

export const SelectItem: React.FC<SelectItemProps & { onValueChange?: (value: string) => void }> = ({
  value,
  children,
  onValueChange,
}) => (
  <div
    className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
    onClick={() => onValueChange?.(value)}
  >
    {children}
  </div>
);
