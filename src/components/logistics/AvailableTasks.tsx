import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Package, Clock, ArrowRight } from "lucide-react";

const AvailableTasks = () => {
  const tasks = [
    {
      id: "T001",
      type: "Pickup & Delivery",
      from: "Green Grocery Store",
      fromLocation: "123 Main St",
      to: "Hope Foundation",
      toLocation: "456 Community Ave",
      distance: "4.2 km",
      items: "Fresh Vegetables - 15 kg",
      priority: "High",
      payment: "$25"
    },
    {
      id: "T002",
      type: "Pickup & Delivery",
      from: "Fashion Outlet",
      fromLocation: "789 Fashion St",
      to: "Care Center",
      toLocation: "321 Support Rd",
      distance: "6.8 km",
      items: "Winter Jackets - 25 pieces",
      priority: "Medium",
      payment: "$35"
    },
    {
      id: "T003",
      type: "Pickup & Delivery",
      from: "City Library",
      fromLocation: "101 Book Ave",
      to: "Learning Hub",
      toLocation: "202 Education St",
      distance: "3.5 km",
      items: "Educational Books - 100 items",
      priority: "Low",
      payment: "$20"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-destructive";
      case "Medium": return "bg-warning";
      default: return "bg-muted";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Available Tasks</h2>
        <p className="text-muted-foreground">Accept delivery tasks and start earning</p>
      </div>

      <div className="grid gap-6">
        {tasks.map((task) => (
          <Card key={task.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{task.type}</h3>
                      <p className="text-sm text-muted-foreground">Task ID: {task.id}</p>
                    </div>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-medium">{task.from}</p>
                        <p className="text-sm text-muted-foreground">{task.fromLocation}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 ml-7">
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{task.distance}</span>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-success mt-1" />
                      <div>
                        <p className="font-medium">{task.to}</p>
                        <p className="text-sm text-muted-foreground">{task.toLocation}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{task.items}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 lg:min-w-[140px] justify-between">
                  <div className="text-center p-4 bg-success/10 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Earning</p>
                    <p className="text-2xl font-bold text-success">{task.payment}</p>
                  </div>
                  <Button className="w-full">Accept Task</Button>
                  <Button variant="outline" className="w-full">View Route</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AvailableTasks;
