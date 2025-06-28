
import { DashboardLayout } from "@/components/DashboardLayout"
import { RequisitionForm } from "@/components/forms/RequisitionForm"

const RequisitionSlip = () => {
  return (
    <DashboardLayout 
      title="Requisition Slip" 
      subtitle="Create and manage requisition slips with PDF generation."
    >
      <div className="animate-fade-in">
        <RequisitionForm />
      </div>
    </DashboardLayout>
  );
};

export default RequisitionSlip;
