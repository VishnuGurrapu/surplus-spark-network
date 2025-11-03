import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Maximize2, Map } from "lucide-react";

const RouteMap = () => {
  const waypoints = [
    { name: "Green Grocery Store", address: "123 Main St", type: "pickup", time: "10:30 AM" },
    { name: "Hope Foundation", address: "456 Community Ave", type: "delivery", time: "11:15 AM" },
    { name: "Fashion Outlet", address: "789 Fashion St", type: "pickup", time: "12:00 PM" },
    { name: "Care Center", address: "321 Support Rd", type: "delivery", time: "12:45 PM" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Route Map</h2>
        <p className="text-muted-foreground">View your delivery routes and navigation</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Delivery Route</CardTitle>
          <CardDescription>Your optimized delivery path for today</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Map Placeholder */}
          <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
            <div className="text-center z-10">
              <Map className="w-16 h-16 mx-auto mb-4 text-primary opacity-50" />
              <p className="text-lg font-medium mb-2">Interactive Map Coming Soon</p>
              <p className="text-sm text-muted-foreground mb-4">
                Google Maps API integration will be available soon
              </p>
              <Button variant="outline" disabled>
                <Navigation className="w-4 h-4 mr-2" />
                Open in Maps
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Route Waypoints</CardTitle>
          <CardDescription>Stops on your delivery route</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {waypoints.map((waypoint, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    waypoint.type === "pickup" ? "bg-primary" : "bg-success"
                  }`}>
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  {index < waypoints.length - 1 && (
                    <div className="absolute left-1/2 top-10 w-0.5 h-8 -ml-px bg-border" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h4 className="font-semibold">{waypoint.name}</h4>
                      <p className="text-sm text-muted-foreground">{waypoint.address}</p>
                    </div>
                    <span className="text-sm font-medium text-primary">{waypoint.time}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    waypoint.type === "pickup" 
                      ? "bg-primary/10 text-primary" 
                      : "bg-success/10 text-success"
                  }`}>
                    {waypoint.type === "pickup" ? "Pickup" : "Delivery"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Navigation className="w-8 h-8 text-primary" />
            <div>
              <p className="font-medium">AI-Optimized Route</p>
              <p className="text-sm text-muted-foreground">
                This route is optimized to minimize distance and time based on traffic patterns
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RouteMap;
