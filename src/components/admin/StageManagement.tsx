import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Settings, Plus, Edit, ArrowUp, ArrowDown, Clock } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface CustomStage {
  id: string
  stage_name: string
  display_order: number
  department: string | null
  estimated_hours: number
  is_active: boolean
  created_at: string
}

const departments = [
  { value: 'design', label: 'Design' },
  { value: 'production', label: 'Production' },
  { value: 'qc', label: 'Quality Check' },
  { value: 'dispatch', label: 'Dispatch' },
  { value: 'accounts', label: 'Accounts' },
  { value: 'sales', label: 'Sales' }
]

export function StageManagement() {
  const [stages, setStages] = useState<CustomStage[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStage, setEditingStage] = useState<CustomStage | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    stage_name: '',
    department: '',
    estimated_hours: ''
  })

  useEffect(() => {
    fetchStages()
  }, [])

  const fetchStages = async () => {
    try {
      const { data, error } = await supabase
        .from('custom_stages')
        .select('*')
        .order('display_order')

      if (error) throw error
      setStages(data || [])
    } catch (error) {
      console.error('Error fetching stages:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch stages',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const stageData = {
        stage_name: formData.stage_name,
        department: formData.department || null,
        estimated_hours: formData.estimated_hours ? parseFloat(formData.estimated_hours) : 0,
        display_order: editingStage ? editingStage.display_order : Math.max(...stages.map(s => s.display_order), 0) + 1
      }

      if (editingStage) {
        const { error } = await supabase
          .from('custom_stages')
          .update(stageData)
          .eq('id', editingStage.id)

        if (error) throw error
        
        toast({
          title: 'Success',
          description: 'Stage updated successfully'
        })
      } else {
        const { error } = await supabase
          .from('custom_stages')
          .insert([stageData])

        if (error) throw error
        
        toast({
          title: 'Success',
          description: 'Stage created successfully'
        })
      }

      resetForm()
      fetchStages()
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error saving stage:', error)
      toast({
        title: 'Error',
        description: 'Failed to save stage',
        variant: 'destructive'
      })
    }
  }

  const resetForm = () => {
    setFormData({
      stage_name: '',
      department: '',
      estimated_hours: ''
    })
    setEditingStage(null)
  }

  const handleEdit = (stage: CustomStage) => {
    setEditingStage(stage)
    setFormData({
      stage_name: stage.stage_name,
      department: stage.department || '',
      estimated_hours: stage.estimated_hours.toString()
    })
    setIsDialogOpen(true)
  }

  const toggleStageStatus = async (stageId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('custom_stages')
        .update({ is_active: !currentStatus })
        .eq('id', stageId)

      if (error) throw error

      toast({
        title: 'Success',
        description: `Stage ${!currentStatus ? 'activated' : 'deactivated'} successfully`
      })
      
      fetchStages()
    } catch (error) {
      console.error('Error updating stage status:', error)
      toast({
        title: 'Error',
        description: 'Failed to update stage status',
        variant: 'destructive'
      })
    }
  }

  const moveStage = async (stageId: string, direction: 'up' | 'down') => {
    const currentIndex = stages.findIndex(s => s.id === stageId)
    if (currentIndex === -1) return

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (targetIndex < 0 || targetIndex >= stages.length) return

    const newStages = [...stages]
    const currentStage = newStages[currentIndex]
    const targetStage = newStages[targetIndex]

    // Swap display orders
    const tempOrder = currentStage.display_order
    currentStage.display_order = targetStage.display_order
    targetStage.display_order = tempOrder

    try {
      await Promise.all([
        supabase.from('custom_stages').update({ display_order: currentStage.display_order }).eq('id', currentStage.id),
        supabase.from('custom_stages').update({ display_order: targetStage.display_order }).eq('id', targetStage.id)
      ])

      fetchStages()
      toast({
        title: 'Success',
        description: 'Stage order updated successfully'
      })
    } catch (error) {
      console.error('Error updating stage order:', error)
      toast({
        title: 'Error',
        description: 'Failed to update stage order',
        variant: 'destructive'
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Stage Management
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
            <Settings className="h-5 w-5 text-primary" />
            Stage Management
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Stage
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingStage ? 'Edit Stage' : 'Add New Stage'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="stage_name">Stage Name *</Label>
                  <Input
                    id="stage_name"
                    value={formData.stage_name}
                    onChange={(e) => setFormData({ ...formData, stage_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.value} value={dept.value}>
                          {dept.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="estimated_hours">Estimated Hours</Label>
                  <Input
                    id="estimated_hours"
                    type="number"
                    step="0.5"
                    min="0"
                    value={formData.estimated_hours}
                    onChange={(e) => setFormData({ ...formData, estimated_hours: e.target.value })}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    {editingStage ? 'Update Stage' : 'Create Stage'}
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
          {stages.map((stage, index) => (
            <div key={stage.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50">
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveStage(stage.id, 'up')}
                    disabled={index === 0}
                    className="h-6 w-6 p-0"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveStage(stage.id, 'down')}
                    disabled={index === stages.length - 1}
                    className="h-6 w-6 p-0"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-sm text-muted-foreground">#{stage.display_order}</span>
                    <h3 className="font-semibold">{stage.stage_name}</h3>
                    <Badge variant={stage.is_active ? "default" : "secondary"}>
                      {stage.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {stage.department && (
                      <Badge variant="outline" className="text-xs">
                        {departments.find(d => d.value === stage.department)?.label || stage.department}
                      </Badge>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {stage.estimated_hours}h estimated
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(stage)}>
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toggleStageStatus(stage.id, stage.is_active)}
                  className={stage.is_active ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50"}
                >
                  {stage.is_active ? "Deactivate" : "Activate"}
                </Button>
              </div>
            </div>
          ))}
          
          {stages.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No stages found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}