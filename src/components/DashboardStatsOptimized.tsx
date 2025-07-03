import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  ShoppingCart, 
  FileText, 
  AlertTriangle,
  DollarSign,
  Users
} from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface DashboardData {
  totalOrders: number
  pendingOrders: number
  inProgressOrders: number
  completedOrders: number
  lowStockItems: number
  inventoryValue: number
  activeUsers: number
  totalInventoryItems: number
}

export function DashboardStatsOptimized() {
  const [data, setData] = useState<DashboardData>({
    totalOrders: 0,
    pendingOrders: 0,
    inProgressOrders: 0,
    completedOrders: 0,
    lowStockItems: 0,
    inventoryValue: 0,
    activeUsers: 0,
    totalInventoryItems: 0
  })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch orders data
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('status, order_total')
      
      if (ordersError) throw ordersError

      // Fetch inventory data
      const { data: inventory, error: inventoryError } = await supabase
        .from('inventory')
        .select('current_stock, minimum_stock, unit_price')
      
      if (inventoryError) throw inventoryError

      // Fetch active users
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('is_active')
        .eq('is_active', true)
      
      if (usersError) throw usersError

      // Process data
      const totalOrders = orders?.length || 0
      const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0
      const inProgressOrders = orders?.filter(o => o.status === 'in_progress').length || 0
      const completedOrders = orders?.filter(o => o.status === 'completed').length || 0
      
      const lowStockItems = inventory?.filter(item => 
        item.current_stock <= (item.minimum_stock || 10)
      ).length || 0
      
      const inventoryValue = inventory?.reduce((sum, item) => 
        sum + (item.current_stock * (item.unit_price || 0)), 0
      ) || 0

      const activeUsers = users?.length || 0
      const totalInventoryItems = inventory?.length || 0

      setData({
        totalOrders,
        pendingOrders,
        inProgressOrders,
        completedOrders,
        lowStockItems,
        inventoryValue,
        activeUsers,
        totalInventoryItems
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    {
      title: "Total Orders",
      value: loading ? "..." : data.totalOrders.toString(),
      change: `${data.pendingOrders} pending`,
      trend: data.pendingOrders > 0 ? "up" : "neutral",
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Inventory Value",
      value: loading ? "..." : `₹${data.inventoryValue.toLocaleString()}`,
      change: `${data.totalInventoryItems} items`,
      trend: "neutral",
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Low Stock Alert",
      value: loading ? "..." : data.lowStockItems.toString(),
      change: "Items need restocking",
      trend: data.lowStockItems > 0 ? "alert" : "neutral",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Active Users",
      value: loading ? "..." : data.activeUsers.toString(),
      change: "Team members online",
      trend: "neutral",
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      title: "In Progress",
      value: loading ? "..." : data.inProgressOrders.toString(),
      change: "Orders being processed",
      trend: data.inProgressOrders > 0 ? "up" : "neutral",
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Completed Today",
      value: loading ? "..." : data.completedOrders.toString(),
      change: "Successfully finished",
      trend: data.completedOrders > 0 ? "up" : "neutral",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    }
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden transition-all duration-200 hover:shadow-lg border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`${stat.bgColor} p-2 rounded-lg`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {stat.trend === "up" && <TrendingUp className="h-3 w-3 text-green-500" />}
                  {stat.trend === "down" && <TrendingDown className="h-3 w-3 text-red-500" />}
                  {stat.trend === "alert" && <AlertTriangle className="h-3 w-3 text-red-500" />}
                  <span className={`text-xs ${
                    stat.trend === "up" ? "text-green-600" : 
                    stat.trend === "down" ? "text-red-600" : 
                    stat.trend === "alert" ? "text-red-600" : 
                    "text-gray-500"
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              {stat.trend === "alert" && (
                <Badge variant="destructive" className="text-xs">
                  Alert
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}