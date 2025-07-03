
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, ArrowRight, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { generateFormPDF } from "@/utils/pdfGenerator"
import { supabase } from "@/integrations/supabase/client"

export function PendingOrders() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [deliveryDate, setDeliveryDate] = useState("")
  const [selectedStages, setSelectedStages] = useState<string[]>([])
  const [pendingOrders, setPendingOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPendingOrders()
  }, [])

  const fetchPendingOrders = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPendingOrders(data || [])
    } catch (error) {
      console.error('Error fetching pending orders:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch pending orders',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const availableStages = [
    "Design Approval",
    "Printing",
    "Lamination", 
    "Finishing",
    "Quality Check",
    "Packaging"
  ]

  const filteredOrders = pendingOrders.filter(order =>
    order.order_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const moveToInProgress = async (order: any) => {
    if (!deliveryDate) {
      toast({
        title: "Missing Information",
        description: "Please set a delivery date before moving to In-Progress",
        variant: "destructive"
      })
      return
    }

    try {
      // Update order status to in_progress and set delivery date
      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
          status: 'in_progress',
          delivery_date: deliveryDate
        })
        .eq('id', order.id)

      if (updateError) throw updateError

      // Create order stages
      const stageInserts = selectedStages.map(stage => ({
        order_id: order.id,
        stage_name: stage,
        status: 'pending' as const
      }))

      if (stageInserts.length > 0) {
        const { error: stagesError } = await supabase
          .from('order_stages')
          .insert(stageInserts)

        if (stagesError) throw stagesError
      }

      // Generate Job Card PDF
      const jobCardData = {
        id: `JC-${order.order_no}`,
        orderNo: order.order_no,
        customerName: order.customer_name,
        productName: order.product_name,
        quantity: order.quantity,
        deliveryDate,
        stages: selectedStages,
        orderTotal: order.order_total
      }

      generateFormPDF(jobCardData, 'Job Card')
      
      toast({
        title: "Order Moved to In-Progress",
        description: `${order.order_no} is now in production. Job Card generated.`,
      })

      // Refresh the pending orders list
      await fetchPendingOrders()
      
      setSelectedOrder(null)
      setDeliveryDate("")
      setSelectedStages([])
    } catch (error) {
      console.error('Error moving order to production:', error)
      toast({
        title: "Error",
        description: "Failed to move order to production. Please try again.",
        variant: "destructive"
      })
    }
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

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No pending orders found</p>
                <Button 
                  className="mt-4 bg-chhapai-gold hover:bg-chhapai-gold-dark text-chhapai-black"
                  onClick={fetchPendingOrders}
                >
                  Refresh
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
          <Card key={order.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{order.order_no}</h3>
                    <Badge variant={order.source === "WooCommerce" ? "default" : "secondary"}>
                      {order.source || 'Manual'}
                    </Badge>
                    <Badge variant={order.priority === "express" ? "destructive" : "outline"}>
                      {order.priority === 'express' ? 'Express' : 'Normal'}
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
                    <strong>Customer:</strong> {order.customer_name}
                    {order.customer_contact && <div className="text-gray-600">{order.customer_contact}</div>}
                  </div>
                  <div>
                    <strong>Product:</strong> {order.product_name}
                    {order.sku && <div className="text-gray-600">SKU: {order.sku}</div>}
                  </div>
                  <div>
                    <strong>Quantity:</strong> {order.quantity}
                    {order.price_per_unit && <div className="text-gray-600">@ ₹{order.price_per_unit}</div>}
                  </div>
                  <div>
                    <strong>Total:</strong> ₹{order.order_total?.toLocaleString()}
                    <div className="text-gray-600">{new Date(order.created_at).toLocaleDateString()}</div>
                  </div>
                </div>

                {order.shipping_address && (
                  <div className="mt-3 text-sm">
                    <strong>Shipping:</strong> {order.shipping_address}
                  </div>
                )}

                {order.order_notes && (
                  <div className="mt-3 text-sm">
                    <strong>Notes:</strong> {order.order_notes}
                  </div>
                )}
            </CardContent>
          </Card>
            ))
          )}
        </div>
      )}

      {selectedOrder && (
        <Card className="border-chhapai-gold">
          <CardHeader>
            <CardTitle>Move {selectedOrder.order_no} to Production</CardTitle>
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
