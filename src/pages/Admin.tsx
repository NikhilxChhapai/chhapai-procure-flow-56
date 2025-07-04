import { DashboardLayout } from "@/components/DashboardLayout"
import { AdminDashboard } from "@/components/admin/AdminDashboard"

const Admin = () => {
  return (
    <DashboardLayout 
      title="Admin Panel" 
      subtitle="System administration and management"
    >
      <div className="animate-fade-in">
        <AdminDashboard />
      </div>
    </DashboardLayout>
  );
};

export default Admin;