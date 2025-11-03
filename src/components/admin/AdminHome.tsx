import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, Truck, TrendingUp, AlertCircle } from "lucide-react";

const AdminHome = () => {
  const stats = [
    { label: "Total Donations", value: "347", change: "+12%", icon: Package, color: "text-primary" },
    { label: "Active Users", value: "1,234", change: "+8%", icon: Users, color: "text-success" },
    { label: "In Transit", value: "45", change: "+5%", icon: Truck, color: "text-secondary" },
    { label: "Platform Growth", value: "23%", change: "+3%", icon: TrendingUp, color: "text-warning" }
  ];

  const recentAlerts = [
    { type: "warning", message: "High demand for food supplies in District 5", time: "10 mins ago" },
    { type: "info", message: "New NGO registration pending verification", time: "25 mins ago" },
    { type: "success", message: "Delivery efficiency increased by 15%", time: "1 hour ago" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">System Overview</h2>
        <p className="text-muted-foreground">Monitor platform activity and key metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <p className="text-xs text-success">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Live Map</CardTitle>
            <CardDescription>Real-time surplus distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
              <div className="text-center z-10">
                <Package className="w-12 h-12 mx-auto mb-3 text-primary" />
                <p className="font-medium">Interactive Distribution Map</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Live tracking of all donations and deliveries
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-warning" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAlerts.map((alert, index) => (
                <div key={index} className="flex gap-3 p-3 bg-muted rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    alert.type === "warning" ? "bg-warning" :
                    alert.type === "success" ? "bg-success" : "bg-primary"
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Platform Activity</CardTitle>
          <CardDescription>Last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-end justify-between gap-2">
            {[65, 78, 72, 85, 90, 88, 95].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-primary to-secondary rounded-t-lg transition-all hover:opacity-80"
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-muted-foreground">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminHome;
