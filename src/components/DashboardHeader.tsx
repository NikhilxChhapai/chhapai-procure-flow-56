
import { Bell, Search, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
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

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const { user, userProfile, signOut } = useAuth();

  return (
    <header className="border-b bg-white px-6 py-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search orders, customers, products..."
              className="pl-10 bg-gray-50 border-none"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 p-0 text-xs">
              3
            </Badge>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 h-auto py-2">
                <div className="w-8 h-8 bg-chhapai-gold-light rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-chhapai-black" />
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium">
                    {userProfile?.first_name || user?.email?.split('@')[0]}
                  </div>
                  <div className="text-xs text-gray-500">
                    {getRoleDisplayName(userProfile?.role || 'user')}
                  </div>
                </div>
                {userProfile?.role && (
                  <Badge className={`${getRoleColor(userProfile.role)} text-xs`}>
                    {getRoleDisplayName(userProfile.role)}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-white border border-gray-200 shadow-lg">
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">
                  {userProfile?.first_name} {userProfile?.last_name}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
                <Badge className={`${getRoleColor(userProfile?.role || 'user')} text-xs mt-1`}>
                  {getRoleDisplayName(userProfile?.role || 'user')}
                </Badge>
              </div>
              
              <div className="py-1">
                <DropdownMenuItem className="flex items-center gap-2 px-3 py-2">
                  <User className="mr-2 h-4 w-4" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 px-3 py-2">
                  <Settings className="mr-2 h-4 w-4" />
                  Preferences
                </DropdownMenuItem>
              </div>
              
              <DropdownMenuSeparator />
              
              <div className="py-1">
                <DropdownMenuItem 
                  onClick={signOut}
                  className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
        
        {userProfile?.role && (
          <div className="text-right">
            <p className="text-sm text-gray-500">Welcome back,</p>
            <p className="font-semibold text-gray-900">
              {getRoleDisplayName(userProfile.role)} Team
            </p>
          </div>
        )}
      </div>
    </header>
  );
}
