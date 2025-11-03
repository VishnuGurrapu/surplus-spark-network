import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Package, Clock, Filter } from "lucide-react";

const AvailableSurplus = () => {
  const items = [
    {
      id: "S001",
      name: "Fresh Vegetables",
      category: "Food",
      quantity: "15 kg",
      location: "2.3 km away",
      expiry: "Today",
      donor: "Green Grocery Store"
    },
    {
      id: "S002",
      name: "Winter Jackets",
      category: "Clothing",
      quantity: "25 pieces",
      location: "5.1 km away",
      expiry: "N/A",
      donor: "Fashion Outlet"
    },
    {
      id: "S003",
      name: "Educational Books",
      category: "Education",
      quantity: "100 books",
      location: "3.7 km away",
      expiry: "N/A",
      donor: "City Library"
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Available Surplus</h2>
        <p className="text-muted-foreground">Browse real-time donations available for your organization</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="hygiene">Hygiene</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Max distance (km)" type="number" />
            <Button>Apply Filters</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {items.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">By {item.donor}</p>
                    </div>
                    <Badge>{item.category}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <span>{item.quantity}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{item.location}</span>
                    </div>
                    {item.expiry !== "N/A" && (
                      <div className="flex items-center gap-2 text-sm text-warning">
                        <Clock className="w-4 h-4" />
                        <span>Expires: {item.expiry}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:min-w-[120px]">
                  <Button className="w-full">Request</Button>
                  <Button variant="outline" className="w-full">View Details</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AvailableSurplus;
