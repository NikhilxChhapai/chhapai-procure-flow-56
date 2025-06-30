
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Plus, Shield, User, Edit, Trash2 } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface UserProfile {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  role: string
  department: string | null
  is_active: boolean | null
  created_at: string | null
  last_login: string | null
}

export function UserManagement() {
  const { userProfile } = useAuth()
  const { toast } = useToast()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const getRoleColor = (role: string) => {
    const colorMap: Record<string, string> = {
      admin: 'bg-red-100 text-red-800',
      designer: 'bg-purple-100 text-purple-800',
      purchase: 'bg-blue-100 text-blue-800',
      production: 'bg-green-100 text-green-800',
      qc: 'bg-yellow-100 text-yellow-800',
      accounts: 'bg-indigo-100 text-indigo-800',
      dispatch: 'bg-orange-100 text-orange-800',
      sales: 'bg-pink-100 text-pink-800',
      viewer: 'bg-gray-100 text-gray-800'
    }
    return colorMap[role] || 'bg-gray-100 text-gray-800'
  }

  const getRoleDisplayName = (role: string) => {
    const roleMap: Record<string, string> = {
      admin: 'Administrator',
      designer: 'Designer',
      purchase: 'Purchase Team',
      production: 'Production',
      qc: 'Quality Check',
      accounts: 'Accounts',
      dispatch: 'Dispatch',
      sales: 'Sales',
      viewer: 'Viewer'
    }
    return roleMap[role] || role
  }

  const toggleUserStatus = async (userId: string, currentStatus: boolean | null) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !currentStatus })
        .eq('id', userId)

      if (error) throw error

      await fetchUsers()
      toast({
        title: 'Success',
        description: `User ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      })
    } catch (error) {
      console.error('Error updating user status:', error)
      toast({
        title: 'Error',
        description: 'Failed to update user status',
        variant: 'destructive'
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-chhapai-gold" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chhapai-gold"></div>
          </div>
        </CardContent>
      </Card>
    )
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
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-chhapai-gold-light rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-chhapai-black" />
                </div>
                <div>
                  <h3 className="font-semibold">
                    {user.first_name || user.last_name ? 
                      `${user.first_name || ''} ${user.last_name || ''}`.trim() : 
                      user.email.split('@')[0]
                    }
                  </h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  {user.department && (
                    <p className="text-xs text-gray-500">{user.department}</p>
                  )}
                  {user.last_login && (
                    <p className="text-xs text-gray-400">
                      Last login: {new Date(user.last_login).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={getRoleColor(user.role)}>
                  <Shield className="h-3 w-3 mr-1" />
                  {getRoleDisplayName(user.role)}
                </Badge>
                <Badge variant={user.is_active !== false ? "default" : "secondary"}>
                  {user.is_active !== false ? "Active" : "Inactive"}
                </Badge>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  {userProfile?.role === 'admin' && user.id !== userProfile.id && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleUserStatus(user.id, user.is_active)}
                      className={user.is_active !== false ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50"}
                    >
                      {user.is_active !== false ? "Deactivate" : "Activate"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {users.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No users found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
