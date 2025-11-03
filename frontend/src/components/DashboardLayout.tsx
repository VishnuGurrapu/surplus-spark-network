import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogOut, Home, Plus, Package, TrendingUp, Users, Truck, Settings, QrCode, Trophy, User } from "lucide-react";
import { logout } from "@/lib/api";

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
      { path: "/dashboard/ngo/requests", label: "My Requests", icon: Plus },
      { path: "/dashboard/ngo/impact", label: "Impact", icon: TrendingUp },
    ],
    logistics: [
      { path: "/dashboard/logistics", label: "Overview", icon: Home },
      { path: "/dashboard/logistics/tasks", label: "Available Tasks", icon: Package },
      { path: "/dashboard/logistics/my-tasks", label: "My Tasks", icon: Truck },
      { path: "/dashboard/logistics/performance", label: "Performance", icon: TrendingUp },
    ],
    admin: [
      { path: "/dashboard/admin", label: "Overview", icon: Home },
      { path: "/dashboard/admin/users", label: "Manage Users", icon: Users },
      { path: "/dashboard/admin/analytics", label: "Analytics", icon: TrendingUp },
      { path: "/dashboard/admin/settings", label: "Settings", icon: Settings },
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
          <h1 className="text-2xl font-bold text-primary">Surplus Spark</h1>
          <p className="text-sm text-muted-foreground capitalize">{userRole} Dashboard</p>
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
          className="w-full mt-4"
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
