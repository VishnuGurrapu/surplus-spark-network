import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, Package, Loader2, AlertCircle, CheckCircle, CheckCircle2, Truck } from "lucide-react";
import { getMyTasks, updateTaskStatus, Task } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const ActiveDeliveries = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchActiveTasks();
  }, []);

  const fetchActiveTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getMyTasks({ status: 'assigned' });

      if (response.success && response.data) {
        setTasks(response.data);
      } else {
        setError(response.message || "Failed to fetch active deliveries");
      }
    } catch (err: any) {
      console.error('Fetch tasks error:', err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPickedUp = async (taskId: string) => {
    try {
      setUpdating(taskId);

      const response = await updateTaskStatus(taskId, 'picked-up');

      if (response.success) {
        toast({
          title: "Success!",
          description: "Item marked as picked up",
        });
        fetchActiveTasks();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update status",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const handleMarkDelivered = async (taskId: string) => {
    try {
      setUpdating(taskId);

      const response = await updateTaskStatus(taskId, 'delivered');

      if (response.success) {
        toast({
          title: "Success!",
          description: "Delivery completed successfully",
        });
        fetchActiveTasks();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update status",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading active deliveries...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Active Deliveries</h2>
        <p className="text-muted-foreground">Manage your ongoing delivery tasks</p>
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
            <Package className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>No active deliveries</p>
            <p className="text-sm mt-2">Accept tasks to start delivering</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {tasks.map((task) => (
            <Card key={task._id} className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">
                      {task.surplusId?.title || 'Delivery Task'}
                    </h3>
                    <Badge variant="default">{task.status}</Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-success" />
                        <span className="font-medium text-sm">Pickup</span>
                      </div>
                      <p className="text-sm">{task.pickupLocation.address}</p>
                    </div>

                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-destructive" />
                        <span className="font-medium text-sm">Delivery</span>
                      </div>
                      <p className="text-sm">{task.deliveryLocation.address}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!task.actualPickup && (
                      <Button
                        onClick={() => handleMarkPickedUp(task._id)}
                        disabled={updating === task._id}
                        className="flex-1"
                      >
                        {updating === task._id ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-2" />
                        )}
                        Mark as Picked Up
                      </Button>
                    )}
                    {task.actualPickup && !task.actualDelivery && (
                      <Button
                        onClick={() => handleMarkDelivered(task._id)}
                        disabled={updating === task._id}
                        className="flex-1 bg-success hover:bg-success/90"
                      >
                        {updating === task._id ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-2" />
                        )}
                        Mark as Delivered
                      </Button>
                    )}
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

export default ActiveDeliveries;
