
import { DashboardLayout } from "@/components/DashboardLayout"
import { InventoryList } from "@/components/InventoryList"
import { InventoryStats } from "@/components/InventoryStats"
import { NotificationCenter } from "@/components/NotificationCenter"
import { AddInventoryFormEnhanced } from "@/components/AddInventoryFormEnhanced"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"

const Inventory = () => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleInventoryUpdate = () => {
    setRefreshKey(prev => prev + 1)
    setShowAddForm(false)
  }

  return (
    <DashboardLayout 
      title="Inventory Management" 
      subtitle="Track and manage your inventory items, stock levels, and movements."
    >
      <div className="animate-fade-in space-y-6">
        <div className="flex justify-between items-center">
          <InventoryStats key={`stats-${refreshKey}`} />
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <InventoryList key={`list-${refreshKey}`} />
          </div>
          <div>
            <NotificationCenter />
          </div>
        </div>

        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <AddInventoryFormEnhanced 
              onClose={() => setShowAddForm(false)}
              onSave={handleInventoryUpdate}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Inventory;
