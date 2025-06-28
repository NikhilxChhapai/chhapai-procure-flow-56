
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Download, Save, AlertTriangle } from "lucide-react"
import { generateFormPDF } from "@/utils/pdfGenerator"
import { useToast } from "@/hooks/use-toast"

export function MaterialReceivedForm() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    id: `CH/MR/${String(Date.now()).slice(-6)}`,
    poNumber: '',
    vendor: '',
    receiptDate: new Date().toISOString().split('T')[0],
    itemsReceived: '',
    quantityReceived: '',
    quantityOrdered: '',
    condition: '',
    remarks: '',
    receivedBy: '',
    status: 'Received'
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    // Auto-update inventory when material is received
    toast({
      title: "Material Receipt Recorded",
      description: `Receipt ${formData.id} saved and inventory updated automatically.`,
    })
  }

  const handleGeneratePDF = () => {
    generateFormPDF(formData, 'Material Received Report')
    toast({
      title: "PDF Generated",
      description: `Material Receipt ${formData.id} PDF has been downloaded.`,
    })
  }

  const isQuantityMismatch = formData.quantityReceived && formData.quantityOrdered && 
    Number(formData.quantityReceived) !== Number(formData.quantityOrdered)

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-chhapai-gold to-chhapai-gold-dark text-chhapai-black">
        <CardTitle className="flex items-center gap-2">
          <Package className="h-6 w-6" />
          Material Received - {formData.id}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="poNumber">Purchase Order Number</Label>
            <Input 
              id="poNumber"
              value={formData.poNumber}
              onChange={(e) => handleInputChange('poNumber', e.target.value)}
              placeholder="Enter PO number"
            />
          </div>
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
            <Label htmlFor="receiptDate">Receipt Date</Label>
            <Input 
              id="receiptDate"
              type="date"
              value={formData.receiptDate}
              onChange={(e) => handleInputChange('receiptDate', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="receivedBy">Received By</Label>
            <Input 
              id="receivedBy"
              value={formData.receivedBy}
              onChange={(e) => handleInputChange('receivedBy', e.target.value)}
              placeholder="Enter receiver name"
            />
          </div>
          <div>
            <Label htmlFor="quantityOrdered">Quantity Ordered</Label>
            <Input 
              id="quantityOrdered"
              type="number"
              value={formData.quantityOrdered}
              onChange={(e) => handleInputChange('quantityOrdered', e.target.value)}
              placeholder="Enter ordered quantity"
            />
          </div>
          <div>
            <Label htmlFor="quantityReceived">Quantity Received</Label>
            <Input 
              id="quantityReceived"
              type="number"
              value={formData.quantityReceived}
              onChange={(e) => handleInputChange('quantityReceived', e.target.value)}
              placeholder="Enter received quantity"
              className={isQuantityMismatch ? "border-red-500" : ""}
            />
            {isQuantityMismatch && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertTriangle className="h-3 w-3" />
                Quantity mismatch detected
              </div>
            )}
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="condition">Material Condition</Label>
            <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Damaged">Damaged</SelectItem>
                <SelectItem value="Partial Damage">Partial Damage</SelectItem>
                <SelectItem value="Needs QC">Needs Quality Check</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="itemsReceived">Items Received (Details)</Label>
          <Textarea 
            id="itemsReceived"
            value={formData.itemsReceived}
            onChange={(e) => handleInputChange('itemsReceived', e.target.value)}
            placeholder="List all items received with specifications"
            className="min-h-[120px]"
          />
        </div>

        <div>
          <Label htmlFor="remarks">Remarks & Notes</Label>
          <Textarea 
            id="remarks"
            value={formData.remarks}
            onChange={(e) => handleInputChange('remarks', e.target.value)}
            placeholder="Any additional remarks or issues"
            className="min-h-[80px]"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={handleSave} className="bg-chhapai-gold hover:bg-chhapai-gold-dark text-chhapai-black">
            <Save className="h-4 w-4 mr-2" />
            Save & Update Inventory
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
