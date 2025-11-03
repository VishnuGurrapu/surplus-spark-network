import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, TrendingUp, Calendar } from "lucide-react";

const ImpactReports = () => {
  const stats = [
    { label: "Total Items Received", value: "85", icon: Package, color: "text-primary" },
    { label: "People Served", value: "450", icon: Users, color: "text-success" },
    { label: "Active Requests", value: "12", icon: TrendingUp, color: "text-secondary" },
    { label: "Days Active", value: "180", icon: Calendar, color: "text-warning" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Impact Reports</h2>
        <p className="text-muted-foreground">Track your organization's impact and metrics</p>
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
          <CardTitle>Monthly Distribution Trend</CardTitle>
          <CardDescription>Items received over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between gap-2">
            {[30, 45, 55, 70, 60, 85].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-primary to-secondary rounded-t-lg transition-all hover:opacity-80"
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-muted-foreground">
                  {["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i]}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Needs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <div>
                <p className="font-medium">Winter Supplies</p>
                <p className="text-sm text-muted-foreground">Estimated need: 200 items by Feb 1</p>
              </div>
              <span className="text-sm text-warning font-medium">High Priority</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Educational Materials</p>
                <p className="text-sm text-muted-foreground">Estimated need: 150 books by Mar 1</p>
              </div>
              <span className="text-sm text-muted-foreground">Medium Priority</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImpactReports;
