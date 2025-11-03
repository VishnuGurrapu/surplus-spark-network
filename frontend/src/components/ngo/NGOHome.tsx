import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Package, Users, CheckCircle, Clock, Loader2, AlertCircle } from "lucide-react";
import { getNGORequests, getAvailableSurplus, getNGOImpact, getUser } from "@/lib/api";

const NGOHome = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    requestsFulfilled: 0,
    peopleServed: 0,
    pendingRequests: 0,
    itemsReceived: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const user = getUser();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [impactResponse, requestsResponse, surplusResponse] = await Promise.all([
        getNGOImpact(),
        getNGORequests({}),
        getAvailableSurplus({}),
      ]);

      if (impactResponse.success) {
        const impact = impactResponse.data;
        setStats({
          requestsFulfilled: impact.fulfilledRequests || 0,
          peopleServed: impact.estimatedPeopleServed || 0,
          pendingRequests: impact.totalRequests - impact.fulfilledRequests || 0,
          itemsReceived: impact.receivedItems || 0,
        });
      }

      if (requestsResponse.success && requestsResponse.data) {
        setRecentActivity(requestsResponse.data.slice(0, 3));
      }
    } catch (err: any) {
      console.error('Fetch dashboard error:', err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const statsConfig = [
    { label: "Requests Fulfilled", value: stats.requestsFulfilled, icon: CheckCircle, color: "text-success" },
    { label: "People Served", value: stats.peopleServed, icon: Users, color: "text-primary" },
    { label: "Pending Requests", value: stats.pendingRequests, icon: Clock, color: "text-warning" },
    { label: "Total Items Received", value: stats.itemsReceived, icon: Package, color: "text-secondary" }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Welcome, {user?.name || 'NGO'}!</h2>
        <p className="text-muted-foreground">Track your requests and manage incoming donations</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat, index) => (
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
          <Button className="h-auto py-6 flex-col gap-2" onClick={() => navigate('/dashboard/ngo/browse')}>
            <Package className="w-6 h-6" />
            <span>Browse Surplus</span>
          </Button>
          <Button variant="outline" className="h-auto py-6 flex-col gap-2" onClick={() => navigate('/dashboard/ngo/request')}>
            <Clock className="w-6 h-6" />
            <span>Request Items</span>
          </Button>
          <Button variant="outline" className="h-auto py-6 flex-col gap-2" onClick={() => navigate('/dashboard/ngo/impact')}>
            <CheckCircle className="w-6 h-6" />
            <span>View Impact</span>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((item) => (
                <div key={item._id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} {item.unit} - {item.category}
                    </p>
                  </div>
                  <span className={`text-sm ${
                    item.status === 'fulfilled' ? 'text-success' : 'text-muted-foreground'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No recent activity. Start by browsing available surplus or creating requests!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NGOHome;
