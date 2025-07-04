import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Save, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface AddInventoryFormEnhancedProps {
  onClose: () => void
  onSave: () => void
}

interface Vendor {
  id: string
  vendor_name: string
}

export function AddInventoryFormEnhanced({ onClose, onSave }: AddInventoryFormEnhancedProps) {
  const { toast } = useToast()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    item_name: '',
    category: '',
    current_stock: '',
    minimum_stock: '',
    unit_price: '',
    supplier: '',
    vendor_id: ''
  })

  useEffect(() => {
    fetchVendors()
  }, [])

  const fetchVendors = async () => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('id, vendor_name')
        .eq('is_active', true)
        .order('vendor_name')

      if (error) throw error
      setVendors(data || [])
    } catch (error) {
      console.error('Error fetching vendors:', error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!formData.item_name || !formData.current_stock) {
      toast({
        title: "Required Fields",
        description: "Please fill in item name and current stock.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    
    try {
      const { error } = await supabase
        .from('inventory')
        .insert([{
          item_name: formData.item_name,
          category: formData.category || null,
          current_stock: parseInt(formData.current_stock),
          minimum_stock: parseInt(formData.minimum_stock) || 10,
          unit_price: parseFloat(formData.unit_price) || 0,
          supplier: formData.supplier || null,
          vendor_id: formData.vendor_id || null
        }])

      if (error) throw error

      toast({
        title: "Success",
        description: `${formData.item_name} has been added to inventory successfully.`,
      })
      
      onSave()
      onClose()
    } catch (error: any) {
      console.error('Error adding inventory item:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to add inventory item',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Add New Inventory Item
          </CardTitle>
          <Button onClick={onClose} size="sm" variant="ghost" className="text-primary-foreground hover:bg-black/10">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="item_name">Item Name *</Label>
            <Input 
              id="item_name"
              value={formData.item_name}
              onChange={(e) => handleInputChange('item_name', e.target.value)}
              placeholder="Enter item name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Paper">Paper</SelectItem>
                <SelectItem value="Ink">Ink</SelectItem>
                <SelectItem value="Binding Materials">Binding Materials</SelectItem>
                <SelectItem value="Finishing Supplies">Finishing Supplies</SelectItem>
                <SelectItem value="Tools & Equipment">Tools & Equipment</SelectItem>
                <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                <SelectItem value="Raw Materials">Raw Materials</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="current_stock">Current Stock *</Label>
            <Input 
              id="current_stock"
              type="number"
              min="0"
              value={formData.current_stock}
              onChange={(e) => handleInputChange('current_stock', e.target.value)}
              placeholder="Enter current stock"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="minimum_stock">Minimum Stock Level</Label>
            <Input 
              id="minimum_stock"
              type="number"
              min="0"
              value={formData.minimum_stock}
              onChange={(e) => handleInputChange('minimum_stock', e.target.value)}
              placeholder="Default: 10"
            />
          </div>
          
          <div>
            <Label htmlFor="unit_price">Unit Price (₹)</Label>
            <Input 
              id="unit_price"
              type="number"
              min="0"
              step="0.01"
              value={formData.unit_price}
              onChange={(e) => handleInputChange('unit_price', e.target.value)}
              placeholder="Enter unit price"
            />
          </div>
          
          <div>
            <Label htmlFor="vendor">Vendor</Label>
            <Select value={formData.vendor_id} onValueChange={(value) => handleInputChange('vendor_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select vendor" />
              </SelectTrigger>
              <SelectContent>
                {vendors.map((vendor) => (
                  <SelectItem key={vendor.id} value={vendor.id}>
                    {vendor.vendor_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="supplier">Supplier (Legacy/Manual)</Label>
            <Input 
              id="supplier"
              value={formData.supplier}
              onChange={(e) => handleInputChange('supplier', e.target.value)}
              placeholder="Enter supplier name manually"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button 
            onClick={handleSave} 
            disabled={loading || !formData.item_name || !formData.current_stock}
            className="bg-primary hover:bg-primary/90"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Adding...' : 'Add to Inventory'}
          </Button>
          <Button onClick={onClose} variant="outline" disabled={loading}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}