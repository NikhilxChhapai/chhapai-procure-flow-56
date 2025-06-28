
import { DashboardLayout } from "@/components/DashboardLayout"
import { SystemSettings } from "@/components/SystemSettings"

const Settings = () => {
  return (
    <DashboardLayout 
      title="System Settings" 
      subtitle="Configure system preferences and general settings."
    >
      <div className="animate-fade-in">
        <SystemSettings />
      </div>
    </DashboardLayout>
  );
};

export default Settings;
