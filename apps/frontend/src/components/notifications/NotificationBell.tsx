import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { NotificationCenter } from './NotificationCenter';
import { useNotifications } from '../../hooks/useNotifications';

interface NotificationBellProps {
  className?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount, hasUnread } = useNotifications();

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className={`relative ${className}`}
        onClick={() => setIsOpen(true)}
      >
        <Bell className="h-5 w-5" />
        {hasUnread && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      <NotificationCenter
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};