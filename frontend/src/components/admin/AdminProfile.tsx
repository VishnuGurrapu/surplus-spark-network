import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AdminProfile = () => {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Admin Profile</h2>
        <p className="text-muted-foreground">Manage administrator account settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Update admin credentials</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="admin-name">Full Name</Label>
            <Input id="admin-name" defaultValue="Admin User" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-email">Email</Label>
            <Input id="admin-email" type="email" defaultValue="admin@platform.com" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-phone">Phone</Label>
            <Input id="admin-phone" type="tel" defaultValue="+1 234 567 8900" />
          </div>

          <Button className="w-full">Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
            </div>
            <Button variant="outline">Enable</Button>
          </div>
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-medium">Change Password</p>
              <p className="text-sm text-muted-foreground">Update your password regularly</p>
            </div>
            <Button variant="outline">Change</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Admin Permissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            "User Management",
            "Content Moderation",
            "System Configuration",
            "Analytics Access",
            "Verification Control"
          ].map((permission, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span>{permission}</span>
              <span className="text-sm text-success font-medium">Granted</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProfile;
