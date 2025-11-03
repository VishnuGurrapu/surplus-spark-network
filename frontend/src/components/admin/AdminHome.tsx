import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, Package, TrendingUp, Truck, Loader2, AlertCircle, BarChart3, ShieldCheck } from "lucide-react";
import { getUser } from "@/lib/api";

const AdminHome = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const user = getUser();

  // Mock stats - in production, fetch from /api/admin/overview
  const stats = {
    totalUsers: 423,
    totalDonors: 328,
    totalNGOs: 45,
    totalLogistics: 18,
    activeDonations: 156,
    completedDeliveries: 1247,
    systemHealth: 98,
  };

  const statsConfig = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-primary" },
    { label: "Active Donations", value: stats.activeDonations, icon: Package, color: "text-success" },
    { label: "Completed Deliveries", value: stats.completedDeliveries, icon: Truck, color: "text-secondary" },
    { label: "System Health", value: `${stats.systemHealth}%`, icon: TrendingUp, color: "text-warning" }
  ];

  const userBreakdown = [
    { label: "Donors", value: stats.totalDonors, color: "bg-primary" },
    { label: "NGOs", value: stats.totalNGOs, color: "bg-success" },
    { label: "Logistics", value: stats.totalLogistics, color: "bg-secondary" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Welcome, {user?.name || 'Admin'}!</h2>
        <p className="text-muted-foreground">Monitor and manage the entire platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>User Distribution</CardTitle>
          <CardDescription>Platform users by role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userBreakdown.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-sm text-muted-foreground">{item.value} users</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color}`}
                    style={{ width: `${(item.value / stats.totalUsers) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button 
            className="h-auto py-6 flex-col gap-2"
            onClick={() => navigate('/dashboard/admin/users')}
          >
            <Users className="w-6 h-6" />
            <span>Manage Users</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto py-6 flex-col gap-2"
            onClick={() => navigate('/dashboard/admin/analytics')}
          >
            <BarChart3 className="w-6 h-6" />
            <span>View Analytics</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto py-6 flex-col gap-2"
            onClick={() => navigate('/dashboard/admin/verification')}
          >
            <ShieldCheck className="w-6 h-6" />
            <span>Verification</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto py-6 flex-col gap-2"
            onClick={() => navigate('/dashboard/admin/forecasting')}
          >
            <TrendingUp className="w-6 h-6" />
            <span>AI Forecasting</span>
          </Button>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-success/10 border border-success/20 rounded-lg">
              <div>
                <p className="font-medium text-success">All Systems Operational</p>
                <p className="text-sm text-muted-foreground">No issues detected</p>
              </div>
              <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
            </div>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Database</p>
                <p className="text-sm text-muted-foreground">Connected</p>
              </div>
              <span className="text-sm text-success">Healthy</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium">API Services</p>
                <p className="text-sm text-muted-foreground">All endpoints responding</p>
              </div>
              <span className="text-sm text-success">Online</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Platform Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium">New User Registrations</p>
                <p className="text-sm text-muted-foreground">Last 24 hours</p>
              </div>
              <span className="text-2xl font-bold text-primary">12</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Donations Created</p>
                <p className="text-sm text-muted-foreground">Last 24 hours</p>
              </div>
              <span className="text-2xl font-bold text-success">28</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Deliveries Completed</p>
                <p className="text-sm text-muted-foreground">Last 24 hours</p>
              </div>
              <span className="text-2xl font-bold text-secondary">45</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminHome;
