
import { DashboardLayout } from "@/components/DashboardLayout"
import { QualityCheckForm } from "@/components/forms/QualityCheckForm"

const QualityCheck = () => {
  return (
    <DashboardLayout 
      title="Quality Check Slip" 
      subtitle="Perform quality checks and generate QC reports."
    >
      <div className="animate-fade-in">
        <QualityCheckForm />
      </div>
    </DashboardLayout>
  );
};

export default QualityCheck;
