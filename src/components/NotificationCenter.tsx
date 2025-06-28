
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, AlertTriangle, Clock, Package, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Notification {
  id: string
  type: 'low-stock' | 'overdue' | 'received' | 'approval'
  title: string
  message: string
  timestamp: string
  isRead: boolean
  priority: 'high' | 'medium' | 'low'
}

export function NotificationCenter() {
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'low-stock',
      title: 'Low Stock Alert',
      message: 'Safety Helmets are running low (5 remaining, minimum: 15)',
      timestamp: '2 hours ago',
      isRead: false,
      priority: 'high'
    },
    {
      id: '2',
      type: 'overdue',
      title: 'Overdue Delivery',
      message: 'PO CH/PO/034 delivery is 3 days overdue from supplier TechCorp',
      timestamp: '1 day ago',
      isRead: false,
      priority: 'high'
    },
    {
      id: '3',
      type: 'approval',
      title: 'Approval Pending',
      message: 'Requisition CH/REQ/001 is pending approval from department head',
      timestamp: '4 hours ago',
      isRead: false,
      priority: 'medium'
    },
    {
      id: '4',
      type: 'received',
      title: 'Material Received',
      message: 'Paper rolls delivery completed successfully',
      timestamp: '1 day ago',
      isRead: true,
      priority: 'low'
    }
  ])

  const unreadCount = notifications.filter(n => !n.isRead).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'low-stock':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case 'overdue':
        return <Clock className="h-4 w-4 text-red-500" />
      case 'received':
        return <Package className="h-4 w-4 text-green-500" />
      case 'approval':
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  }

  useEffect(() => {
    // Check for overdue deliveries and low stock every minute
    const interval = setInterval(() => {
      // Simulate checking for new notifications
      console.log('Checking for new notifications...')
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Bell className="h-5 w-5 text-chhapai-gold" />
            Notifications
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">{unreadCount}</Badge>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button 
              onClick={markAllAsRead}
              size="sm" 
              variant="ghost" 
              className="text-chhapai-gold hover:text-chhapai-gold-dark"
            >
              Mark all as read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {notifications.map((notification) => (
          <div 
            key={notification.id}
            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
              notification.isRead 
                ? 'bg-gray-50 border-gray-200' 
                : 'bg-white border-chhapai-gold shadow-sm hover:bg-yellow-50'
            }`}
            onClick={() => markAsRead(notification.id)}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className={`text-sm font-medium ${
                    notification.isRead ? 'text-gray-700' : 'text-gray-900'
                  }`}>
                    {notification.title}
                  </p>
                  <Badge className={`text-xs ${getPriorityColor(notification.priority)}`}>
                    {notification.priority.toUpperCase()}
                  </Badge>
                </div>
                <p className={`text-sm ${
                  notification.isRead ? 'text-gray-500' : 'text-gray-700'
                }`}>
                  {notification.message}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {notification.timestamp}
                </p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
