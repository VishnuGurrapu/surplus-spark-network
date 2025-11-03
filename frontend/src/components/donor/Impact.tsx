import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, TrendingUp, Award } from "lucide-react";

const Impact = () => {
  const stats = [
    { label: "People Fed", value: "320", icon: Users, color: "text-primary" },
    { label: "CO₂ Saved", value: "180 kg", icon: TrendingUp, color: "text-success" },
    { label: "Items Donated", value: "47", icon: Heart, color: "text-destructive" },
    { label: "Impact Points", value: "850", icon: Award, color: "text-warning" },
  ];

  const badges = [
    { name: "Rising Star", description: "Completed 10 donations", earned: true },
    { name: "Eco Warrior", description: "Saved 100kg CO₂", earned: true },
    { name: "Community Hero", description: "Helped 500 people", earned: false },
    { name: "Consistency Champion", description: "30 consecutive days", earned: false },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Your Impact</h2>
        <p className="text-muted-foreground">See the difference you're making in the community</p>
      </div>

      {/* Impact Stats */}
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

      {/* Impact Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Impact Trend</CardTitle>
          <CardDescription>Your donation activity over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between gap-2">
            {[40, 65, 45, 80, 70, 90].map((height, i) => (
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

      {/* Badges & Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
          <CardDescription>Badges you've earned on your journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {badges.map((badge, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 transition-all ${
                  badge.earned
                    ? "border-primary bg-primary/5"
                    : "border-muted bg-muted/20 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold">{badge.name}</h4>
                  {badge.earned && <Badge variant="default">Earned</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{badge.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Impact Summary */}
      <Card className="border-success/20 bg-success/5">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">120 People Fed This Month</h3>
            <p className="text-muted-foreground">
              Your contributions have made a real difference. Keep up the amazing work!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Impact;
