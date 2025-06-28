
import { DashboardLayout } from "@/components/DashboardLayout"
import { PurchaseOrderForm } from "@/components/forms/PurchaseOrderForm"

const PurchaseOrder = () => {
  return (
    <DashboardLayout 
      title="Purchase Order" 
      subtitle="Generate purchase orders with automatic PDF export."
    >
      <div className="animate-fade-in">
        <PurchaseOrderForm />
      </div>
    </DashboardLayout>
  );
};

export default PurchaseOrder;
