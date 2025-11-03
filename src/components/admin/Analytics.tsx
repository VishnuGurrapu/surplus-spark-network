import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Package, Users, Truck } from "lucide-react";

const Analytics = () => {
  const categories = [
    { name: "Food", value: 45, color: "bg-blue-500" },
    { name: "Clothing", value: 25, color: "bg-green-500" },
    { name: "Books", value: 15, color: "bg-yellow-500" },
    { name: "Hygiene", value: 10, color: "bg-purple-500" },
    { name: "Other", value: 5, color: "bg-gray-500" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Platform Analytics</h2>
        <p className="text-muted-foreground">Comprehensive insights and trends</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Surplus Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-end justify-between gap-2">
              {[40, 65, 55, 75, 80, 70].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-gradient-to-t from-primary to-secondary rounded-t-lg"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-success" />
              Demand Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-end justify-between gap-2">
              {[50, 60, 70, 65, 75, 85].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-gradient-to-t from-success to-secondary rounded-t-lg"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-warning" />
              Logistics Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-end justify-between gap-2">
              {[60, 70, 75, 80, 85, 90].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-gradient-to-t from-warning to-secondary rounded-t-lg"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Distribution</CardTitle>
          <CardDescription>Donation breakdown by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{category.name}</span>
                  <span className="text-sm text-muted-foreground">{category.value}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${category.color}`}
                    style={{ width: `${category.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Peak Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 flex items-end justify-between gap-1">
              {[30, 40, 60, 80, 95, 90, 70, 50, 40, 35, 30, 25].map((height, i) => (
                <div key={i} className="flex-1 bg-primary/20 rounded-t" style={{ height: `${height}%` }} />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>12 AM</span>
              <span>6 AM</span>
              <span>12 PM</span>
              <span>6 PM</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Regions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { region: "Downtown", count: 145 },
              { region: "Eastside", count: 120 },
              { region: "Westside", count: 98 },
              { region: "North District", count: 87 }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="font-medium">{item.region}</span>
                <span className="text-sm text-muted-foreground">{item.count} donations</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
