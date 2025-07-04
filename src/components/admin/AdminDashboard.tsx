import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserManagement } from "@/components/UserManagement"
import { VendorManagement } from "./VendorManagement"
import { StageManagement } from "./StageManagement"
import { Shield, Building2, Settings, Users } from "lucide-react"

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground">
          Manage users, vendors, stages, and system configuration
        </p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="vendors" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Vendor Management
          </TabsTrigger>
          <TabsTrigger value="stages" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Stage Management
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="mt-6">
          <UserManagement />
        </TabsContent>
        
        <TabsContent value="vendors" className="mt-6">
          <VendorManagement />
        </TabsContent>
        
        <TabsContent value="stages" className="mt-6">
          <StageManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}