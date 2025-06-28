
import { DashboardLayout } from "@/components/DashboardLayout"
import { MaterialReceivedForm } from "@/components/forms/MaterialReceivedForm"

const MaterialReceived = () => {
  return (
    <DashboardLayout 
      title="Material Received" 
      subtitle="Record material receipts and update inventory automatically."
    >
      <div className="animate-fade-in">
        <MaterialReceivedForm />
      </div>
    </DashboardLayout>
  );
};

export default MaterialReceived;
