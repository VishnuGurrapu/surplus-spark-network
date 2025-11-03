import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, TrendingUp, Clock, Heart } from "lucide-react";

const DonorHome = () => {
  const stats = [
    { label: "Total Donations", value: "47", icon: Package, color: "text-primary" },
    { label: "People Helped", value: "320", icon: Heart, color: "text-destructive" },
    { label: "Pending Pickups", value: "3", icon: Clock, color: "text-warning" },
    { label: "Impact Score", value: "850", icon: TrendingUp, color: "text-success" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Welcome back, John!</h2>
        <p className="text-muted-foreground">Here's your donation summary and quick actions.</p>
      </div>

      {/* Stats Grid */}
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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to get started</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="h-auto py-6 flex-col gap-2">
            <Package className="w-6 h-6" />
            <span>Donate Surplus</span>
          </Button>
          <Button variant="outline" className="h-auto py-6 flex-col gap-2">
            <Clock className="w-6 h-6" />
            <span>Track Status</span>
          </Button>
          <Button variant="outline" className="h-auto py-6 flex-col gap-2">
            <TrendingUp className="w-6 h-6" />
            <span>View Impact</span>
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Food donation #{i}</p>
                  <p className="text-sm text-muted-foreground">Delivered to Hope Foundation</p>
                </div>
                <span className="text-sm text-success">Completed</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonorHome;
