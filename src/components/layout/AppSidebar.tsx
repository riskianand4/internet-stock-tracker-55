import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, useSidebar } from '@/components/ui/sidebar';
import { Package, BarChart3, Plus, Wifi, Home, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import AddProductDialog from '@/components/products/AddProductDialog';
const menuItems = [{
  title: "Dashboard",
  url: "/",
  icon: Home,
  roles: ['user', 'admin', 'super_admin'],
  description: "Main overview and quick actions"
}, {
  title: "Products",
  url: "/products",
  icon: Package,
  roles: ['user', 'admin', 'super_admin'],
  description: "Product catalog and inventory"
}, {
  title: "Analytics",
  url: "/stats",
  icon: BarChart3,
  roles: ['user', 'admin', 'super_admin'],
  description: "Reports and data insights"
}, {
  title: "Stock Movement",
  url: "/stock-movement",
  icon: TrendingUp,
  roles: ['admin', 'super_admin'],
  description: "Track inventory changes"
}];
export function AppSidebar() {
  const {
    user
  } = useAuth();
  const sidebar = useSidebar();
  const collapsed = sidebar?.state === 'collapsed';
  const location = useLocation();
  const currentPath = location.pathname;
  const [showAddProduct, setShowAddProduct] = useState(false);
  const quickActions = [{
    title: 'Add Product',
    icon: Plus,
    roles: ['admin', 'super_admin'],
    action: () => setShowAddProduct(true)
  }];
  const filteredMenuItems = menuItems.filter(item => item.roles.includes(user?.role || 'user'));
  const filteredQuickActions = quickActions.filter(action => action.roles.includes(user?.role || 'user'));
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-destructive';
      case 'admin':
        return 'bg-warning';
      default:
        return 'bg-success';
    }
  };
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'admin':
        return 'Admin';
      default:
        return 'User';
    }
  };
  return <>
      <Sidebar className={`${collapsed ? 'w-16' : 'w-60'}`}>
        <SidebarHeader className="p-6 border-b border-sidebar-border">
          <motion.div className="flex items-center space-x-3" initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.3
        }}>
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-glow">
              <Wifi className="w-6 h-6 text-white" />
            </div>
            {!collapsed && <div>
                <h2 className="text-sm font-bold text-sidebar-foreground">Telkom Inventory</h2>
                <p className="text-xs text-sidebar-foreground/70">Smart Management</p>
              </div>}
          </motion.div>

          {!collapsed}
        </SidebarHeader>

        <SidebarContent className="p-4 px-[3px]">
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-sidebar-foreground/70 mb-2">
              {!collapsed ? 'NAVIGASI UTAMA' : ''}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {filteredMenuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = currentPath === item.url;
                return <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <motion.div initial={{
                      opacity: 0,
                      x: -20
                    }} animate={{
                      opacity: 1,
                      x: 0
                    }} transition={{
                      duration: 0.3,
                      delay: index * 0.05
                    }}>
                          <NavLink to={item.url} className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 group ${isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-medium' : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'}`}>
                            <Icon className={`w-5 h-5 ${isActive ? 'text-sidebar-accent-foreground' : 'group-hover:text-sidebar-primary'}`} />
                            {!collapsed && <span className="font-medium text-sm">{item.title}</span>}
                            {isActive && !collapsed && <motion.div className="ml-auto w-2 h-2 bg-sidebar-accent-foreground rounded-full" layoutId="activeIndicator" initial={{
                          scale: 0
                        }} animate={{
                          scale: 1
                        }} transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30
                        }} />}
                          </NavLink>
                        </motion.div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>;
              })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {filteredQuickActions.length > 0 && !collapsed}
        </SidebarContent>
      </Sidebar>
      
      <AddProductDialog open={showAddProduct} onOpenChange={setShowAddProduct} />
    </>;
}