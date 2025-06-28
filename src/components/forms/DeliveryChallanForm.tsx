
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Truck, Download, Save } from "lucide-react"
import { generateFormPDF } from "@/utils/pdfGenerator"
import { useToast } from "@/hooks/use-toast"

export function DeliveryChallanForm() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    id: `CH/DC/${String(Date.now()).slice(-6)}`,
    customerName: '',
    customerAddress: '',
    deliveryDate: new Date().toISOString().split('T')[0],
    vehicleNumber: '',
    driverName: '',
    items: '',
    quantity: '',
    receivedBy: '',
    remarks: '',
    status: 'In Transit'
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    toast({
      title: "Delivery Challan Saved",
      description: `Delivery Challan ${formData.id} has been saved successfully.`,
    })
  }

  const handleGeneratePDF = () => {
    generateFormPDF(formData, 'Delivery Challan')
    toast({
      title: "PDF Generated",
      description: `Delivery Challan ${formData.id} PDF has been downloaded.`,
    })
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-chhapai-gold to-chhapai-gold-dark text-chhapai-black">
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-6 w-6" />
          Delivery Challan - {formData.id}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="customerName">Customer Name</Label>
            <Input 
              id="customerName"
              value={formData.customerName}
              onChange={(e) => handleInputChange('customerName', e.target.value)}
              placeholder="Enter customer name"
            />
          </div>
          <div>
            <Label htmlFor="deliveryDate">Delivery Date</Label>
            <Input 
              id="deliveryDate"
              type="date"
              value={formData.deliveryDate}
              onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="vehicleNumber">Vehicle Number</Label>
            <Input 
              id="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
              placeholder="Enter vehicle number"
            />
          </div>
          <div>
            <Label htmlFor="driverName">Driver Name</Label>
            <Input 
              id="driverName"
              value={formData.driverName}
              onChange={(e) => handleInputChange('driverName', e.target.value)}
              placeholder="Enter driver name"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="customerAddress">Customer Address</Label>
          <Textarea 
            id="customerAddress"
            value={formData.customerAddress}
            onChange={(e) => handleInputChange('customerAddress', e.target.value)}
            placeholder="Enter complete delivery address"
            className="min-h-[80px]"
          />
        </div>

        <div>
          <Label htmlFor="items">Items Being Delivered</Label>
          <Textarea 
            id="items"
            value={formData.items}
            onChange={(e) => handleInputChange('items', e.target.value)}
            placeholder="List all items being delivered"
            className="min-h-[120px]"
          />
        </div>

        <div>
          <Label htmlFor="remarks">Remarks</Label>
          <Textarea 
            id="remarks"
            value={formData.remarks}
            onChange={(e) => handleInputChange('remarks', e.target.value)}
            placeholder="Any special instructions or remarks"
            className="min-h-[80px]"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={handleSave} className="bg-chhapai-gold hover:bg-chhapai-gold-dark text-chhapai-black">
            <Save className="h-4 w-4 mr-2" />
            Save Challan
          </Button>
          <Button onClick={handleGeneratePDF} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Generate PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
