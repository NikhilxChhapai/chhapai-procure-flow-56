
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Download, User, Calendar, MessageCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { generateFormPDF } from "@/utils/pdfGenerator"

interface OrderDetailsProps {
  order: any
  onClose: () => void
}

const defaultStages = [
  { name: "Design Approval", completed: false, assignedTo: "", notes: "", deadline: "" },
  { name: "Printing", completed: false, assignedTo: "", notes: "", deadline: "" },
  { name: "Lamination", completed: false, assignedTo: "", notes: "", deadline: "" },
  { name: "Finishing", completed: false, assignedTo: "", notes: "", deadline: "" },
  { name: "Packing", completed: false, assignedTo: "", notes: "", deadline: "" }
]

export function OrderDetails({ order, onClose }: OrderDetailsProps) {
  const { toast } = useToast()
  const [stages, setStages] = useState(defaultStages)
  const [newStage, setNewStage] = useState("")
  const [selectedInventory, setSelectedInventory] = useState("")

  const completedStages = stages.filter(stage => stage.completed).length
  const progressPercentage = (completedStages / stages.length) * 100

  const handleStageToggle = (index: number) => {
    setStages(prev => prev.map((stage, i) => 
      i === index ? { ...stage, completed: !stage.completed } : stage
    ))
    toast({
      title: "Stage Updated",
      description: `${stages[index].name} has been ${stages[index].completed ? 'reopened' : 'completed'}`,
    })
  }

  const handleAddStage = () => {
    if (newStage.trim()) {
      setStages(prev => [...prev, { 
        name: newStage, 
        completed: false, 
        assignedTo: "", 
        notes: "", 
        deadline: "" 
      }])
      setNewStage("")
    }
  }

  const generateDeliveryChallan = () => {
    if (completedStages === stages.length) {
      const challanData = {
        id: `CH/DC/${order.orderNo}`,
        customerName: order.customerName,
        orderNo: order.orderNo,
        productType: order.productType,
        quantity: order.quantity,
        totalAmount: order.totalAmount,
        deliveryDate: new Date().toISOString().split('T')[0]
      }
      generateFormPDF(challanData, 'Delivery Challan')
      toast({
        title: "Delivery Challan Generated",
        description: "PDF has been downloaded successfully.",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onClose}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{order.orderNo}</h2>
          <p className="text-gray-600">{order.customerName}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div><strong>Product:</strong> {order.productType}</div>
              <div><strong>Sub-Type:</strong> {order.subType}</div>
              <div><strong>Quantity:</strong> {order.quantity}</div>
              <div><strong>Priority:</strong> <Badge className={order.priority === 'Express' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}>{order.priority}</Badge></div>
              <div><strong>Total Amount:</strong> ₹{order.totalAmount.toLocaleString()}</div>
              <div><strong>Created:</strong> {order.dateOfOrder}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Order Progress
                <div className="text-sm text-gray-600">
                  {completedStages}/{stages.length} stages completed
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={progressPercentage} />
              
              <div className="space-y-3">
                {stages.map((stage, index) => (
                  <div key={index} className={`p-3 border rounded-lg ${stage.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={stage.completed}
                          onChange={() => handleStageToggle(index)}
                          className="rounded"
                        />
                        <span className={`font-medium ${stage.completed ? 'text-green-700' : ''}`}>
                          {stage.name}
                        </span>
                      </div>
                      {stage.completed && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          Completed
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>Assigned: {stage.assignedTo || 'Unassigned'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Deadline: {stage.deadline || 'Not set'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="Add new stage..."
                  value={newStage}
                  onChange={(e) => setNewStage(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md"
                />
                <Button onClick={handleAddStage}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select value={selectedInventory} onValueChange={setSelectedInventory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select inventory item" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paper">Paper A4 - 500 sheets</SelectItem>
                  <SelectItem value="ink">Printing Ink - Black</SelectItem>
                  <SelectItem value="lamination">Lamination Film</SelectItem>
                  <SelectItem value="box">Packaging Box</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full" variant="outline">
                Add to Order
              </Button>
              
              <div className="text-sm text-gray-600 mt-4">
                <h4 className="font-medium">Used Items:</h4>
                <ul className="mt-2 space-y-1">
                  <li>• Paper A4: 50 sheets</li>
                  <li>• Black Ink: 2 cartridges</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {completedStages === stages.length && (
                <Button 
                  onClick={generateDeliveryChallan}
                  className="w-full bg-chhapai-gold hover:bg-chhapai-gold-dark text-chhapai-black"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Generate Delivery Challan
                </Button>
              )}
              <Button variant="outline" className="w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
