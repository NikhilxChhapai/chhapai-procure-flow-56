import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  FileText, 
  Package, 
  ShoppingCart, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  MoreHorizontal,
  Truck
} from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface Activity {
  id: string
  type: string
  description: string
  status: string
  created_at: string
  created_by?: string
  priority: string
  order_no?: string
  customer_name?: string
}

export function RecentActivityOptimized() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchRecentActivity()
  }, [])

  const fetchRecentActivity = async () => {
    try {
      setLoading(true)
      
      // Fetch recent orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id, order_no, customer_name, product_name, status, priority, created_at, created_by')
        .order('created_at', { ascending: false })
        .limit(10)
      
      if (ordersError) throw ordersError

      // Transform orders to activities
      const orderActivities: Activity[] = orders?.map(order => ({
        id: order.order_no,
        type: "Order",
        description: `${order.product_name} for ${order.customer_name}`,
        status: order.status || 'pending',
        created_at: order.created_at || new Date().toISOString(),
        created_by: order.created_by || 'System',
        priority: order.priority || 'normal',
        order_no: order.order_no,
        customer_name: order.customer_name
      })) || []

      setActivities(orderActivities)
    } catch (error) {
      console.error('Error fetching recent activity:', error)
      toast({
        title: 'Error',
        description: 'Failed to load recent activity',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'order':
        return ShoppingCart
      case 'requisition':
        return FileText
      case 'inventory':
        return Package
      case 'quality':
        return CheckCircle
      case 'delivery':
        return Truck
      default:
        return FileText
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800" },
      in_progress: { color: "bg-blue-100 text-blue-800" },
      completed: { color: "bg-green-100 text-green-800" },
      cancelled: { color: "bg-red-100 text-red-800" }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    
    return (
      <Badge className={`${config.color} border-none text-xs`}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    )
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "express":
        return <AlertCircle className="h-3 w-3 text-red-500" />
      case "normal":
        return <Clock className="h-3 w-3 text-green-500" />
      default:
        return <Clock className="h-3 w-3 text-gray-400" />
    }
  }

  const formatTime = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours} hours ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} days ago`
  }

  if (loading) {
    return (
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse flex space-x-4">
                <div className="rounded-lg bg-gray-200 h-10 w-10"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Recent Activity
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-chhapai-gold hover:text-chhapai-gold-dark"
            onClick={fetchRecentActivity}
          >
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No recent activity found
          </div>
        ) : (
          activities.map((activity, index) => {
            const IconComponent = getActivityIcon(activity.type)
            return (
              <div key={`${activity.id}-${index}`} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <IconComponent className="h-4 w-4 text-gray-600" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-chhapai-gold">{activity.id}</span>
                    {getPriorityIcon(activity.priority)}
                    {getStatusBadge(activity.status)}
                  </div>
                  
                  <p className="text-sm text-gray-900 font-medium mb-1">
                    {activity.type}
                  </p>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    {activity.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>by {activity.created_by || 'System'}</span>
                    <span>{formatTime(activity.created_at)}</span>
                  </div>
                </div>
                
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}