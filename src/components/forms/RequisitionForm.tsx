
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Download, Save } from "lucide-react"
import { generateFormPDF } from "@/utils/pdfGenerator"
import { useToast } from "@/hooks/use-toast"

export function RequisitionForm() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    id: `CH/REQ/${String(Date.now()).slice(-6)}`,
    department: '',
    requestedBy: '',
    dateRequired: '',
    items: '',
    quantity: '',
    specifications: '',
    justification: '',
    approvedBy: '',
    status: 'Draft'
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    toast({
      title: "Requisition Saved",
      description: `Requisition ${formData.id} has been saved successfully.`,
    })
  }

  const handleGeneratePDF = () => {
    generateFormPDF(formData, 'Requisition Slip')
    toast({
      title: "PDF Generated",
      description: `Requisition ${formData.id} PDF has been downloaded.`,
    })
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-chhapai-gold to-chhapai-gold-dark text-chhapai-black">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Requisition Slip - {formData.id}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="department">Department</Label>
            <Input 
              id="department"
              value={formData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              placeholder="Enter department name"
            />
          </div>
          <div>
            <Label htmlFor="requestedBy">Requested By</Label>
            <Input 
              id="requestedBy"
              value={formData.requestedBy}
              onChange={(e) => handleInputChange('requestedBy', e.target.value)}
              placeholder="Enter requester name"
            />
          </div>
          <div>
            <Label htmlFor="dateRequired">Date Required</Label>
            <Input 
              id="dateRequired"
              type="date"
              value={formData.dateRequired}
              onChange={(e) => handleInputChange('dateRequired', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input 
              id="quantity"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              placeholder="Enter quantity"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="items">Items Required</Label>
          <Textarea 
            id="items"
            value={formData.items}
            onChange={(e) => handleInputChange('items', e.target.value)}
            placeholder="List all items required"
            className="min-h-[100px]"
          />
        </div>

        <div>
          <Label htmlFor="specifications">Specifications</Label>
          <Textarea 
            id="specifications"
            value={formData.specifications}
            onChange={(e) => handleInputChange('specifications', e.target.value)}
            placeholder="Enter detailed specifications"
            className="min-h-[100px]"
          />
        </div>

        <div>
          <Label htmlFor="justification">Justification</Label>
          <Textarea 
            id="justification"
            value={formData.justification}
            onChange={(e) => handleInputChange('justification', e.target.value)}
            placeholder="Explain why these items are needed"
            className="min-h-[80px]"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={handleSave} className="bg-chhapai-gold hover:bg-chhapai-gold-dark text-chhapai-black">
            <Save className="h-4 w-4 mr-2" />
            Save Requisition
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
