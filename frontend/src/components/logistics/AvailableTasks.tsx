import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, Package, Clock, Loader2, AlertCircle, Truck, User } from "lucide-react";
import { getAvailableTasks, acceptTask, Task } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const AvailableTasks = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAvailableTasks();

      if (response.success && response.data) {
        setTasks(response.data);
      } else {
        setError(response.message || "Failed to fetch tasks");
      }
    } catch (err: any) {
      console.error('Fetch tasks error:', err);
      setError(err.message || "An error occurred while fetching tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptTask = async (taskId: string) => {
    try {
      setAccepting(taskId);

      const response = await acceptTask(taskId);

      if (response.success) {
        toast({
          title: "Success!",
          description: "Task accepted successfully",
        });
        fetchTasks(); // Refresh the list
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to accept task",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error('Accept task error:', err);
      toast({
        title: "Error",
        description: err.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setAccepting(null);
    }
  };

  const getDonorName = (donor: any) => {
    if (donor && typeof donor === 'object' && 'name' in donor) {
      return donor.name;
    }
    return 'Unknown';
  };

  const getNGOName = (ngo: any) => {
    if (ngo && typeof ngo === 'object' && 'name' in ngo) {
      return ngo.name;
    }
    return 'Unknown';
  };

  const getSurplusTitle = (surplus: any) => {
    if (surplus && typeof surplus === 'object' && 'title' in surplus) {
      return surplus.title;
    }
    return 'Surplus Item';
  };

  const getSurplusDetails = (surplus: any) => {
    if (surplus && typeof surplus === 'object') {
      return `${surplus.quantity || 0} ${surplus.unit || 'units'}`;
    }
    return '';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not scheduled";
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading available tasks...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Available Tasks</h2>
        <p className="text-muted-foreground">Browse and accept delivery tasks</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {tasks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Truck className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>No tasks available at the moment</p>
            <p className="text-sm mt-2">Check back later for new delivery opportunities</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {tasks.map((task) => (
            <Card key={task._id} className="hover:shadow-lg transition-shadow border-2">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  {/* Left Section - Task Details */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Package className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{getSurplusTitle(task.surplusId)}</h3>
                        <p className="text-sm text-muted-foreground">
                          {getSurplusDetails(task.surplusId)}
                        </p>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {task.status}
                      </Badge>
                    </div>

                    {/* Pickup & Delivery Info */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-3 bg-muted rounded-lg space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <MapPin className="w-4 h-4 text-success" />
                          Pickup
                        </div>
                        <div className="text-sm">
                          <p className="font-medium">{getDonorName(task.donorId)}</p>
                          <p className="text-muted-foreground">
                            {task.pickupLocation.address}
                          </p>
                          <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span className="text-xs">{formatDate(task.scheduledPickup)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-muted rounded-lg space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <MapPin className="w-4 h-4 text-destructive" />
                          Delivery
                        </div>
                        <div className="text-sm">
                          <p className="font-medium">{getNGOName(task.ngoId)}</p>
                          <p className="text-muted-foreground">
                            {task.deliveryLocation.address}
                          </p>
                          <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span className="text-xs">{formatDate(task.scheduledDelivery)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Actions */}
                  <div className="flex flex-col gap-2 lg:min-w-[140px] justify-center">
                    <Button 
                      className="w-full"
                      onClick={() => handleAcceptTask(task._id)}
                      disabled={accepting === task._id}
                    >
                      {accepting === task._id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Accepting...
                        </>
                      ) : (
                        <>
                          <Truck className="w-4 h-4 mr-2" />
                          Accept Task
                        </>
                      )}
                    </Button>
                    <Button variant="outline" className="w-full">
                      View Route
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {!loading && tasks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{tasks.length}</div>
                  <p className="text-xs text-muted-foreground">Available Tasks</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-warning/10 rounded-full">
                  <Clock className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {tasks.filter(t => t.status === 'pending').length}
                  </div>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-success/10 rounded-full">
                  <Truck className="w-6 h-6 text-success" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {tasks.filter(t => t.status === 'assigned').length}
                  </div>
                  <p className="text-xs text-muted-foreground">Ready for Pickup</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AvailableTasks;
