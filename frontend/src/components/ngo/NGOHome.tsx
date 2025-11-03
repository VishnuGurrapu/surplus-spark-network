import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Users, CheckCircle, Clock } from "lucide-react";

const NGOHome = () => {
  const stats = [
    { label: "Requests Fulfilled", value: "32", icon: CheckCircle, color: "text-success" },
    { label: "People Served", value: "450", icon: Users, color: "text-primary" },
    { label: "Pending Requests", value: "5", icon: Clock, color: "text-warning" },
    { label: "Total Items Received", value: "85", icon: Package, color: "text-secondary" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Welcome, Hope Foundation!</h2>
        <p className="text-muted-foreground">Track your requests and manage incoming donations</p>
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
          <CardDescription>Manage your requests and donations</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="h-auto py-6 flex-col gap-2">
            <Package className="w-6 h-6" />
            <span>Browse Surplus</span>
          </Button>
          <Button variant="outline" className="h-auto py-6 flex-col gap-2">
            <Clock className="w-6 h-6" />
            <span>Request Items</span>
          </Button>
          <Button variant="outline" className="h-auto py-6 flex-col gap-2">
            <CheckCircle className="w-6 h-6" />
            <span>Track Status</span>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Donations Received</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Food Package #{i}</p>
                  <p className="text-sm text-muted-foreground">From generous donor</p>
                </div>
                <span className="text-sm text-success">Delivered</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NGOHome;
