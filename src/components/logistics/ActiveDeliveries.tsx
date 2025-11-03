import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MapPin, Package, Truck } from "lucide-react";

const ActiveDeliveries = () => {
  const deliveries = [
    {
      id: "D105",
      item: "Fresh Vegetables",
      status: "In Transit",
      from: "Green Grocery",
      to: "Hope Foundation",
      progress: 65
    },
    {
      id: "D106",
      item: "Winter Clothes",
      status: "Picked Up",
      from: "Fashion Outlet",
      to: "Care Center",
      progress: 30
    },
    {
      id: "D107",
      item: "Books",
      status: "En Route to Pickup",
      from: "City Library",
      to: "Learning Hub",
      progress: 15
    }
  ];

  const timeline = [
    { label: "Assigned", icon: Package, completed: true },
    { label: "En Route", icon: Truck, completed: true },
    { label: "Picked Up", icon: CheckCircle2, completed: true },
    { label: "In Transit", icon: Truck, completed: false },
    { label: "Delivered", icon: MapPin, completed: false }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Active Deliveries</h2>
        <p className="text-muted-foreground">Monitor your ongoing deliveries in real-time</p>
      </div>

      {deliveries.map((delivery) => (
        <Card key={delivery.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Delivery {delivery.id}</CardTitle>
              <span className="text-sm font-medium text-primary">{delivery.status}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Item</p>
                <p className="font-medium">{delivery.item}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Route</p>
                <p className="font-medium">{delivery.from} → {delivery.to}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span className="font-medium">{delivery.progress}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
                  style={{ width: `${delivery.progress}%` }}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" className="flex-1">Update Status</Button>
              <Button size="sm" variant="outline" className="flex-1">View Map</Button>
              <Button size="sm" variant="outline">Contact</Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <CardTitle>Delivery Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {timeline.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.completed ? "bg-success" : "bg-muted"
                  }`}>
                    {step.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    ) : (
                      <step.icon className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  {index < timeline.length - 1 && (
                    <div className={`absolute left-1/2 top-10 w-0.5 h-8 -ml-px ${
                      step.completed ? "bg-success" : "bg-muted"
                    }`} />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <h4 className="font-semibold">{step.label}</h4>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActiveDeliveries;
