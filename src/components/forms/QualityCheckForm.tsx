
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileCheck, Download, Save } from "lucide-react"
import { generateFormPDF } from "@/utils/pdfGenerator"
import { useToast } from "@/hooks/use-toast"

export function QualityCheckForm() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    id: `CH/QC/${String(Date.now()).slice(-6)}`,
    itemName: '',
    batchNumber: '',
    supplier: '',
    checkDate: new Date().toISOString().split('T')[0],
    checkedBy: '',
    visualInspection: '',
    dimensionalCheck: '',
    functionalTest: '',
    result: '',
    remarks: '',
    status: 'Pending'
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    toast({
      title: "Quality Check Saved",
      description: `Quality Check ${formData.id} has been saved successfully.`,
    })
  }

  const handleGeneratePDF = () => {
    generateFormPDF(formData, 'Quality Check Report')
    toast({
      title: "PDF Generated",
      description: `Quality Check Report ${formData.id} PDF has been downloaded.`,
    })
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-chhapai-gold to-chhapai-gold-dark text-chhapai-black">
        <CardTitle className="flex items-center gap-2">
          <FileCheck className="h-6 w-6" />
          Quality Check Report - {formData.id}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="itemName">Item Name</Label>
            <Input 
              id="itemName"
              value={formData.itemName}
              onChange={(e) => handleInputChange('itemName', e.target.value)}
              placeholder="Enter item name"
            />
          </div>
          <div>
            <Label htmlFor="batchNumber">Batch Number</Label>
            <Input 
              id="batchNumber"
              value={formData.batchNumber}
              onChange={(e) => handleInputChange('batchNumber', e.target.value)}
              placeholder="Enter batch number"
            />
          </div>
          <div>
            <Label htmlFor="supplier">Supplier</Label>
            <Input 
              id="supplier"
              value={formData.supplier}
              onChange={(e) => handleInputChange('supplier', e.target.value)}
              placeholder="Enter supplier name"
            />
          </div>
          <div>
            <Label htmlFor="checkDate">Check Date</Label>
            <Input 
              id="checkDate"
              type="date"
              value={formData.checkDate}
              onChange={(e) => handleInputChange('checkDate', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="checkedBy">Checked By</Label>
            <Input 
              id="checkedBy"
              value={formData.checkedBy}
              onChange={(e) => handleInputChange('checkedBy', e.target.value)}
              placeholder="Enter inspector name"
            />
          </div>
          <div>
            <Label htmlFor="result">Overall Result</Label>
            <Select value={formData.result} onValueChange={(value) => handleInputChange('result', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pass">Pass</SelectItem>
                <SelectItem value="Fail">Fail</SelectItem>
                <SelectItem value="Conditional Pass">Conditional Pass</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="visualInspection">Visual Inspection</Label>
          <Textarea 
            id="visualInspection"
            value={formData.visualInspection}
            onChange={(e) => handleInputChange('visualInspection', e.target.value)}
            placeholder="Describe visual inspection results"
            className="min-h-[80px]"
          />
        </div>

        <div>
          <Label htmlFor="dimensionalCheck">Dimensional Check</Label>
          <Textarea 
            id="dimensionalCheck"
            value={formData.dimensionalCheck}
            onChange={(e) => handleInputChange('dimensionalCheck', e.target.value)}
            placeholder="Record dimensional measurements and tolerances"
            className="min-h-[80px]"
          />
        </div>

        <div>
          <Label htmlFor="functionalTest">Functional Test</Label>
          <Textarea 
            id="functionalTest"
            value={formData.functionalTest}
            onChange={(e) => handleInputChange('functionalTest', e.target.value)}
            placeholder="Describe functional test results"
            className="min-h-[80px]"
          />
        </div>

        <div>
          <Label htmlFor="remarks">Remarks & Recommendations</Label>
          <Textarea 
            id="remarks"
            value={formData.remarks}
            onChange={(e) => handleInputChange('remarks', e.target.value)}
            placeholder="Additional remarks and recommendations"
            className="min-h-[80px]"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={handleSave} className="bg-chhapai-gold hover:bg-chhapai-gold-dark text-chhapai-black">
            <Save className="h-4 w-4 mr-2" />
            Save Quality Check
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
