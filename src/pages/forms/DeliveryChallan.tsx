
import { DashboardLayout } from "@/components/DashboardLayout"
import { DeliveryChallanForm } from "@/components/forms/DeliveryChallanForm"

const DeliveryChallan = () => {
  return (
    <DashboardLayout 
      title="Delivery Challan" 
      subtitle="Create delivery challans with PDF export functionality."
    >
      <div className="animate-fade-in">
        <DeliveryChallanForm />
      </div>
    </DashboardLayout>
  );
};

export default DeliveryChallan;
