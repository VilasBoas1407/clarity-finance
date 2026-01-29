import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Receipt,
  Repeat,
  CreditCard,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const mainNavItems: NavItem[] = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Gastos", url: "/expenses", icon: Receipt },
  { title: "Recorrentes", url: "/recurring", icon: Repeat },
  { title: "Cartões", url: "/cards", icon: CreditCard },
  { title: "Relatórios", url: "/reports", icon: BarChart3, badge: "Pro" },
];

const bottomNavItems: NavItem[] = [
  { title: "Configurações", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (url: string) => {
    if (url === "/") return location.pathname === "/";
    return location.pathname.startsWith(url);
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out sticky top-0",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          {!collapsed && (
            <span className="font-semibold text-lg text-sidebar-accent-foreground tracking-tight">
              FinTrack
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col px-3 py-4 overflow-y-auto">
        <div className="space-y-1">
          {mainNavItems.map((item) => (
            <RouterNavLink
              key={item.url}
              to={item.url}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive(item.url)
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-sidebar-primary/20 text-sidebar-primary">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </RouterNavLink>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom nav */}
        <div className="space-y-1 pt-4 border-t border-sidebar-border">
          {bottomNavItems.map((item) => (
            <RouterNavLink
              key={item.url}
              to={item.url}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive(item.url)
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </RouterNavLink>
          ))}
        </div>
      </nav>

      {/* Collapse button */}
      <div className="p-3 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-full justify-center text-sidebar-muted hover:text-sidebar-accent-foreground hover:bg-sidebar-accent",
            !collapsed && "justify-start px-3"
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 mr-2" />
              <span className="text-xs">Recolher</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
