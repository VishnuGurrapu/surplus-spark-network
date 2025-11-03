import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const NGOProfile = () => {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Organization Profile</h2>
        <p className="text-muted-foreground">Manage your organization details</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organization Information</CardTitle>
          <CardDescription>Update your NGO details and service area</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="org-name">Organization Name</Label>
            <Input id="org-name" defaultValue="Hope Foundation" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="registration">Registration Number</Label>
            <Input id="registration" defaultValue="NGO-12345" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-person">Contact Person</Label>
            <Input id="contact-person" defaultValue="Jane Smith" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="contact@hopefoundation.org" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" defaultValue="+1 234 567 8900" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Service Address</Label>
            <Input id="address" defaultValue="123 Community St, City, State" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="service-area">Service Area (km radius)</Label>
            <Input id="service-area" type="number" defaultValue="25" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="about">About Organization</Label>
            <Textarea 
              id="about" 
              rows={4}
              defaultValue="We are dedicated to serving the community by providing essential resources to those in need."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="focus-areas">Focus Areas</Label>
            <Input id="focus-areas" defaultValue="Food Security, Shelter, Education" />
          </div>

          <Button className="w-full">Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NGOProfile;
