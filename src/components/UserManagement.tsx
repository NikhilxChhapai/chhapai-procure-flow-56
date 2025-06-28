
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Plus, Shield, User } from "lucide-react"

const sampleUsers = [
  { id: 1, name: "Admin User", email: "admin@chhapai.com", role: "Admin", status: "Active" },
  { id: 2, name: "Purchase Manager", email: "purchase@chhapai.com", role: "Purchase Team", status: "Active" },
  { id: 3, name: "Inventory Manager", email: "inventory@chhapai.com", role: "Inventory Manager", status: "Active" },
  { id: 4, name: "Department Head", email: "dept@chhapai.com", role: "Department Head", status: "Inactive" },
]

export function UserManagement() {
  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin": return "bg-red-100 text-red-800"
      case "Purchase Team": return "bg-blue-100 text-blue-800"
      case "Inventory Manager": return "bg-green-100 text-green-800"
      case "Department Head": return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-chhapai-gold" />
            User Management
          </CardTitle>
          <Button className="bg-chhapai-gold hover:bg-chhapai-gold-dark text-chhapai-black">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sampleUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-chhapai-gold-light rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-chhapai-black" />
                </div>
                <div>
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={getRoleColor(user.role)}>
                  <Shield className="h-3 w-3 mr-1" />
                  {user.role}
                </Badge>
                <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                  {user.status}
                </Badge>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
