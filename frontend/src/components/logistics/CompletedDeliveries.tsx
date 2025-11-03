import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Star } from "lucide-react";

const CompletedDeliveries = () => {
  const completed = [
    { id: "D101", item: "Food Package", route: "Downtown → Eastside", date: "2024-01-22", time: "38 min", rating: 5, earning: "$25" },
    { id: "D102", item: "Clothing", route: "Mall → Westside", date: "2024-01-22", time: "45 min", rating: 5, earning: "$35" },
    { id: "D103", item: "Books", route: "Library → School", date: "2024-01-21", time: "30 min", rating: 4, earning: "$20" },
    { id: "D104", item: "Supplies", route: "Store → Center", date: "2024-01-21", time: "52 min", rating: 5, earning: "$30" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Completed Deliveries</h2>
        <p className="text-muted-foreground">View your delivery history and earnings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Delivery History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time Taken</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Earning</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completed.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell className="font-medium">{delivery.id}</TableCell>
                    <TableCell>{delivery.item}</TableCell>
                    <TableCell>{delivery.route}</TableCell>
                    <TableCell>{delivery.date}</TableCell>
                    <TableCell>{delivery.time}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <span>{delivery.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-success/10 text-success">
                        {delivery.earning}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost">Details</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Total Earnings</p>
            <p className="text-3xl font-bold text-success">$1,250</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Avg. Rating</p>
            <p className="text-3xl font-bold">4.8</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Completed</p>
            <p className="text-3xl font-bold">47</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompletedDeliveries;
