
import { DashboardLayout } from "@/components/DashboardLayout"
import { InventoryList } from "@/components/InventoryList"
import { InventoryStats } from "@/components/InventoryStats"
import { NotificationCenter } from "@/components/NotificationCenter"

const Inventory = () => {
  return (
    <DashboardLayout 
      title="Inventory Management" 
      subtitle="Track and manage your inventory items, stock levels, and movements."
    >
      <div className="animate-fade-in space-y-6">
        <InventoryStats />
        
        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <InventoryList />
          </div>
          <div>
            <NotificationCenter />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Inventory;
