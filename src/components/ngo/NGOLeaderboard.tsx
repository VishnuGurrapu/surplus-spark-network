import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";

const NGOLeaderboard = () => {
  const topNGOs = [
    { rank: 1, name: "Community Care Center", points: 2150, requests: 95, icon: Trophy, color: "text-yellow-500" },
    { rank: 2, name: "Hope Foundation", points: 1980, requests: 82, icon: Medal, color: "text-gray-400" },
    { rank: 3, name: "Helping Hands", points: 1750, requests: 71, icon: Award, color: "text-orange-600" },
    { rank: 4, name: "Your Organization", points: 1420, requests: 60, icon: null, color: "text-primary" },
    { rank: 5, name: "Food Bank Alliance", points: 1280, requests: 53, icon: null, color: "" },
    { rank: 6, name: "Shelter Support", points: 1150, requests: 48, icon: null, color: "" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Leaderboard</h2>
        <p className="text-muted-foreground">Top NGOs by requests fulfilled and community impact</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Organizations This Month</CardTitle>
          <CardDescription>Ranked by impact points and successful requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topNGOs.map((ngo) => (
              <div
                key={ngo.rank}
                className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                  ngo.name.includes("Your")
                    ? "bg-primary/10 border-2 border-primary"
                    : "bg-muted hover:bg-muted/70"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 min-w-[60px]">
                    {ngo.icon ? (
                      <ngo.icon className={`w-6 h-6 ${ngo.color}`} />
                    ) : (
                      <span className="text-2xl font-bold text-muted-foreground">
                        {ngo.rank}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{ngo.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {ngo.requests} fulfilled requests
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {ngo.points} pts
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NGOLeaderboard;
