
import { DashboardLayout } from "@/components/DashboardLayout"
import { DashboardStats } from "@/components/DashboardStats"
import { RecentActivity } from "@/components/RecentActivity"
import { QuickActions } from "@/components/QuickActions"

const Index = () => {
  return (
    <DashboardLayout 
      title="Dashboard" 
      subtitle="Welcome back! Here's what's happening with your procurement and inventory."
    >
      <div className="animate-fade-in">
        <DashboardStats />
        
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
