
import { useState } from "react"
import { 
  LayoutDashboard, 
  FileText, 
  Package, 
  BarChart3, 
  Users, 
  Settings,
  ChevronDown,
  Bell,
  AlertTriangle,
  ShoppingCart,
  Receipt,
  FileCheck,
  Truck
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const mainNavItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Inventory", url: "/inventory", icon: Package, badge: "12" },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Users", url: "/users", icon: Users },
  { title: "Settings", url: "/settings", icon: Settings },
]

const formItems = [
  { title: "Requisition Slip", url: "/forms/requisition", icon: FileText },
  { title: "Purchase Order", url: "/forms/purchase-order", icon: ShoppingCart },
  { title: "Proforma Invoice", url: "/forms/proforma", icon: Receipt },
  { title: "Quality Check Slip", url: "/forms/quality-check", icon: FileCheck },
  { title: "Material Received", url: "/forms/material-received", icon: Truck },
  { title: "Delivery Challan", url: "/forms/delivery-challan", icon: FileText },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const [formsOpen, setFormsOpen] = useState(true)
  
  const collapsed = state === "collapsed"

  const isActive = (path: string) => currentPath === path
  const isGroupActive = (items: any[]) => items.some(item => isActive(item.url))

  const getNavClassName = (path: string) => {
    const baseClasses = "w-full justify-start transition-all duration-200 hover:bg-chhapai-gold/10 hover:text-chhapai-gold"
    const activeClasses = "bg-chhapai-gold text-chhapai-black font-semibold shadow-md"
    return isActive(path) ? `${baseClasses} ${activeClasses}` : baseClasses
  }

  return (
    <Sidebar className="border-r border-gray-200 bg-white shadow-lg">
      <SidebarHeader className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-chhapai-gold to-chhapai-gold-dark rounded-lg flex items-center justify-center">
            <span className="text-chhapai-black font-bold text-lg">C</span>
          </div>
          {!collapsed && (
            <div>
              <h2 className="text-xl font-bold text-chhapai-black">Chhapai</h2>
              <p className="text-sm text-gray-600">Procurement & Inventory</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarMenu>
            {mainNavItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <NavLink to={item.url} className={getNavClassName(item.url)}>
                    <item.icon className="mr-3 h-5 w-5" />
                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.title}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {!collapsed && (
          <SidebarGroup>
            <Collapsible open={formsOpen} onOpenChange={setFormsOpen}>
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="flex items-center justify-between cursor-pointer hover:text-chhapai-gold transition-colors py-2 px-2 rounded-md hover:bg-gray-50">
                  <span className="text-sm font-semibold text-gray-700">Forms & Documents</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${formsOpen ? 'rotate-180' : ''}`} />
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {formItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <NavLink to={item.url} className={getNavClassName(item.url)}>
                            <item.icon className="mr-3 h-4 w-4" />
                            <span className="text-sm">{item.title}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        )}

        {!collapsed && (
          <div className="mt-auto pt-6 border-t border-gray-100">
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-800">Low Stock Alert</p>
                <p className="text-xs text-amber-600">12 items need attention</p>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  )
}
