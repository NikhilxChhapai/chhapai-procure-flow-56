
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardList, Clock, CheckCircle, TrendingUp, DollarSign, AlertTriangle } from "lucide-react"

export function OrderStats() {
  const stats = [
    {
      title: "Total Orders",
      value: "156",
      change: "+12 this month",
      icon: ClipboardList,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Pending Orders",
      value: "23",
      change: "Needs attention",
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-100"
    },
    {
      title: "In Progress",
      value: "34",
      change: "Active production",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Completed",
      value: "99",
      change: "+8 today",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Monthly Revenue",
      value: "₹2,45,678",
      change: "+15.2%",
      icon: DollarSign,
      color: "text-chhapai-gold",
      bgColor: "bg-yellow-100"
    },
    {
      title: "Express Orders",
      value: "12",
      change: "High priority",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-100"
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
            <div className="text-xs text-gray-500 mt-1">{stat.change}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
