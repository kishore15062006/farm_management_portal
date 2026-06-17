import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Bell, Clock, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const NotificationDropdown = () => {
  const { user } = useAuth();
  const { getNotificationsByUser, markAsRead, markAllAsRead, getUnreadCount } = useNotifications();
  if (!user) return null;
  const notifications = getNotificationsByUser(user.id, user.role);
  const unreadCount = getUnreadCount(user.id, user.role);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'withdrawal':
        return <Clock className="w-4 h-4 text-warning" />;
      case 'prescription_withdrawal':
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'approval':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'suggestion':
        return <AlertTriangle className="w-4 h-4 text-info" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };


  const getPriorityColor = (priority: string, read: boolean) => {
    if (read) return 'text-muted-foreground';
    switch (priority) {
      case 'critical':
      case 'high':
        return 'text-destructive';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-info';
      default:
        return '';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative p-2">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs" variant="destructive">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 opacity-100 bg-popover notification-dropdown-content">
        <div className="p-3 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            {notifications.length > 0 && (
              <Button size="sm" variant="ghost" className="text-xs" onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No notifications
          </div>
        ) : (
          <>
            {notifications.slice(0, 5).map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`p-3 cursor-pointer ${!notification.read ? 'bg-accent/50' : ''}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start space-x-3 w-full">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`text-sm font-medium ${getPriorityColor(notification.priority, notification.read)}`}>
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {notification.timestamp}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
            {notifications.length > 5 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center">
                  <Button variant="ghost" size="sm" className="w-full">
                    View all notifications
                  </Button>
                </DropdownMenuItem>
              </>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NotificationDropdown;