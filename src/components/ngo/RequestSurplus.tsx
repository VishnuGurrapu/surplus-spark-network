import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const RequestSurplus = () => {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Request Surplus</h2>
        <p className="text-muted-foreground">Submit a request for items your organization needs</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request Details</CardTitle>
          <CardDescription>Provide information about what you need</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="item-type">Item Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select item type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="books">Books</SelectItem>
                <SelectItem value="hygiene">Hygiene Products</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity Needed</Label>
              <Input id="quantity" type="number" placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilograms</SelectItem>
                  <SelectItem value="pieces">Pieces</SelectItem>
                  <SelectItem value="boxes">Boxes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority Level</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="delivery-location">Delivery Location</Label>
            <Input id="delivery-location" placeholder="Enter delivery address" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="needed-by">Needed By Date</Label>
            <Input id="needed-by" type="date" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose / Justification</Label>
            <Textarea 
              id="purpose" 
              placeholder="Explain why you need these items and how they will be used..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="beneficiaries">Number of Beneficiaries</Label>
            <Input id="beneficiaries" type="number" placeholder="Estimated people served" />
          </div>

          <Button className="w-full" size="lg">
            Submit Request
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestSurplus;
