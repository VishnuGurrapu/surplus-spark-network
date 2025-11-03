import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trophy, Medal, Award, TrendingUp, Info } from "lucide-react";

const Leaderboard = () => {
  // Note: This would need a new backend endpoint GET /api/donor/leaderboard
  // For now, showing placeholder

  const topDonors = [
    { rank: 1, name: "Sarah Johnson", points: 1250, donations: 65, icon: Trophy, color: "text-yellow-500" },
    { rank: 2, name: "Mike Chen", points: 1180, donations: 58, icon: Medal, color: "text-gray-400" },
    { rank: 3, name: "Emma Williams", points: 1050, donations: 52, icon: Award, color: "text-orange-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Leaderboard</h2>
        <p className="text-muted-foreground">Top contributors making a difference</p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Leaderboard feature is coming soon! This will show real-time rankings based on your impact.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Top Donors (Preview)</CardTitle>
          <CardDescription>Ranked by impact points and contributions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topDonors.map((donor) => (
              <div
                key={donor.rank}
                className="flex items-center justify-between p-4 rounded-lg bg-muted"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 min-w-[60px]">
                    <donor.icon className={`w-6 h-6 ${donor.color}`} />
                  </div>
                  <div>
                    <p className="font-semibold">{donor.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {donor.donations} donations
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {donor.points} pts
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <Trophy className="w-12 h-12 mx-auto mb-3 text-yellow-500" />
            <h3 className="font-semibold mb-1">Your Rank</h3>
            <p className="text-3xl font-bold">Coming Soon</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <TrendingUp className="w-12 h-12 mx-auto mb-3 text-success" />
            <h3 className="font-semibold mb-1">Points to Next Rank</h3>
            <p className="text-3xl font-bold">-</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Award className="w-12 h-12 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-1">Total Points</h3>
            <p className="text-3xl font-bold">-</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;
