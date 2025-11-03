import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, Package, CheckCircle, Clock } from "lucide-react";

const LogisticsHome = () => {
  const stats = [
    { label: "Active Deliveries", value: "3", icon: Truck, color: "text-primary" },
    { label: "Completed Today", value: "7", icon: CheckCircle, color: "text-success" },
    { label: "Available Tasks", value: "12", icon: Package, color: "text-secondary" },
    { label: "Avg. Delivery Time", value: "45 min", icon: Clock, color: "text-warning" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Welcome, Quick Transport!</h2>
        <p className="text-muted-foreground">Manage your deliveries and optimize your routes</p>
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
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to get started</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="h-auto py-6 flex-col gap-2">
            <Package className="w-6 h-6" />
            <span>View Tasks</span>
          </Button>
          <Button variant="outline" className="h-auto py-6 flex-col gap-2">
            <Truck className="w-6 h-6" />
            <span>Active Routes</span>
          </Button>
          <Button variant="outline" className="h-auto py-6 flex-col gap-2">
            <CheckCircle className="w-6 h-6" />
            <span>History</span>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { time: "10:30 AM", task: "Pickup - Green Grocery", location: "Downtown" },
              { time: "12:00 PM", task: "Delivery - Hope Foundation", location: "Eastside" },
              { time: "2:30 PM", task: "Pickup - Fashion Outlet", location: "Mall District" }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">{item.task}</p>
                  <p className="text-sm text-muted-foreground">{item.location}</p>
                </div>
                <span className="text-sm font-medium text-primary">{item.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogisticsHome;
