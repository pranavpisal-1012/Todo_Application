import { Bell } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useTodo } from "@/context/todo-context"
import { formatDistanceToNow } from "date-fns"

export function NotificationsPopover() {
  const { state, dispatch } = useTodo()

  const unreadCount = state.notifications.filter(n => !n.read).length

  return (
    <Popover 
      open={state.showNotifications} 
      onOpenChange={() => dispatch({ type: 'TOGGLE_NOTIFICATIONS' })}
    >
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium">Notifications</h4>
          {state.notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch({ type: 'CLEAR_NOTIFICATIONS' })}
            >
              Clear all
            </Button>
          )}
        </div>
        <div className="space-y-2">
          {state.notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No notifications
            </p>
          ) : (
            state.notifications.map(notification => (
              <div
                key={notification.id}
                className="flex items-start gap-4 p-2 rounded-lg hover:bg-accent"
                onClick={() => dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notification.id })}
              >
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {notification.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                )}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

