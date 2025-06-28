
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Save, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AddInventoryFormProps {
  onClose: () => void
  onSave: (item: any) => void
}

export function AddInventoryForm({ onClose, onSave }: AddInventoryFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    sku: `SKU${String(Date.now()).slice(-6)}`,
    category: '',
    quantity: '',
    minStock: '',
    price: '',
    location: '',
    description: '',
    supplier: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    const newItem = {
      id: Date.now(),
      ...formData,
      quantity: Number(formData.quantity),
      minStock: Number(formData.minStock),
      price: Number(formData.price)
    }
    
    onSave(newItem)
    toast({
      title: "Inventory Added",
      description: `${formData.name} has been added to inventory successfully.`,
    })
    onClose()
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="bg-gradient-to-r from-chhapai-gold to-chhapai-gold-dark text-chhapai-black">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Add New Inventory Item
          </CardTitle>
          <Button onClick={onClose} size="sm" variant="ghost" className="text-chhapai-black hover:bg-black/10">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Item Name</Label>
            <Input 
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter item name"
            />
          </div>
          <div>
            <Label htmlFor="sku">SKU</Label>
            <Input 
              id="sku"
              value={formData.sku}
              onChange={(e) => handleInputChange('sku', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Stationery">Stationery</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Construction">Construction</SelectItem>
                <SelectItem value="Safety">Safety</SelectItem>
                <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                <SelectItem value="Raw Materials">Raw Materials</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="location">Storage Location</Label>
            <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Store A">Store A</SelectItem>
                <SelectItem value="Store B">Store B</SelectItem>
                <SelectItem value="Warehouse">Warehouse</SelectItem>
                <SelectItem value="Office">Office</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="quantity">Initial Quantity</Label>
            <Input 
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              placeholder="Enter quantity"
            />
          </div>
          <div>
            <Label htmlFor="minStock">Minimum Stock Level</Label>
            <Input 
              id="minStock"
              type="number"
              value={formData.minStock}
              onChange={(e) => handleInputChange('minStock', e.target.value)}
              placeholder="Enter minimum stock"
            />
          </div>
          <div>
            <Label htmlFor="price">Unit Price (₹)</Label>
            <Input 
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="Enter unit price"
            />
          </div>
          <div>
            <Label htmlFor="supplier">Preferred Supplier</Label>
            <Input 
              id="supplier"
              value={formData.supplier}
              onChange={(e) => handleInputChange('supplier', e.target.value)}
              placeholder="Enter supplier name"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter item description and specifications"
            className="min-h-[80px]"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={handleSave} className="bg-chhapai-gold hover:bg-chhapai-gold-dark text-chhapai-black">
            <Save className="h-4 w-4 mr-2" />
            Add to Inventory
          </Button>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
