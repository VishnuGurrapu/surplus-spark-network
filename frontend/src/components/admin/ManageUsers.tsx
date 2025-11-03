import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";

const ManageUsers = () => {
  const donors = [
    { id: "D001", name: "John Doe", email: "john@example.com", donations: 47, status: "Active" },
    { id: "D002", name: "Sarah Johnson", email: "sarah@example.com", donations: 65, status: "Active" },
    { id: "D003", name: "Mike Chen", email: "mike@example.com", donations: 58, status: "Inactive" }
  ];

  const ngos = [
    { id: "N001", name: "Hope Foundation", contact: "Jane Smith", requests: 32, status: "Verified" },
    { id: "N002", name: "Care Center", contact: "Bob Williams", requests: 28, status: "Verified" },
    { id: "N003", name: "New NGO", contact: "Alice Brown", requests: 0, status: "Pending" }
  ];

  const logistics = [
    { id: "L001", name: "Quick Transport", driver: "Mike Johnson", deliveries: 47, rating: 4.8, status: "Active" },
    { id: "L002", name: "Fast Delivery", driver: "Tom Davis", deliveries: 35, rating: 4.6, status: "Active" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Manage Users</h2>
        <p className="text-muted-foreground">CRUD operations for all user types</p>
      </div>

      <Tabs defaultValue="donors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="donors">Donors</TabsTrigger>
          <TabsTrigger value="ngos">NGOs</TabsTrigger>
          <TabsTrigger value="logistics">Logistics</TabsTrigger>
        </TabsList>

        <TabsContent value="donors">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Donor Management</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search donors..." className="pl-10 w-64" />
                  </div>
                  <Button>Add Donor</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Donations</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donors.map((donor) => (
                    <TableRow key={donor.id}>
                      <TableCell className="font-medium">{donor.id}</TableCell>
                      <TableCell>{donor.name}</TableCell>
                      <TableCell>{donor.email}</TableCell>
                      <TableCell>{donor.donations}</TableCell>
                      <TableCell>
                        <Badge variant={donor.status === "Active" ? "default" : "secondary"}>
                          {donor.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ngos">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>NGO Management</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search NGOs..." className="pl-10 w-64" />
                  </div>
                  <Button>Add NGO</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Requests</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ngos.map((ngo) => (
                    <TableRow key={ngo.id}>
                      <TableCell className="font-medium">{ngo.id}</TableCell>
                      <TableCell>{ngo.name}</TableCell>
                      <TableCell>{ngo.contact}</TableCell>
                      <TableCell>{ngo.requests}</TableCell>
                      <TableCell>
                        <Badge variant={ngo.status === "Verified" ? "default" : "secondary"}>
                          {ngo.status === "Verified" ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          {ngo.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {ngo.status === "Pending" && (
                            <Button size="sm" variant="default">Verify</Button>
                          )}
                          <Button size="sm" variant="ghost">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logistics">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Logistics Partner Management</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search partners..." className="pl-10 w-64" />
                  </div>
                  <Button>Add Partner</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Deliveries</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logistics.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell className="font-medium">{partner.id}</TableCell>
                      <TableCell>{partner.name}</TableCell>
                      <TableCell>{partner.driver}</TableCell>
                      <TableCell>{partner.deliveries}</TableCell>
                      <TableCell>{partner.rating} ⭐</TableCell>
                      <TableCell>
                        <Badge>{partner.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageUsers;
