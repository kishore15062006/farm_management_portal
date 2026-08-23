import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, Calendar, FileText, Home, Package, Shield, Stethoscope, Users, ChevronLeft, Menu, Bell, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { user } = useAuth();
    const { t } = useTranslation();
    const getNavigationItems = () => {
        const baseItems = [
            { icon: Home, label: t('nav.dashboard'), path: '/dashboard' }
        ];
        if (user?.role === 'farmer') {
            return [
                ...baseItems,
                { icon: Stethoscope, label: t('nav.problems'), path: '/dashboard/problems' },
                { icon: Calendar, label: t('nav.treatments'), path: '/dashboard/treatments' },
                { icon: Package, label: t('nav.feedAdditives'), path: '/dashboard/feed-additives' },
                { icon: Bell, label: t('nav.alerts'), path: '/dashboard/alerts' }
            ];
        }
        if (user?.role === 'veterinarian') {
            return [
                ...baseItems,
                { icon: Stethoscope, label: t('nav.problems'), path: '/dashboard/problems' },
                { icon: CheckCircle, label: t('nav.approvals'), path: '/dashboard/approvals' },
                { icon: Users, label: t('nav.farmers'), path: '/dashboard/farmers' },
                { icon: Calendar, label: t('nav.treatments'), path: '/dashboard/treatments' }
            ];
        }
        if (user?.role === 'regulator') {
            return [
                ...baseItems,
                { icon: BarChart3, label: t('nav.analytics'), path: '/dashboard/analytics' },
                { icon: FileText, label: t('nav.reports'), path: '/dashboard/reports' },
                { icon: Shield, label: t('nav.compliance'), path: '/dashboard/compliance' },
                { icon: AlertTriangle, label: t('nav.alerts'), path: '/dashboard/alerts' }
            ];
        }
        return baseItems;
    };
    const navigationItems = getNavigationItems();
    return (<aside className={cn("bg-card border-r border-border transition-all duration-300 flex flex-col h-full", collapsed ? "w-sidebar-collapsed" : "w-sidebar")}>
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && (<div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Stethoscope className="w-4 h-4 text-primary-foreground"/>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">{t('farmPortal')}</span>
              <span className="text-xs text-muted-foreground capitalize">{user?.role ? t(user.role) : ''}</span>
            </div>
          </div>)}
        <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="p-2 h-8 w-8">
          {collapsed ? <Menu className="w-4 h-4"/> : <ChevronLeft className="w-4 h-4"/>}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navigationItems.map((item) => (<li key={item.path}>
              <NavLink to={item.path} className={({ isActive }) => cn("flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors", "hover:bg-accent hover:text-accent-foreground", isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground", collapsed && "justify-center space-x-0")}>
                <item.icon className="w-5 h-5 flex-shrink-0"/>
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            </li>))}
        </ul>
      </nav>

      {/* User Info */}
      {!collapsed && (<div className="p-4 border-t border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-xs font-semibold text-primary-foreground">
                {user?.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.organization}
              </p>
            </div>
          </div>
        </div>)}
    </aside>);
};
export default Sidebar;
