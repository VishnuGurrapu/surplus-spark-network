import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { getDonorSurplus, Surplus } from "@/lib/api";

const MyDonations = () => {
  const [donations, setDonations] = useState<Surplus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  useEffect(() => {
    fetchDonations();
  }, [statusFilter, categoryFilter]);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: any = {};
      if (statusFilter && statusFilter !== "all") filters.status = statusFilter;
      if (categoryFilter && categoryFilter !== "all") filters.category = categoryFilter;

      const response = await getDonorSurplus(filters);

      if (response.success && response.data) {
        setDonations(response.data);
      } else {
        setError(response.message || "Failed to fetch donations");
      }
    } catch (err: any) {
      console.error('Fetch donations error:', err);
      setError(err.message || "An error occurred while fetching donations");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-success text-white";
      case "in-transit":
        return "bg-primary text-white";
      case "claimed":
        return "bg-secondary";
      case "available":
        return "bg-warning";
      case "expired":
        return "bg-destructive text-white";
      default:
        return "bg-muted";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRecipientName = (donation: Surplus) => {
    if (donation.claimedBy && typeof donation.claimedBy === 'object' && 'name' in donation.claimedBy) {
      return (donation.claimedBy as any).name;
    }
    return donation.status === 'available' ? 'Not claimed yet' : 'N/A';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">My Donations</h2>
        <p className="text-muted-foreground">Track all your past and ongoing donations</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="claimed">Claimed</SelectItem>
              <SelectItem value="in-transit">In Transit</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-48">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="food">Food</SelectItem>
              <SelectItem value="clothing">Clothing</SelectItem>
              <SelectItem value="medical">Medical</SelectItem>
              <SelectItem value="educational">Educational</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Donation History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading donations...</span>
            </div>
          ) : donations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No donations found.</p>
              <p className="text-sm mt-2">Create your first surplus item to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
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
                    <TableRow key={donation._id}>
                      <TableCell className="font-medium">{donation.title}</TableCell>
                      <TableCell className="capitalize">{donation.category}</TableCell>
                      <TableCell>
                        {donation.quantity} {donation.unit}
                      </TableCell>
                      <TableCell>{getRecipientName(donation)}</TableCell>
                      <TableCell>{formatDate(donation.createdAt)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(donation.status)}>
                          {donation.status.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      {!loading && donations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {donations.length}
              </div>
              <p className="text-xs text-muted-foreground">Total Donations</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {donations.filter(d => d.status === 'delivered').length}
              </div>
              <p className="text-xs text-muted-foreground">Delivered</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {donations.filter(d => d.status === 'in-transit' || d.status === 'claimed').length}
              </div>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {donations.filter(d => d.status === 'available').length}
              </div>
              <p className="text-xs text-muted-foreground">Available</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MyDonations;
