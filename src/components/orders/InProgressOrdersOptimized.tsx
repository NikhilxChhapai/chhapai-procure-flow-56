import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Search, CheckCircle, Play, Clock, ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { generateFormPDF } from "@/utils/pdfGenerator"

export function InProgressOrdersOptimized() {
  const [orders, setOrders] = useState<any[]>([])
  const [orderStages, setOrderStages] = useState<Record<string, any[]>>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchInProgressOrders()
  }, [])

  const fetchInProgressOrders = async () => {
    try {
      setLoading(true)
      
      // Fetch in-progress orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('status', 'in_progress')
        .order('created_at', { ascending: false })

      if (ordersError) throw ordersError

      // Fetch order stages for each order
      const orderIds = ordersData?.map(order => order.id) || []
      if (orderIds.length > 0) {
        const { data: stagesData, error: stagesError } = await supabase
          .from('order_stages')
          .select('*')
          .in('order_id', orderIds)
          .order('created_at', { ascending: true })

        if (stagesError) throw stagesError

        // Group stages by order ID
        const stagesByOrder: Record<string, any[]> = {}
        stagesData?.forEach(stage => {
          if (!stagesByOrder[stage.order_id]) {
            stagesByOrder[stage.order_id] = []
          }
          stagesByOrder[stage.order_id].push(stage)
        })
        
        setOrderStages(stagesByOrder)
      }

      setOrders(ordersData || [])
    } catch (error) {
      console.error('Error fetching in-progress orders:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch in-progress orders',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleStageComplete = async (orderId: string, stageId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed'
      const updateData: any = { 
        status: newStatus,
        updated_at: new Date().toISOString()
      }
      
      if (newStatus === 'completed') {
        updateData.end_time = new Date().toISOString()
      } else {
        updateData.end_time = null
        updateData.start_time = null
      }

      const { error } = await supabase
        .from('order_stages')
        .update(updateData)
        .eq('id', stageId)

      if (error) throw error

      // Refresh stages
      await fetchInProgressOrders()
      
      toast({
        title: "Stage Updated",
        description: `Stage ${newStatus === 'completed' ? 'completed' : 'reopened'} successfully`,
      })
    } catch (error) {
      console.error('Error updating stage:', error)
      toast({
        title: "Error",
        description: "Failed to update stage",
        variant: "destructive"
      })
    }
  }

  const completeOrder = async (order: any) => {
    try {
      // Check if all stages are completed
      const stages = orderStages[order.id] || []
      const allCompleted = stages.length > 0 && stages.every(stage => stage.status === 'completed')
      
      if (!allCompleted) {
        toast({
          title: "Cannot Complete Order",
          description: "All stages must be completed before finishing the order",
          variant: "destructive"
        })
        return
      }

      // Update order status to completed
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', order.id)

      if (error) throw error

      // Generate delivery challan PDF
      const challanData = {
        id: `CH/DC/${order.order_no}`,
        customerName: order.customer_name,
        orderNo: order.order_no,
        productName: order.product_name,
        quantity: order.quantity,
        totalAmount: order.order_total,
        deliveryDate: new Date().toISOString().split('T')[0]
      }
      
      generateFormPDF(challanData, 'Delivery Challan')

      toast({
        title: "Order Completed",
        description: `${order.order_no} has been completed successfully. Delivery challan generated.`,
      })

      // Refresh orders
      await fetchInProgressOrders()
    } catch (error) {
      console.error('Error completing order:', error)
      toast({
        title: "Error",
        description: "Failed to complete order",
        variant: "destructive"
      })
    }
  }

  const filteredOrders = orders.filter(order =>
    order.order_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getProgressPercentage = (stages: any[]) => {
    if (stages.length === 0) return 0
    const completedStages = stages.filter(stage => stage.status === 'completed').length
    return (completedStages / stages.length) * 100
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-10 bg-gray-200 rounded w-64 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-2 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search in-progress orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
        <Button 
          variant="outline"
          onClick={fetchInProgressOrders}
        >
          Refresh
        </Button>
      </div>

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No in-progress orders found</p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => {
            const stages = orderStages[order.id] || []
            const progressPercentage = getProgressPercentage(stages)
            const allCompleted = stages.length > 0 && stages.every(stage => stage.status === 'completed')
            
            return (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{order.order_no}</h3>
                      <Badge variant={order.priority === "express" ? "destructive" : "outline"}>
                        {order.priority === 'express' ? 'Express' : 'Normal'}
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
                    </div>
                    {allCompleted && (
                      <Button 
                        onClick={() => completeOrder(order)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Complete Order
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <strong>Customer:</strong> {order.customer_name}
                    </div>
                    <div>
                      <strong>Product:</strong> {order.product_name}
                    </div>
                    <div>
                      <strong>Quantity:</strong> {order.quantity}
                    </div>
                    <div>
                      <strong>Delivery:</strong> {order.delivery_date ? new Date(order.delivery_date).toLocaleDateString() : 'Not set'}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Progress: {Math.round(progressPercentage)}%</span>
                      <span className="text-xs text-gray-500">
                        {stages.filter(s => s.status === 'completed').length}/{stages.length} stages
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                    
                    {stages.length > 0 && (
                      <div className="grid gap-2">
                        {stages.map((stage) => (
                          <div 
                            key={stage.id} 
                            className={`flex items-center justify-between p-2 rounded border ${
                              stage.status === 'completed' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleStageComplete(order.id, stage.id, stage.status)}
                                className="h-6 w-6 p-0"
                              >
                                {stage.status === 'completed' ? (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                ) : (
                                  <Clock className="h-4 w-4 text-gray-400" />
                                )}
                              </Button>
                              <span className={`text-sm ${stage.status === 'completed' ? 'text-green-700 font-medium' : 'text-gray-600'}`}>
                                {stage.stage_name}
                              </span>
                            </div>
                            {stage.assigned_to && (
                              <span className="text-xs text-gray-500">
                                Assigned to: {stage.assigned_to}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}