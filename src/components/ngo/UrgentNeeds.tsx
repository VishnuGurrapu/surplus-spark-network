import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, Users } from "lucide-react";

const UrgentNeeds = () => {
  const urgentItems = [
    {
      title: "50 Meals Needed Today",
      description: "Emergency food supply for community shelter",
      beneficiaries: 50,
      deadline: "6 hours",
      priority: "Critical"
    },
    {
      title: "Winter Blankets",
      description: "30 blankets needed for homeless shelter",
      beneficiaries: 30,
      deadline: "24 hours",
      priority: "Urgent"
    },
    {
      title: "Medical Supplies",
      description: "First aid kits and basic medicines",
      beneficiaries: 100,
      deadline: "48 hours",
      priority: "High"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <AlertCircle className="w-8 h-8 text-destructive" />
          Urgent Needs
        </h2>
        <p className="text-muted-foreground">High-priority items needed immediately</p>
      </div>

      <div className="grid gap-6">
        {urgentItems.map((item, index) => (
          <Card 
            key={index} 
            className="border-2 border-destructive/20 bg-destructive/5 hover:shadow-xl transition-shadow"
          >
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-4">
                    <AlertCircle className="w-6 h-6 text-destructive mt-1" />
                    <div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground mb-3">{item.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>{item.beneficiaries} people</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-destructive" />
                          <span className="text-destructive font-medium">{item.deadline} left</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:min-w-[140px]">
                  <Button size="lg" className="w-full bg-destructive hover:bg-destructive/90">
                    Request Now
                  </Button>
                  <span className="text-center text-xs font-medium text-destructive">
                    {item.priority} Priority
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-primary" />
            <h3 className="text-lg font-semibold mb-2">Set Up Urgent Alerts</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get notified when matching donations become available for your urgent needs
            </p>
            <Button variant="outline">Configure Alerts</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UrgentNeeds;
