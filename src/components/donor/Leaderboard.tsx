import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, TrendingUp } from "lucide-react";

const Leaderboard = () => {
  const topDonors = [
    { rank: 1, name: "Sarah Johnson", points: 1250, donations: 65, icon: Trophy, color: "text-yellow-500" },
    { rank: 2, name: "Mike Chen", points: 1180, donations: 58, icon: Medal, color: "text-gray-400" },
    { rank: 3, name: "Emma Williams", points: 1050, donations: 52, icon: Award, color: "text-orange-600" },
    { rank: 4, name: "John Doe (You)", points: 850, donations: 47, icon: null, color: "text-primary" },
    { rank: 5, name: "Alex Kumar", points: 720, donations: 39, icon: null, color: "" },
    { rank: 6, name: "Lisa Anderson", points: 680, donations: 35, icon: null, color: "" },
    { rank: 7, name: "David Park", points: 615, donations: 31, icon: null, color: "" },
    { rank: 8, name: "Sophie Martinez", points: 590, donations: 28, icon: null, color: "" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Leaderboard</h2>
        <p className="text-muted-foreground">Top contributors making a difference</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Donors This Month</CardTitle>
          <CardDescription>Ranked by impact points and contributions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topDonors.map((donor) => (
              <div
                key={donor.rank}
                className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                  donor.name.includes("You")
                    ? "bg-primary/10 border-2 border-primary"
                    : "bg-muted hover:bg-muted/70"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 min-w-[60px]">
                    {donor.icon ? (
                      <donor.icon className={`w-6 h-6 ${donor.color}`} />
                    ) : (
                      <span className="text-2xl font-bold text-muted-foreground">
                        {donor.rank}
                      </span>
                    )}
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
            <p className="text-3xl font-bold">#4</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <TrendingUp className="w-12 h-12 mx-auto mb-3 text-success" />
            <h3 className="font-semibold mb-1">Points to Next Rank</h3>
            <p className="text-3xl font-bold">200</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Award className="w-12 h-12 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-1">Total Points</h3>
            <p className="text-3xl font-bold">850</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;
