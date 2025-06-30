
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Shield, 
  Palette, 
  ShoppingCart, 
  Factory, 
  CheckCircle, 
  Calculator, 
  Truck, 
  TrendingUp,
  Eye
} from "lucide-react"

interface RoleSelectorProps {
  selectedRole: string | null
  onRoleSelect: (role: string) => void
}

const roles = [
  {
    id: 'admin',
    name: 'Admin',
    description: 'Full system access and user management',
    icon: Shield,
    color: 'bg-red-100 text-red-800 border-red-200',
    permissions: ['All Modules', 'User Management', 'System Settings']
  },
  {
    id: 'designer',
    name: 'Designer',
    description: 'Design and creative tasks',
    icon: Palette,
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    permissions: ['Order View', 'Design Tasks']
  },
  {
    id: 'purchase',
    name: 'Purchase Team',
    description: 'Procurement and vendor management',
    icon: ShoppingCart,
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    permissions: ['Purchase Orders', 'Inventory', 'Vendor Management']
  },
  {
    id: 'production',
    name: 'Production',
    description: 'Manufacturing and production oversight',
    icon: Factory,
    color: 'bg-green-100 text-green-800 border-green-200',
    permissions: ['Production Orders', 'Inventory Updates', 'Stage Management']
  },
  {
    id: 'qc',
    name: 'Quality Check',
    description: 'Quality assurance and testing',
    icon: CheckCircle,
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    permissions: ['Quality Reports', 'Order Reviews', 'Testing']
  },
  {
    id: 'accounts',
    name: 'Accounts',
    description: 'Financial management and reporting',
    icon: Calculator,
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    permissions: ['Financial Reports', 'Payment Tracking', 'Accounting']
  },
  {
    id: 'dispatch',
    name: 'Dispatch',
    description: 'Shipping and delivery coordination',
    icon: Truck,
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    permissions: ['Delivery Challan', 'Shipping', 'Logistics']
  },
  {
    id: 'sales',
    name: 'Sales',
    description: 'Sales management and customer relations',
    icon: TrendingUp,
    color: 'bg-pink-100 text-pink-800 border-pink-200',
    permissions: ['Order Management', 'Customer Relations', 'Sales Reports']
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access to reports and data',
    icon: Eye,
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    permissions: ['View Only', 'Reports Access', 'Data Viewing']
  }
]

export function RoleSelector({ selectedRole, onRoleSelect }: RoleSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Select Your Role</h2>
        <p className="text-gray-600">Choose your role to access the appropriate dashboard</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
        {roles.map((role) => {
          const Icon = role.icon
          const isSelected = selectedRole === role.id
          
          return (
            <Card 
              key={role.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-chhapai-gold shadow-md' : ''
              }`}
              onClick={() => onRoleSelect(role.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${role.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-sm font-medium">{role.name}</CardTitle>
                  </div>
                  {isSelected && (
                    <div className="w-4 h-4 bg-chhapai-gold rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-gray-600 mb-3">{role.description}</p>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.slice(0, 2).map((permission) => (
                    <Badge 
                      key={permission} 
                      variant="secondary" 
                      className="text-xs px-2 py-0.5"
                    >
                      {permission}
                    </Badge>
                  ))}
                  {role.permissions.length > 2 && (
                    <Badge variant="outline" className="text-xs px-2 py-0.5">
                      +{role.permissions.length - 2}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      
      {selectedRole && (
        <div className="mt-4 p-3 bg-chhapai-gold-light rounded-lg">
          <p className="text-sm text-chhapai-black font-medium">
            Selected: {roles.find(r => r.id === selectedRole)?.name}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            You'll be logged in with {selectedRole} permissions
          </p>
        </div>
      )}
    </div>
  )
}
