
import { DashboardLayout } from "@/components/DashboardLayout"
import { InventoryList } from "@/components/InventoryList"
import { InventoryStats } from "@/components/InventoryStats"

const Inventory = () => {
  return (
    <DashboardLayout 
      title="Inventory Management" 
      subtitle="Track and manage your inventory items, stock levels, and movements."
    >
      <div className="animate-fade-in space-y-6">
        <InventoryStats />
        <InventoryList />
      </div>
    </DashboardLayout>
  );
};

export default Inventory;
