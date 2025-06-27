
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

const stats = [
  {
    title: "Total Inventory Value",
    value: "₹2,45,678",
    change: "+12.5%",
    trend: "up",
    icon: Package,
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    title: "Pending Purchase Orders",
    value: "23",
    change: "-5 from yesterday",
    trend: "down",
    icon: ShoppingCart,
    color: "text-amber-600",
    bgColor: "bg-amber-50"
  },
  {
    title: "Monthly Procurement",
    value: "₹1,84,500",
    change: "+8.2%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    title: "Active Requisitions",
    value: "18",
    change: "+3 today",
    trend: "up",
    icon: FileText,
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    title: "Low Stock Items",
    value: "12",
    change: "Needs attention",
    trend: "alert",
    icon: AlertTriangle,
    color: "text-red-600",
    bgColor: "bg-red-50"
  },
  {
    title: "Active Users",
    value: "47",
    change: "5 departments",
    trend: "neutral",
    icon: Users,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50"
  }
]

export function DashboardStats() {
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
