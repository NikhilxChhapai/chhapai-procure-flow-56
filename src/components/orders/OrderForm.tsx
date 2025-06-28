
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClipboardList, Save, X, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface OrderFormProps {
  onClose: () => void
  onOrderCreated: () => void
}

const productTypes = [
  "Business Card",
  "Invitation Box",
  "Brochure",
  "Packaging",
  "Stationery",
  "Custom Print"
]

const subTypes = {
  "Business Card": ["Standard Cards", "Metal Cards", "Transparent Cards", "Textured Cards"],
  "Invitation Box": ["Gold Box", "Silver Box", "Custom Box", "Premium Box"],
  "Brochure": ["Bi-fold", "Tri-fold", "Multi-page", "Booklet"],
  "Packaging": ["Custom Box", "Bag", "Envelope", "Wrapper"],
  "Stationery": ["Letterhead", "Envelope", "Notepad", "Invoice Book"],
  "Custom Print": ["Poster", "Banner", "Sticker", "Label"]
}

export function OrderForm({ onClose, onOrderCreated }: OrderFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    orderNo: `CH-ORD-${String(Date.now()).slice(-6)}`,
    customerName: '',
    productType: '',
    subType: '',
    priority: '',
    quantity: 0,
    pricePerPiece: 0,
    totalAmount: 0,
    internalNotes: '',
    createdBy: 'Current User',
    dateOfOrder: new Date().toISOString().split('T')[0]
  })

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value }
      
      // Auto-calculate total amount
      if (field === 'quantity' || field === 'pricePerPiece') {
        updated.totalAmount = updated.quantity * updated.pricePerPiece
      }
      
      return updated
    })
  }

  const handleProductTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      productType: value,
      subType: '' // Reset sub-type when product type changes
    }))
  }

  const handleSave = () => {
    if (!formData.customerName || !formData.productType || !formData.priority) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    // Save order logic here
    toast({
      title: "Order Created",
      description: `Order ${formData.orderNo} has been created successfully.`,
    })
    onOrderCreated()
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-chhapai-gold to-chhapai-gold-dark text-chhapai-black">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-6 w-6" />
            Create New Order - {formData.orderNo}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="customerName">Customer Name *</Label>
            <Input 
              id="customerName"
              value={formData.customerName}
              onChange={(e) => handleInputChange('customerName', e.target.value)}
              placeholder="Enter customer name"
            />
          </div>
          <div>
            <Label htmlFor="dateOfOrder">Date of Order</Label>
            <Input 
              id="dateOfOrder"
              type="date"
              value={formData.dateOfOrder}
              onChange={(e) => handleInputChange('dateOfOrder', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="productType">Product Type *</Label>
            <Select value={formData.productType} onValueChange={handleProductTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select product type" />
              </SelectTrigger>
              <SelectContent>
                {productTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="subType">Sub-Type</Label>
            <Select 
              value={formData.subType} 
              onValueChange={(value) => handleInputChange('subType', value)}
              disabled={!formData.productType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sub-type" />
              </SelectTrigger>
              <SelectContent>
                {formData.productType && subTypes[formData.productType as keyof typeof subTypes]?.map((subType) => (
                  <SelectItem key={subType} value={subType}>{subType}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="priority">Priority *</Label>
            <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Express">Express</SelectItem>
                <SelectItem value="Normal">Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input 
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', Number(e.target.value))}
              placeholder="Enter quantity"
            />
          </div>
          <div>
            <Label htmlFor="pricePerPiece">Price Per Piece (₹)</Label>
            <Input 
              id="pricePerPiece"
              type="number"
              step="0.01"
              value={formData.pricePerPiece}
              onChange={(e) => handleInputChange('pricePerPiece', Number(e.target.value))}
              placeholder="Enter price per piece"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="totalAmount">Total Amount (₹)</Label>
            <Input 
              id="totalAmount"
              type="number"
              value={formData.totalAmount}
              readOnly
              className="bg-gray-100"
            />
          </div>
          <div>
            <Label htmlFor="thumbnail">Small Thumbnail (Optional)</Label>
            <div className="flex items-center gap-2">
              <Input type="file" accept="image/*" className="flex-1" />
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="internalNotes">Internal Notes (Optional)</Label>
          <Textarea 
            id="internalNotes"
            value={formData.internalNotes}
            onChange={(e) => handleInputChange('internalNotes', e.target.value)}
            placeholder="Add any internal notes or special instructions"
            className="min-h-[80px]"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={handleSave} className="bg-chhapai-gold hover:bg-chhapai-gold-dark text-chhapai-black">
            <Save className="h-4 w-4 mr-2" />
            Create Order
          </Button>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
