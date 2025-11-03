import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, Package, Clock, Filter, Loader2, AlertCircle } from "lucide-react";
import { getAvailableSurplus, claimSurplus, Surplus } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const AvailableSurplus = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Surplus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [claiming, setClaiming] = useState<string | null>(null);

  useEffect(() => {
    fetchSurplus();
  }, []);

  const fetchSurplus = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: any = {};
      if (categoryFilter && categoryFilter !== "all") filters.category = categoryFilter;
      if (searchFilter) filters.search = searchFilter;

      const response = await getAvailableSurplus(filters);

      if (response.success && response.data) {
        setItems(response.data);
      } else {
        setError(response.message || "Failed to fetch surplus items");
      }
    } catch (err: any) {
      console.error('Fetch surplus error:', err);
      setError(err.message || "An error occurred while fetching surplus");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    fetchSurplus();
  };

  const handleClaim = async (item: Surplus) => {
    try {
      setClaiming(item._id);

      // You would typically show a dialog to get delivery location
      // For now, using a default location
      const deliveryLocation = {
        address: "NGO Headquarters" // In production, get this from user input
      };

      const response = await claimSurplus(item._id, deliveryLocation);

      if (response.success) {
        toast({
          title: "Success!",
          description: "Surplus item claimed successfully",
        });

        // Refresh the list
        fetchSurplus();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to claim surplus",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error('Claim surplus error:', err);
      toast({
        title: "Error",
        description: err.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setClaiming(null);
    }
  };

  const getDonorName = (donor: any) => {
    if (donor && typeof donor === 'object' && 'name' in donor) {
      return donor.name;
    }
    return 'Unknown Donor';
  };

  const getDonorLocation = (donor: any) => {
    if (donor && typeof donor === 'object' && 'location' in donor) {
      return donor.location;
    }
    return 'Location not available';
  };

  const formatExpiry = (expiryDate?: string) => {
    if (!expiryDate) return "N/A";
    
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 0) return "Expired";
    return `${diffDays} days`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading available surplus...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Available Surplus</h2>
        <p className="text-muted-foreground">Browse real-time donations available for your organization</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
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
            <Input 
              placeholder="Search items..." 
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
            <Button onClick={handleApplyFilters}>Apply Filters</Button>
          </div>
        </CardContent>
      </Card>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>No surplus items available at the moment</p>
            <p className="text-sm mt-2">Check back later or adjust your filters</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {items.map((item) => (
            <Card key={item._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">By {getDonorName(item.donorId)}</p>
                      </div>
                      <Badge>{item.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <span>{item.quantity} {item.unit}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{item.location.address}</span>
                      </div>
                      {item.expiryDate && (
                        <div className="flex items-center gap-2 text-sm text-warning">
                          <Clock className="w-4 h-4" />
                          <span>Expires: {formatExpiry(item.expiryDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 md:min-w-[120px]">
                    <Button 
                      className="w-full" 
                      onClick={() => handleClaim(item)}
                      disabled={claiming === item._id}
                    >
                      {claiming === item._id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Claiming...
                        </>
                      ) : (
                        "Request"
                      )}
                    </Button>
                    <Button variant="outline" className="w-full">View Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableSurplus;
