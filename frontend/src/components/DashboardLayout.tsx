import { ReactNode, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogOut, Home, Plus, Package, TrendingUp, Users, Truck, Settings, QrCode, Trophy, User, AlertCircle, BarChart3, ShieldCheck, Calendar, Award, FileText, Map, CheckCircle, Bell } from "lucide-react";
import { logout, getNotifications, markNotificationAsRead } from "@/lib/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface DashboardLayoutProps {
  children: ReactNode;
  userRole: 'donor' | 'ngo' | 'logistics' | 'admin';
}

const DashboardLayout = ({ children, userRole }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();
      if (response.success && response.data) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleNotificationClick = async (notification: any) => {
    if (!notification.isRead) {
      await markNotificationAsRead(notification._id);
      fetchNotifications();
    }

    // Navigate based on notification type
    if (notification.data?.surplusId) {
      if (userRole === 'donor') {
        navigate('/dashboard/donor/donations');
      } else if (userRole === 'ngo') {
        navigate('/dashboard/ngo/browse');
      }
    }
  };

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
      { path: "/dashboard/ngo/track-requests", label: "Track Requests", icon: QrCode },
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">ShareGood</h1>
            <p className="text-sm text-muted-foreground capitalize">{userRole} Dashboard</p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-2 font-semibold border-b">
                Notifications ({unreadCount} unread)
              </div>
              {notifications.length > 0 ? (
                <div className="max-h-96 overflow-y-auto">
                  {notifications.slice(0, 5).map((notification) => (
                    <DropdownMenuItem
                      key={notification._id}
                      className={`p-3 cursor-pointer ${!notification.isRead ? 'bg-primary/5' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex items-start justify-between">
                          <p className="font-medium text-sm">{notification.title}</p>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-primary rounded-full mt-1" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No notifications
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
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
