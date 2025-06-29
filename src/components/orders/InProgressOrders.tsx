
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Clock, User, AlertTriangle, CheckCircle, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface OrderStage {
  name: string
  status: "pending" | "in-progress" | "completed"
  assignedTo: string
  notes: string
  qualityRemarks: string
  wastage: number
  timeTaken: number
  estimatedTime: number
  attachments: string[]
  startTime?: Date
  endTime?: Date
}

const inProgressOrders = [
  {
    id: 1,
    orderNo: "WC-12345",
    customerName: "John Doe",
    productName: "Premium Business Cards",
    quantity: 500,
    orderTotal: 25000,
    deliveryDate: "2024-01-20",
    priority: "Express",
    stages: [
      { name: "Design Approval", status: "completed", assignedTo: "Designer A", notes: "Approved with minor changes", qualityRemarks: "Good", wastage: 0, timeTaken: 2, estimatedTime: 1.5, attachments: [] },
      { name: "Printing", status: "in-progress", assignedTo: "Printer B", notes: "In progress", qualityRemarks: "", wastage: 0, timeTaken: 0, estimatedTime: 4, attachments: [] },
      { name: "Lamination", status: "pending", assignedTo: "", notes: "", qualityRemarks: "", wastage: 0, timeTaken: 0, estimatedTime: 2, attachments: [] },
      { name: "Quality Check", status: "pending", assignedTo: "", notes: "", qualityRemarks: "", wastage: 0, timeTaken: 0, estimatedTime: 1, attachments: [] },
      { name: "Packaging", status: "pending", assignedTo: "", notes: "", qualityRemarks: "", wastage: 0, timeTaken: 0, estimatedTime: 1, attachments: [] }
    ] as OrderStage[]
  }
]

export function InProgressOrders() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [selectedStage, setSelectedStage] = useState<any>(null)

  const getStageProgress = (stages: OrderStage[]) => {
    const completed = stages.filter(s => s.status === "completed").length
    return (completed / stages.length) * 100
  }

  const getETD = (stages: OrderStage[]) => {
    const remainingTime = stages
      .filter(s => s.status !== "completed")
      .reduce((acc, stage) => acc + stage.estimatedTime, 0)
    
    const etd = new Date()
    etd.setHours(etd.getHours() + remainingTime)
    return etd.toLocaleDateString()
  }

  const updateStageStatus = (orderId: number, stageIndex: number, newStatus: string) => {
    toast({
      title: "Stage Updated",
      description: `Stage status changed to ${newStatus}`,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-gray-100 text-gray-800"
      case "in-progress": return "bg-blue-100 text-blue-800"
      case "completed": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search in-progress orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="express">Express</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="delayed">Delayed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6">
        {inProgressOrders.map((order) => (
          <Card key={order.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle>{order.orderNo}</CardTitle>
                  <Badge variant={order.priority === "Express" ? "destructive" : "outline"}>
                    {order.priority}
                  </Badge>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <div>ETD: {getETD(order.stages)}</div>
                  <div>Delivery: {order.deliveryDate}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div><strong>Customer:</strong> {order.customerName}</div>
                <div><strong>Product:</strong> {order.productName}</div>
                <div><strong>Quantity:</strong> {order.quantity}</div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-gray-600">
                    {order.stages.filter(s => s.status === "completed").length}/{order.stages.length} stages
                  </span>
                </div>
                <Progress value={getStageProgress(order.stages)} />
              </div>

              <div className="space-y-3">
                {order.stages.map((stage, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{stage.name}</span>
                        <Badge className={getStatusColor(stage.status)}>
                          {stage.status}
                        </Badge>
                        {stage.status === "in-progress" && (
                          <Clock className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedStage({ order, stage, stageIndex: index })}
                        >
                          Update
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {stage.assignedTo || "Unassigned"}
                      </div>
                      <div>Time: {stage.timeTaken}h / {stage.estimatedTime}h</div>
                      {stage.wastage > 0 && (
                        <div className="flex items-center gap-1 text-amber-600">
                          <AlertTriangle className="h-3 w-3" />
                          Wastage: {stage.wastage}%
                        </div>
                      )}
                      {stage.status === "completed" && (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-3 w-3" />
                          Completed
                        </div>
                      )}
                    </div>

                    {stage.notes && (
                      <div className="mt-2 text-xs bg-gray-50 p-2 rounded">
                        <strong>Notes:</strong> {stage.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedStage && (
        <Card className="border-chhapai-gold">
          <CardHeader>
            <CardTitle>Update Stage: {selectedStage.stage.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select defaultValue={selectedStage.stage.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Assigned To</label>
                <Input defaultValue={selectedStage.stage.assignedTo} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Quality Remarks</label>
                <Input defaultValue={selectedStage.stage.qualityRemarks} />
              </div>
              <div>
                <label className="text-sm font-medium">Wastage %</label>
                <Input type="number" defaultValue={selectedStage.stage.wastage} />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Notes</label>
              <Textarea defaultValue={selectedStage.stage.notes} />
            </div>

            <div>
              <label className="text-sm font-medium">Attach Files</label>
              <div className="flex gap-2">
                <Input type="file" multiple />
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button className="bg-chhapai-gold hover:bg-chhapai-gold-dark text-chhapai-black">
                Update Stage
              </Button>
              <Button variant="outline" onClick={() => setSelectedStage(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
