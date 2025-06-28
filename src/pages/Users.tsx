
import { DashboardLayout } from "@/components/DashboardLayout"
import { UserManagement } from "@/components/UserManagement"

const Users = () => {
  return (
    <DashboardLayout 
      title="User Management" 
      subtitle="Manage user accounts, roles, and permissions."
    >
      <div className="animate-fade-in">
        <UserManagement />
      </div>
    </DashboardLayout>
  );
};

export default Users;
