import React, { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';

interface VirtualizedListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export function VirtualizedList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  className = ""
}: VirtualizedListProps<T>) {
  const itemKey = useMemo(() => {
    return (index: number) => `item-${index}`;
  }, []);

  if (items.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <p className="text-gray-500">Nenhum item encontrado</p>
      </div>
    );
  }

  return (
    <List
      height={height}
      itemCount={items.length}
      itemSize={itemHeight}
      itemKey={itemKey}
      className={className}
    >
      {({ index, style }: { index: number; style: React.CSSProperties }) => {
        const item = items[index];
        if (!item) return null;

        return (
          <div style={style}>
            {renderItem(item, index)}
          </div>
        );
      }}
    </List>
  );
}