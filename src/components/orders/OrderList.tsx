
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, Edit, Truck } from "lucide-react"
import { OrderDetails } from "./OrderDetails"

const sampleOrders = [
  {
    id: 1,
    orderNo: "CH-ORD-001",
    customerName: "ABC Corporation",
    productType: "Business Card",
    subType: "Metal Cards",
    priority: "Express",
    quantity: 500,
    totalAmount: 25000,
    status: "Pending",
    dateOfOrder: "2024-01-15",
    createdBy: "Admin"
  },
  {
    id: 2,
    orderNo: "CH-ORD-002",
    customerName: "XYZ Events",
    productType: "Invitation Box",
    subType: "Gold Box",
    priority: "Normal",
    quantity: 100,
    totalAmount: 15000,
    status: "In-Progress",
    dateOfOrder: "2024-01-14",
    createdBy: "Designer"
  },
  {
    id: 3,
    orderNo: "CH-ORD-003",
    customerName: "Tech Solutions",
    productType: "Brochure",
    subType: "Tri-fold",
    priority: "Normal",
    quantity: 1000,
    totalAmount: 8000,
    status: "Completed",
    dateOfOrder: "2024-01-12",
    createdBy: "Manager"
  }
]

export function OrderList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  const filteredOrders = sampleOrders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.orderNo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-amber-100 text-amber-800"
      case "In-Progress": return "bg-blue-100 text-blue-800"
      case "Completed": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    return priority === "Express" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
  }

  if (selectedOrder) {
    return (
      <OrderDetails 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)}
      />
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Order List</span>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In-Progress">In-Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{order.orderNo}</h3>
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    <Badge className={getPriorityColor(order.priority)}>{order.priority}</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div><strong>Customer:</strong> {order.customerName}</div>
                    <div><strong>Product:</strong> {order.productType}</div>
                    <div><strong>Quantity:</strong> {order.quantity}</div>
                    <div><strong>Amount:</strong> ₹{order.totalAmount.toLocaleString()}</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Created: {order.dateOfOrder} by {order.createdBy}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  {order.status === "Completed" && (
                    <Button variant="outline" size="sm">
                      <Truck className="h-4 w-4 mr-1" />
                      Delivery
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
