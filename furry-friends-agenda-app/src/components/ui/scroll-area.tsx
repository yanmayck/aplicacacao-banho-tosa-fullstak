import React from 'react';

interface ScrollAreaProps {
  className?: string;
  children: React.ReactNode;
}

interface ScrollBarProps {
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

export const ScrollArea: React.FC<ScrollAreaProps> = ({ className = '', children }) => (
  <div className={`overflow-auto ${className}`}>
    {children}
  </div>
);

export const ScrollBar: React.FC<ScrollBarProps> = ({
  orientation = 'vertical',
  className = ''
}) => (
  <div
    className={`bg-gray-300 hover:bg-gray-400 transition-colors ${
      orientation === 'vertical' ? 'w-2' : 'h-2'
    } ${className}`}
    style={{
      [orientation === 'vertical' ? 'height' : 'width']: '100%'
    }}
  />
);
