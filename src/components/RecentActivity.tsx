
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
  MoreHorizontal
} from "lucide-react"

const activities = [
  {
    id: "CH/REQ/001",
    type: "Requisition Slip",
    description: "Office supplies requested by HR Department",
    status: "pending",
    timestamp: "2 hours ago",
    user: "Sarah Johnson",
    icon: FileText,
    priority: "medium"
  },
  {
    id: "CH/PO/034",
    type: "Purchase Order",
    description: "Laptop procurement for IT team",
    status: "approved",
    timestamp: "4 hours ago",
    user: "Mike Chen",
    icon: ShoppingCart,
    priority: "high"
  },
  {
    id: "CH/MR/012",
    type: "Material Received",
    description: "Paper rolls delivery completed",
    status: "completed",
    timestamp: "1 day ago",
    user: "Alex Kumar",
    icon: Package,
    priority: "low"
  },
  {
    id: "CH/QC/008",
    type: "Quality Check",
    description: "Printer cartridge quality verification",
    status: "in-progress",
    timestamp: "2 days ago",
    user: "Priya Sharma",
    icon: CheckCircle,
    priority: "medium"
  },
  {
    id: "CH/DC/019",
    type: "Delivery Challan",
    description: "Office furniture delivery to Branch-2",
    status: "shipped",
    timestamp: "3 days ago",
    user: "Raj Patel",
    icon: Package,
    priority: "high"
  }
]

const getStatusBadge = (status: string) => {
  const statusConfig = {
    pending: { variant: "secondary" as const, color: "bg-yellow-100 text-yellow-800" },
    approved: { variant: "default" as const, color: "bg-green-100 text-green-800" },
    completed: { variant: "default" as const, color: "bg-blue-100 text-blue-800" },
    "in-progress": { variant: "secondary" as const, color: "bg-purple-100 text-purple-800" },
    shipped: { variant: "secondary" as const, color: "bg-indigo-100 text-indigo-800" }
  }
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
  
  return (
    <Badge className={`${config.color} border-none text-xs`}>
      {status.replace('-', ' ').toUpperCase()}
    </Badge>
  )
}

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case "high":
      return <AlertCircle className="h-3 w-3 text-red-500" />
    case "medium":
      return <Clock className="h-3 w-3 text-yellow-500" />
    default:
      return <Clock className="h-3 w-3 text-gray-400" />
  }
}

export function RecentActivity() {
  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Recent Activity
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-chhapai-gold hover:text-chhapai-gold-dark">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => (
          <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="bg-gray-100 p-2 rounded-lg">
              <activity.icon className="h-4 w-4 text-gray-600" />
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
                <span>by {activity.user}</span>
                <span>{activity.timestamp}</span>
              </div>
            </div>
            
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
