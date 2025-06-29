
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, DollarSign, Truck, Receipt } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { generateFormPDF } from "@/utils/pdfGenerator"

const completedOrders = [
  {
    id: 1,
    orderNo: "CH-ORD-001",
    customerName: "ABC Corporation",
    productName: "Business Cards",
    quantity: 500,
    orderTotal: 25000,
    completedDate: "2024-01-18",
    deliveryStatus: "Fully Delivered",
    paymentReceived: 25000,
    balancePayment: 0,
    balanceQuantity: 0,
    timeTaken: 4.5,
    estimatedTime: 5
  },
  {
    id: 2,
    orderNo: "WC-12340",
    customerName: "XYZ Events",
    productName: "Invitation Boxes",
    quantity: 100,
    orderTotal: 15000,
    completedDate: "2024-01-17",
    deliveryStatus: "Partially Delivered",
    paymentReceived: 10000,
    balancePayment: 5000,
    balanceQuantity: 20,
    timeTaken: 3.2,
    estimatedTime: 3
  }
]

export function CompletedOrders() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [paymentAmount, setPaymentAmount] = useState("")

  const filteredOrders = completedOrders.filter(order => {
    const matchesSearch = order.orderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filterBy === "all") return matchesSearch
    if (filterBy === "fully-delivered") return matchesSearch && order.deliveryStatus === "Fully Delivered"
    if (filterBy === "partially-delivered") return matchesSearch && order.deliveryStatus === "Partially Delivered"
    if (filterBy === "payment-pending") return matchesSearch && order.balancePayment > 0
    
    return matchesSearch
  })

  const generateDeliveryChallan = (order: any) => {
    const challanData = {
      id: `DC-${order.orderNo}`,
      orderNo: order.orderNo,
      customerName: order.customerName,
      productName: order.productName,
      quantity: order.quantity,
      deliveryDate: new Date().toISOString().split('T')[0],
      orderTotal: order.orderTotal
    }

    generateFormPDF(challanData, 'Delivery Challan')
    
    toast({
      title: "Delivery Challan Generated",
      description: `Challan for ${order.orderNo} has been generated`,
    })
  }

  const recordPayment = (order: any) => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid payment amount",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Payment Recorded",
      description: `₹${paymentAmount} payment recorded for ${order.orderNo}`,
    })

    setSelectedOrder(null)
    setPaymentAmount("")
  }

  const getDeliveryStatusColor = (status: string) => {
    return status === "Fully Delivered" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
  }

  const getTimingColor = (taken: number, estimated: number) => {
    if (taken <= estimated) return "text-green-600"
    if (taken <= estimated * 1.2) return "text-amber-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search completed orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="fully-delivered">Fully Delivered</SelectItem>
              <SelectItem value="partially-delivered">Partially Delivered</SelectItem>
              <SelectItem value="payment-pending">Payment Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-lg">{order.orderNo}</h3>
                  <Badge className={getDeliveryStatusColor(order.deliveryStatus)}>
                    {order.deliveryStatus}
                  </Badge>
                  {order.balancePayment > 0 && (
                    <Badge variant="destructive">Payment Pending</Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => generateDeliveryChallan(order)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Delivery Challan
                  </Button>
                  {order.balancePayment > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <DollarSign className="h-4 w-4 mr-1" />
                      Record Payment
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <strong>Customer:</strong> {order.customerName}
                </div>
                <div>
                  <strong>Product:</strong> {order.productName}
                </div>
                <div>
                  <strong>Quantity:</strong> {order.quantity}
                  {order.balanceQuantity > 0 && (
                    <div className="text-amber-600">Pending: {order.balanceQuantity}</div>
                  )}
                </div>
                <div>
                  <strong>Total:</strong> ₹{order.orderTotal.toLocaleString()}
                  {order.balancePayment > 0 && (
                    <div className="text-red-600">Balance: ₹{order.balancePayment.toLocaleString()}</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <strong>Completed:</strong> {order.completedDate}
                </div>
                <div>
                  <strong>Payment:</strong> ₹{order.paymentReceived.toLocaleString()}
                </div>
                <div className={getTimingColor(order.timeTaken, order.estimatedTime)}>
                  <strong>Time:</strong> {order.timeTaken}h / {order.estimatedTime}h
                </div>
                <div>
                  <strong>Efficiency:</strong> {Math.round((order.estimatedTime / order.timeTaken) * 100)}%
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedOrder && (
        <Card className="border-chhapai-gold">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Record Payment - {selectedOrder.orderNo}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Order Total</label>
                <Input value={`₹${selectedOrder.orderTotal.toLocaleString()}`} readOnly />
              </div>
              <div>
                <label className="text-sm font-medium">Already Paid</label>
                <Input value={`₹${selectedOrder.paymentReceived.toLocaleString()}`} readOnly />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Balance Amount</label>
                <Input value={`₹${selectedOrder.balancePayment.toLocaleString()}`} readOnly />
              </div>
              <div>
                <label className="text-sm font-medium">Payment Amount *</label>
                <Input 
                  type="number"
                  placeholder="Enter payment amount"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={() => recordPayment(selectedOrder)}
                className="bg-chhapai-gold hover:bg-chhapai-gold-dark text-chhapai-black"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Record Payment
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
