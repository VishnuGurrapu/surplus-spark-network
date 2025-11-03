import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QrCode, Search, CheckCircle2, Package, Truck, MapPin } from "lucide-react";

const TrackDonation = () => {
  const timeline = [
    { label: "Donated", icon: Package, completed: true, date: "Jan 22, 10:30 AM" },
    { label: "Picked Up", icon: Truck, completed: true, date: "Jan 22, 2:15 PM" },
    { label: "In Transit", icon: Truck, completed: true, date: "Jan 22, 3:45 PM" },
    { label: "Delivered", icon: MapPin, completed: false, date: "Expected: Jan 23" },
  ];

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Track Donation</h2>
        <p className="text-muted-foreground">Monitor your donation's journey in real-time</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enter Tracking Details</CardTitle>
          <CardDescription>Use donation ID or scan QR code to track</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input placeholder="Enter Donation ID (e.g., D001)" className="flex-1" />
            <Button>
              <Search className="w-4 h-4 mr-2" />
              Track
            </Button>
          </div>
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-3">OR</p>
            <Button variant="outline">
              <QrCode className="w-4 h-4 mr-2" />
              Scan QR Code
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Donation D002 - Winter Clothes</CardTitle>
          <CardDescription>Tracking live status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
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
                    <div className={`absolute left-1/2 top-10 w-0.5 h-12 -ml-px ${
                      step.completed ? "bg-success" : "bg-muted"
                    }`} />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <h4 className="font-semibold mb-1">{step.label}</h4>
                  <p className="text-sm text-muted-foreground">{step.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <QrCode className="w-8 h-8 text-primary" />
            <div>
              <p className="font-medium">Blockchain Verified</p>
              <p className="text-sm text-muted-foreground">
                This donation is secured on the blockchain for complete transparency
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrackDonation;
