import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const MyRequests = () => {
  const requests = [
    { id: "R001", item: "Food Supplies", quantity: "50 kg", priority: "Urgent", status: "Matched", date: "2024-01-20" },
    { id: "R002", item: "Blankets", quantity: "30 pieces", priority: "High", status: "In Transit", date: "2024-01-18" },
    { id: "R003", item: "Books", quantity: "100 items", priority: "Medium", status: "Delivered", date: "2024-01-15" },
    { id: "R004", item: "Hygiene Kits", quantity: "25 boxes", priority: "High", status: "Requested", date: "2024-01-22" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-success";
      case "In Transit": return "bg-primary";
      case "Matched": return "bg-secondary";
      case "Requested": return "bg-warning";
      default: return "bg-muted";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent": return "text-destructive";
      case "High": return "text-warning";
      case "Medium": return "text-primary";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">My Requests</h2>
        <p className="text-muted-foreground">Track all your requested items and their status</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.id}</TableCell>
                    <TableCell>{request.item}</TableCell>
                    <TableCell>{request.quantity}</TableCell>
                    <TableCell className={getPriorityColor(request.priority)}>
                      {request.priority}
                    </TableCell>
                    <TableCell>{request.date}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
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

export default MyRequests;
