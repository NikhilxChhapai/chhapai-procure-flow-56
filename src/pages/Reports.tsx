
import { DashboardLayout } from "@/components/DashboardLayout"
import { ReportsOverview } from "@/components/ReportsOverview"

const Reports = () => {
  return (
    <DashboardLayout 
      title="Reports & Analytics" 
      subtitle="View comprehensive reports and analytics for procurement and inventory."
    >
      <div className="animate-fade-in">
        <ReportsOverview />
      </div>
    </DashboardLayout>
  );
};

export default Reports;
