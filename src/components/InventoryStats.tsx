
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, AlertTriangle, TrendingUp, DollarSign } from "lucide-react"

export function InventoryStats() {
  const stats = [
    {
      title: "Total Items",
      value: "1,247",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Low Stock Alerts",
      value: "23",
      icon: AlertTriangle,
      color: "text-amber-600",
      bgColor: "bg-amber-100"
    },
    {
      title: "Items Added This Month",
      value: "156",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Total Inventory Value",
      value: "₹12,45,678",
      icon: DollarSign,
      color: "text-chhapai-gold",
      bgColor: "bg-yellow-100"
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
