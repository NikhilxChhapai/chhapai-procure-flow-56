import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Building2, Plus, Edit, Trash2, Phone, Mail, CreditCard } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface Vendor {
  id: string
  vendor_name: string
  gst_number: string | null
  credit_limit_amount: number | null
  credit_limit_days: number | null
  contact_person: string | null
  phone: string | null
  email: string | null
  address: string | null
  product_types: string[] | null
  typical_quantities: string[] | null
  typical_sizes: string[] | null
  is_active: boolean
  created_at: string
}

export function VendorManagement() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    vendor_name: '',
    gst_number: '',
    credit_limit_amount: '',
    credit_limit_days: '',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
    product_types: '',
    typical_quantities: '',
    typical_sizes: ''
  })

  useEffect(() => {
    fetchVendors()
  }, [])

  const fetchVendors = async () => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('vendor_name')

      if (error) throw error
      setVendors(data || [])
    } catch (error) {
      console.error('Error fetching vendors:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch vendors',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const vendorData = {
        vendor_name: formData.vendor_name,
        gst_number: formData.gst_number || null,
        credit_limit_amount: formData.credit_limit_amount ? parseFloat(formData.credit_limit_amount) : null,
        credit_limit_days: formData.credit_limit_days ? parseInt(formData.credit_limit_days) : null,
        contact_person: formData.contact_person || null,
        phone: formData.phone || null,
        email: formData.email || null,
        address: formData.address || null,
        product_types: formData.product_types ? formData.product_types.split(',').map(s => s.trim()) : null,
        typical_quantities: formData.typical_quantities ? formData.typical_quantities.split(',').map(s => s.trim()) : null,
        typical_sizes: formData.typical_sizes ? formData.typical_sizes.split(',').map(s => s.trim()) : null
      }

      if (editingVendor) {
        const { error } = await supabase
          .from('vendors')
          .update(vendorData)
          .eq('id', editingVendor.id)

        if (error) throw error
        
        toast({
          title: 'Success',
          description: 'Vendor updated successfully'
        })
      } else {
        const { error } = await supabase
          .from('vendors')
          .insert([vendorData])

        if (error) throw error
        
        toast({
          title: 'Success',
          description: 'Vendor created successfully'
        })
      }

      resetForm()
      fetchVendors()
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error saving vendor:', error)
      toast({
        title: 'Error',
        description: 'Failed to save vendor',
        variant: 'destructive'
      })
    }
  }

  const resetForm = () => {
    setFormData({
      vendor_name: '',
      gst_number: '',
      credit_limit_amount: '',
      credit_limit_days: '',
      contact_person: '',
      phone: '',
      email: '',
      address: '',
      product_types: '',
      typical_quantities: '',
      typical_sizes: ''
    })
    setEditingVendor(null)
  }

  const handleEdit = (vendor: Vendor) => {
    setEditingVendor(vendor)
    setFormData({
      vendor_name: vendor.vendor_name,
      gst_number: vendor.gst_number || '',
      credit_limit_amount: vendor.credit_limit_amount?.toString() || '',
      credit_limit_days: vendor.credit_limit_days?.toString() || '',
      contact_person: vendor.contact_person || '',
      phone: vendor.phone || '',
      email: vendor.email || '',
      address: vendor.address || '',
      product_types: vendor.product_types?.join(', ') || '',
      typical_quantities: vendor.typical_quantities?.join(', ') || '',
      typical_sizes: vendor.typical_sizes?.join(', ') || ''
    })
    setIsDialogOpen(true)
  }

  const toggleVendorStatus = async (vendorId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('vendors')
        .update({ is_active: !currentStatus })
        .eq('id', vendorId)

      if (error) throw error

      toast({
        title: 'Success',
        description: `Vendor ${!currentStatus ? 'activated' : 'deactivated'} successfully`
      })
      
      fetchVendors()
    } catch (error) {
      console.error('Error updating vendor status:', error)
      toast({
        title: 'Error',
        description: 'Failed to update vendor status',
        variant: 'destructive'
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Vendor Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Vendor Management
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Vendor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingVendor ? 'Edit Vendor' : 'Add New Vendor'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vendor_name">Vendor Name *</Label>
                    <Input
                      id="vendor_name"
                      value={formData.vendor_name}
                      onChange={(e) => setFormData({ ...formData, vendor_name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="gst_number">GST Number</Label>
                    <Input
                      id="gst_number"
                      value={formData.gst_number}
                      onChange={(e) => setFormData({ ...formData, gst_number: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="credit_limit_amount">Credit Limit (₹)</Label>
                    <Input
                      id="credit_limit_amount"
                      type="number"
                      value={formData.credit_limit_amount}
                      onChange={(e) => setFormData({ ...formData, credit_limit_amount: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="credit_limit_days">Credit Days</Label>
                    <Input
                      id="credit_limit_days"
                      type="number"
                      value={formData.credit_limit_days}
                      onChange={(e) => setFormData({ ...formData, credit_limit_days: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_person">Contact Person</Label>
                    <Input
                      id="contact_person"
                      value={formData.contact_person}
                      onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="product_types">Product Types</Label>
                    <Input
                      id="product_types"
                      value={formData.product_types}
                      onChange={(e) => setFormData({ ...formData, product_types: e.target.value })}
                      placeholder="Books, Brochures, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="typical_quantities">Typical Quantities</Label>
                    <Input
                      id="typical_quantities"
                      value={formData.typical_quantities}
                      onChange={(e) => setFormData({ ...formData, typical_quantities: e.target.value })}
                      placeholder="500, 1000, 5000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="typical_sizes">Typical Sizes</Label>
                    <Input
                      id="typical_sizes"
                      value={formData.typical_sizes}
                      onChange={(e) => setFormData({ ...formData, typical_sizes: e.target.value })}
                      placeholder="A4, A5, Custom"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    {editingVendor ? 'Update Vendor' : 'Create Vendor'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {vendors.map((vendor) => (
            <div key={vendor.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold">{vendor.vendor_name}</h3>
                  <Badge variant={vendor.is_active ? "default" : "secondary"}>
                    {vendor.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                  {vendor.contact_person && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {vendor.contact_person}
                    </div>
                  )}
                  {vendor.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {vendor.email}
                    </div>
                  )}
                  {vendor.credit_limit_amount && (
                    <div className="flex items-center gap-1">
                      <CreditCard className="h-3 w-3" />
                      ₹{vendor.credit_limit_amount.toLocaleString()}
                    </div>
                  )}
                  {vendor.gst_number && (
                    <div>GST: {vendor.gst_number}</div>
                  )}
                </div>
                {vendor.product_types && vendor.product_types.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {vendor.product_types.map((type, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(vendor)}>
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toggleVendorStatus(vendor.id, vendor.is_active)}
                  className={vendor.is_active ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50"}
                >
                  {vendor.is_active ? "Deactivate" : "Activate"}
                </Button>
              </div>
            </div>
          ))}
          
          {vendors.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No vendors found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}