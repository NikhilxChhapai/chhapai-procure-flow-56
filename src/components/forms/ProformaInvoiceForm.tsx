
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Receipt, Download, Save, Plus, X } from "lucide-react"
import { generateFormPDF } from "@/utils/pdfGenerator"
import { useToast } from "@/hooks/use-toast"

interface LineItem {
  description: string
  quantity: string
  rate: string
  amount: string
}

export function ProformaInvoiceForm() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    id: `CH/PI/${String(Date.now()).slice(-6)}`,
    clientName: '',
    clientAddress: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    validUntil: '',
    paymentTerms: '30 days from invoice date',
    deliveryTerms: 'FOB Destination',
    gstNumber: '',
    panNumber: '',
    bankDetails: 'Bank: HDFC Bank\nAccount: 12345678901\nIFSC: HDFC0001234',
    totalAmount: '',
    status: 'Draft'
  })

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: '', quantity: '', rate: '', amount: '' }
  ])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: '', rate: '', amount: '' }])
  }

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index))
  }

  const updateLineItem = (index: number, field: keyof LineItem, value: string) => {
    const updated = [...lineItems]
    updated[index][field] = value
    
    // Auto-calculate amount
    if (field === 'quantity' || field === 'rate') {
      const qty = Number(updated[index].quantity)
      const rate = Number(updated[index].rate)
      updated[index].amount = (qty * rate).toFixed(2)
    }
    
    setLineItems(updated)
    
    // Calculate total
    const total = updated.reduce((sum, item) => sum + Number(item.amount || 0), 0)
    setFormData(prev => ({ ...prev, totalAmount: total.toFixed(2) }))
  }

  const handleSave = () => {
    toast({
      title: "Proforma Invoice Saved",
      description: `Invoice ${formData.id} has been saved successfully.`,
    })
  }

  const handleGeneratePDF = () => {
    const invoiceData = {
      ...formData,
      lineItems,
      termsAndConditions: `1. Payment Terms: ${formData.paymentTerms}
2. Delivery Terms: ${formData.deliveryTerms}
3. This proforma invoice is valid until ${formData.validUntil}
4. GST will be charged as applicable
5. All disputes subject to local jurisdiction
6. Goods once sold will not be taken back
7. Payment to be made in favor of "Chhapai"
8. Bank charges (if any) to be borne by the buyer`
    }
    
    generateFormPDF(invoiceData, 'Proforma Invoice')
    toast({
      title: "PDF Generated",
      description: `Proforma Invoice ${formData.id} PDF has been downloaded.`,
    })
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-chhapai-gold to-chhapai-gold-dark text-chhapai-black">
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-6 w-6" />
          Proforma Invoice - {formData.id}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="clientName">Client Name</Label>
            <Input 
              id="clientName"
              value={formData.clientName}
              onChange={(e) => handleInputChange('clientName', e.target.value)}
              placeholder="Enter client name"
            />
          </div>
          <div>
            <Label htmlFor="invoiceDate">Invoice Date</Label>
            <Input 
              id="invoiceDate"
              type="date"
              value={formData.invoiceDate}
              onChange={(e) => handleInputChange('invoiceDate', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="validUntil">Valid Until</Label>
            <Input 
              id="validUntil"
              type="date"
              value={formData.validUntil}
              onChange={(e) => handleInputChange('validUntil', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="gstNumber">GST Number</Label>
            <Input 
              id="gstNumber"
              value={formData.gstNumber}
              onChange={(e) => handleInputChange('gstNumber', e.target.value)}
              placeholder="Enter GST number"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="clientAddress">Client Address</Label>
          <Textarea 
            id="clientAddress"
            value={formData.clientAddress}
            onChange={(e) => handleInputChange('clientAddress', e.target.value)}
            placeholder="Enter complete client address"
            className="min-h-[80px]"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <Label>Line Items</Label>
            <Button onClick={addLineItem} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
          
          <div className="space-y-3">
            {lineItems.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-5">
                  <Input
                    placeholder="Item description"
                    value={item.description}
                    onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(index, 'quantity', e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    placeholder="Rate"
                    value={item.rate}
                    onChange={(e) => updateLineItem(index, 'rate', e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    placeholder="Amount"
                    value={item.amount}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="col-span-1">
                  <Button
                    onClick={() => removeLineItem(index)}
                    size="sm"
                    variant="ghost"
                    disabled={lineItems.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="paymentTerms">Payment Terms</Label>
            <Input 
              id="paymentTerms"
              value={formData.paymentTerms}
              onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="totalAmount">Total Amount (₹)</Label>
            <Input 
              id="totalAmount"
              value={formData.totalAmount}
              readOnly
              className="bg-gray-50 font-bold text-lg"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="bankDetails">Bank Details</Label>
          <Textarea 
            id="bankDetails"
            value={formData.bankDetails}
            onChange={(e) => handleInputChange('bankDetails', e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={handleSave} className="bg-chhapai-gold hover:bg-chhapai-gold-dark text-chhapai-black">
            <Save className="h-4 w-4 mr-2" />
            Save Proforma Invoice
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
