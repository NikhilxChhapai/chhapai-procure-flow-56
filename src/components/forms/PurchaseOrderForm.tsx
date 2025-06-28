
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ShoppingCart, Download, Save } from "lucide-react"
import { generateFormPDF } from "@/utils/pdfGenerator"
import { useToast } from "@/hooks/use-toast"

export function PurchaseOrderForm() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    id: `CH/PO/${String(Date.now()).slice(-6)}`,
    vendor: '',
    vendorAddress: '',
    orderDate: new Date().toISOString().split('T')[0],
    deliveryDate: '',
    items: '',
    quantity: '',
    unitPrice: '',
    totalAmount: '',
    terms: '',
    status: 'Draft'
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    toast({
      title: "Purchase Order Saved",
      description: `Purchase Order ${formData.id} has been saved successfully.`,
    })
  }

  const handleGeneratePDF = () => {
    generateFormPDF(formData, 'Purchase Order')
    toast({
      title: "PDF Generated",
      description: `Purchase Order ${formData.id} PDF has been downloaded.`,
    })
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-chhapai-gold to-chhapai-gold-dark text-chhapai-black">
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-6 w-6" />
          Purchase Order - {formData.id}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="vendor">Vendor Name</Label>
            <Input 
              id="vendor"
              value={formData.vendor}
              onChange={(e) => handleInputChange('vendor', e.target.value)}
              placeholder="Enter vendor name"
            />
          </div>
          <div>
            <Label htmlFor="orderDate">Order Date</Label>
            <Input 
              id="orderDate"
              type="date"
              value={formData.orderDate}
              onChange={(e) => handleInputChange('orderDate', e.target.value)}
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
            <Label htmlFor="totalAmount">Total Amount</Label>
            <Input 
              id="totalAmount"
              value={formData.totalAmount}
              onChange={(e) => handleInputChange('totalAmount', e.target.value)}
              placeholder="Enter total amount"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="vendorAddress">Vendor Address</Label>
          <Textarea 
            id="vendorAddress"
            value={formData.vendorAddress}
            onChange={(e) => handleInputChange('vendorAddress', e.target.value)}
            placeholder="Enter complete vendor address"
            className="min-h-[80px]"
          />
        </div>

        <div>
          <Label htmlFor="items">Items & Description</Label>
          <Textarea 
            id="items"
            value={formData.items}
            onChange={(e) => handleInputChange('items', e.target.value)}
            placeholder="List all items with descriptions"
            className="min-h-[120px]"
          />
        </div>

        <div>
          <Label htmlFor="terms">Terms & Conditions</Label>
          <Textarea 
            id="terms"
            value={formData.terms}
            onChange={(e) => handleInputChange('terms', e.target.value)}
            placeholder="Enter terms and conditions"
            className="min-h-[100px]"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={handleSave} className="bg-chhapai-gold hover:bg-chhapai-gold-dark text-chhapai-black">
            <Save className="h-4 w-4 mr-2" />
            Save Purchase Order
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
