
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { 
  Plus, 
  FileText, 
  ShoppingCart, 
  Package, 
  Receipt, 
  FileCheck,
  Truck,
  Download
} from "lucide-react"

const quickActions = [
  {
    title: "New Requisition",
    description: "Create a new requisition slip",
    icon: FileText,
    color: "bg-blue-500 hover:bg-blue-600",
    href: "/forms/requisition"
  },
  {
    title: "Purchase Order",
    description: "Generate purchase order",
    icon: ShoppingCart,
    color: "bg-green-500 hover:bg-green-600",
    href: "/forms/purchase-order"
  },
  {
    title: "Add Inventory",
    description: "Add new inventory item",
    icon: Package,
    color: "bg-purple-500 hover:bg-purple-600",
    href: "/inventory"
  },
  {
    title: "Material Received",
    description: "Record material receipt",
    icon: Truck,
    color: "bg-orange-500 hover:bg-orange-600",
    href: "/forms/material-received"
  },
  {
    title: "Quality Check",
    description: "Create quality check slip",
    icon: FileCheck,
    color: "bg-teal-500 hover:bg-teal-600",
    href: "/forms/quality-check"
  },
  {
    title: "Generate Report",
    description: "Download monthly reports",
    icon: Download,
    color: "bg-indigo-500 hover:bg-indigo-600",
    href: "/reports"
  }
]

export function QuickActions() {
  const navigate = useNavigate()

  const handleActionClick = (href: string) => {
    navigate(href)
  }

  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Plus className="h-5 w-5 text-chhapai-gold" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 flex items-start gap-3 hover:shadow-md transition-all duration-200 border-gray-200 hover:border-chhapai-gold"
              onClick={() => handleActionClick(action.href)}
            >
              <div className={`p-2 rounded-lg text-white ${action.color}`}>
                <action.icon className="h-4 w-4" />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-medium text-sm text-gray-900">{action.title}</h3>
                <p className="text-xs text-gray-600 mt-1">{action.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
