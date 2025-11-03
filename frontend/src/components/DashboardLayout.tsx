import React, { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogOut, Home, Plus, Package, TrendingUp, Users, Truck, Settings, QrCode, Trophy, User, AlertCircle, BarChart3, ShieldCheck, Calendar, Award, FileText, Map, CheckCircle } from "lucide-react";
import { logout } from "@/lib/api";
import ThemeToggle from "@/components/ui/ThemeToggle";

interface DashboardLayoutProps {
  children: ReactNode;
  userRole: 'donor' | 'ngo' | 'logistics' | 'admin';
}

const DashboardLayout = ({ children, userRole }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/select-role");
  };

  const menuConfigs = {
    donor: [
      { path: "/dashboard/donor", label: "Overview", icon: Home },
      { path: "/dashboard/donor/add-surplus", label: "Add Surplus", icon: Plus },
      { path: "/dashboard/donor/donations", label: "My Donations", icon: Package },
      { path: "/dashboard/donor/track", label: "Track Donation", icon: QrCode },
      { path: "/dashboard/donor/impact", label: "Impact", icon: TrendingUp },
      { path: "/dashboard/donor/leaderboard", label: "Leaderboard", icon: Trophy },
      { path: "/dashboard/donor/profile", label: "Profile", icon: User },
    ],
    ngo: [
      { path: "/dashboard/ngo", label: "Overview", icon: Home },
      { path: "/dashboard/ngo/browse", label: "Browse Surplus", icon: Package },
      { path: "/dashboard/ngo/request", label: "Request Items", icon: Plus },
      { path: "/dashboard/ngo/requests", label: "My Requests", icon: Package },
      { path: "/dashboard/ngo/urgent", label: "Urgent Needs", icon: AlertCircle },
      { path: "/dashboard/ngo/impact", label: "Impact", icon: TrendingUp },
      { path: "/dashboard/ngo/leaderboard", label: "Leaderboard", icon: Trophy },
      { path: "/dashboard/ngo/profile", label: "Profile", icon: User },
    ],
    logistics: [
      { path: "/dashboard/logistics", label: "Overview", icon: Home },
      { path: "/dashboard/logistics/tasks", label: "Available Tasks", icon: Package },
      { path: "/dashboard/logistics/active", label: "Active Deliveries", icon: Truck },
      { path: "/dashboard/logistics/completed", label: "Completed", icon: CheckCircle },
      { path: "/dashboard/logistics/map", label: "Route Map", icon: Map },
      { path: "/dashboard/logistics/performance", label: "Performance", icon: TrendingUp },
      { path: "/dashboard/logistics/profile", label: "Profile", icon: User },
    ],
    admin: [
      { path: "/dashboard/admin", label: "Overview", icon: Home },
      { path: "/dashboard/admin/analytics", label: "Analytics", icon: BarChart3 },
      { path: "/dashboard/admin/users", label: "Manage Users", icon: Users },
      { path: "/dashboard/admin/verification", label: "Verification", icon: ShieldCheck },
      { path: "/dashboard/admin/forecasting", label: "AI Forecasting", icon: TrendingUp },
      { path: "/dashboard/admin/seasonal", label: "Seasonal Insights", icon: Calendar },
      { path: "/dashboard/admin/impact", label: "Impact Dashboard", icon: Award },
      { path: "/dashboard/admin/logs", label: "System Logs", icon: FileText },
      { path: "/dashboard/admin/profile", label: "Profile", icon: User },
    ],
  };

  const menuItems = menuConfigs[userRole] || [];

  const isActive = (path: string) => {
    if (path === `/dashboard/${userRole}`) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border p-6 flex flex-col">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Surplus Spark</h1>
              <p className="text-sm text-muted-foreground capitalize">{userRole} Dashboard</p>
            </div>
            <div className="ml-4">
              {/* Theme toggle placed here so it's available on all dashboard pages */}
              {/* Import kept local to avoid affecting server-side code */}
              {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
              {/* @ts-ignore */}
              <React.Suspense>
                {/* Lazy inline import to avoid bundle surprises; component is lightweight */}
                <ThemeToggle />
              </React.Suspense>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  "panel-hover-style hover-indigo-glow",
                  isActive(item.path) && "bg-primary text-primary-foreground"
                )}
                onClick={() => navigate(item.path)}
              >
                <Icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            );
          })}
        </nav>

        <Button
          variant="outline"
          className="w-full mt-4 panel-hover-style hover-indigo-glow"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
