
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, ArrowRight, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { generateFormPDF } from "@/utils/pdfGenerator"

const pendingOrders = [
  {
    id: 1,
    orderNo: "WC-12345",
    customerName: "John Doe",
    customerContact: "john@example.com",
    productName: "Premium Business Cards",
    sku: "BC-001",
    quantity: 500,
    pricePerUnit: 50,
    orderTotal: 25000,
    orderDate: "2024-01-15",
    shippingAddress: "123 Main St, Mumbai",
    orderNotes: "Urgent delivery required",
    source: "WooCommerce",
    priority: "Express"
  },
  {
    id: 2,
    orderNo: "CH-ORD-002",
    customerName: "ABC Corp",
    productName: "Invitation Box",
    quantity: 100,
    orderTotal: 15000,
    orderDate: "2024-01-14",
    source: "Manual",
    priority: "Normal"
  }
]

export function PendingOrders() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [deliveryDate, setDeliveryDate] = useState("")
  const [selectedStages, setSelectedStages] = useState<string[]>([])

  const availableStages = [
    "Design Approval",
    "Printing",
    "Lamination", 
    "Finishing",
    "Quality Check",
    "Packaging"
  ]

  const filteredOrders = pendingOrders.filter(order =>
    order.orderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const moveToInProgress = (order: any) => {
    if (!deliveryDate) {
      toast({
        title: "Missing Information",
        description: "Please set a delivery date before moving to In-Progress",
        variant: "destructive"
      })
      return
    }

    // Generate Job Card PDF
    const jobCardData = {
      id: `JC-${order.orderNo}`,
      orderNo: order.orderNo,
      customerName: order.customerName,
      productName: order.productName,
      quantity: order.quantity,
      deliveryDate,
      stages: selectedStages,
      orderTotal: order.orderTotal
    }

    generateFormPDF(jobCardData, 'Job Card')
    
    toast({
      title: "Order Moved to In-Progress",
      description: `${order.orderNo} is now in production. Job Card generated.`,
    })

    setSelectedOrder(null)
    setDeliveryDate("")
    setSelectedStages([])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search pending orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
        <Button className="bg-chhapai-gold hover:bg-chhapai-gold-dark text-chhapai-black">
          <Plus className="h-4 w-4 mr-2" />
          Add Manual Order
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-lg">{order.orderNo}</h3>
                  <Badge variant={order.source === "WooCommerce" ? "default" : "secondary"}>
                    {order.source}
                  </Badge>
                  <Badge variant={order.priority === "Express" ? "destructive" : "outline"}>
                    {order.priority}
                  </Badge>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedOrder(order)}
                >
                  <ArrowRight className="h-4 w-4 mr-1" />
                  Move to Production
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <strong>Customer:</strong> {order.customerName}
                  {order.customerContact && <div className="text-gray-600">{order.customerContact}</div>}
                </div>
                <div>
                  <strong>Product:</strong> {order.productName}
                  {order.sku && <div className="text-gray-600">SKU: {order.sku}</div>}
                </div>
                <div>
                  <strong>Quantity:</strong> {order.quantity}
                  {order.pricePerUnit && <div className="text-gray-600">@ ₹{order.pricePerUnit}</div>}
                </div>
                <div>
                  <strong>Total:</strong> ₹{order.orderTotal.toLocaleString()}
                  <div className="text-gray-600">{order.orderDate}</div>
                </div>
              </div>

              {order.shippingAddress && (
                <div className="mt-3 text-sm">
                  <strong>Shipping:</strong> {order.shippingAddress}
                </div>
              )}

              {order.orderNotes && (
                <div className="mt-3 text-sm">
                  <strong>Notes:</strong> {order.orderNotes}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedOrder && (
        <Card className="border-chhapai-gold">
          <CardHeader>
            <CardTitle>Move {selectedOrder.orderNo} to Production</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="deliveryDate">Expected Delivery Date *</Label>
              <Input 
                id="deliveryDate"
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
              />
            </div>

            <div>
              <Label>Production Stages</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {availableStages.map((stage) => (
                  <label key={stage} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedStages.includes(stage)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStages([...selectedStages, stage])
                        } else {
                          setSelectedStages(selectedStages.filter(s => s !== stage))
                        }
                      }}
                    />
                    <span className="text-sm">{stage}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={() => moveToInProgress(selectedOrder)}
                className="bg-chhapai-gold hover:bg-chhapai-gold-dark text-chhapai-black"
              >
                <Download className="h-4 w-4 mr-2" />
                Generate Job Card & Start Production
              </Button>
              <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
