
import { DashboardLayout } from "@/components/DashboardLayout"
import { DashboardStats } from "@/components/DashboardStats"
import { QuickActions } from "@/components/QuickActions"
import { RecentActivity } from "@/components/RecentActivity"
import { NotificationCenter } from "@/components/NotificationCenter"

const Index = () => {
  return (
    <DashboardLayout 
      title="Dashboard" 
      subtitle="Welcome to Chhapai Procurement & Inventory Management System"
    >
      <div className="animate-fade-in space-y-6">
        <DashboardStats />
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <QuickActions />
          </div>
          <div>
            <NotificationCenter />
          </div>
        </div>
        
        <RecentActivity />
      </div>
    </DashboardLayout>
  );
};

export default Index;
