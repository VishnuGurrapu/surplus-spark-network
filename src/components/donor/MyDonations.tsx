import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const MyDonations = () => {
  const donations = [
    { id: "D001", item: "Fresh Vegetables", category: "Food", quantity: "5 kg", status: "Delivered", date: "2024-01-15", ngo: "Hope Foundation" },
    { id: "D002", item: "Winter Clothes", category: "Clothing", quantity: "20 pieces", status: "In Transit", date: "2024-01-18", ngo: "Care Center" },
    { id: "D003", item: "Books", category: "Education", quantity: "50 books", status: "Picked Up", date: "2024-01-20", ngo: "Learning Hub" },
    { id: "D004", item: "Hygiene Kits", category: "Hygiene", quantity: "10 boxes", status: "Pending", date: "2024-01-22", ngo: "Pending Match" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-success";
      case "In Transit":
        return "bg-primary";
      case "Picked Up":
        return "bg-secondary";
      case "Pending":
        return "bg-warning";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">My Donations</h2>
        <p className="text-muted-foreground">Track all your past and ongoing donations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Donation History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell className="font-medium">{donation.id}</TableCell>
                    <TableCell>{donation.item}</TableCell>
                    <TableCell>{donation.category}</TableCell>
                    <TableCell>{donation.quantity}</TableCell>
                    <TableCell>{donation.ngo}</TableCell>
                    <TableCell>{donation.date}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(donation.status)}>
                        {donation.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyDonations;
