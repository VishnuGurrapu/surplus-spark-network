import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, Package, Clock, Loader2, AlertCircle, Truck, User, X, Route as RouteIcon } from "lucide-react";
import { getAvailableTasks, acceptTask, Task } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { loadGoogleMapsScript } from "@/lib/googleMaps";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const AvailableTasks = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState<string | null>(null);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

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

  const handleViewRoute = async (task: Task) => {
    setSelectedTask(task);
    setShowRouteModal(true);
    setRouteLoading(true);
    setRouteInfo(null);

    try {
      const pickupAddress = task.pickupLocation.address;
      const deliveryAddress = task.deliveryLocation.address;

      // Validate addresses exist
      if (!pickupAddress || !deliveryAddress) {
        toast({
          title: "Error",
          description: "Pickup or delivery address is missing",
          variant: "destructive",
        });
        setRouteLoading(false);
        return;
      }

      // Check if addresses are identical
      if (pickupAddress.trim().toLowerCase() === deliveryAddress.trim().toLowerCase()) {
        setRouteInfo({
          distance: "0 m (Same Location)",
          duration: "0 mins",
        });
        setRouteLoading(false);
        
        // Still show the map with a single marker
        await loadGoogleMapsScript();
        
        setTimeout(() => {
          if (!mapRef.current) return;
          
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ address: pickupAddress }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
              const location = results[0].geometry.location;
              const map = new google.maps.Map(mapRef.current!, {
                zoom: 15,
                center: location,
                mapTypeControl: false,
                streetViewControl: false,
              });
              
              new google.maps.Marker({
                position: location,
                map: map,
                title: "Pickup & Delivery Location (Same)",
                icon: {
                  url: "http://maps.google.com/mapfiles/ms/icons/orange-dot.png"
                }
              });
              
              googleMapRef.current = map;
            }
          });
        }, 300);
        
        return;
      }

      await loadGoogleMapsScript();

      // Wait for modal to render
      setTimeout(async () => {
        if (!mapRef.current) {
          setRouteLoading(false);
          return;
        }

        // Initialize map
        const map = new google.maps.Map(mapRef.current, {
          zoom: 12,
          center: { lat: 17.385044, lng: 78.486671 },
          mapTypeControl: false,
          streetViewControl: false,
        });

        googleMapRef.current = map;

        // Initialize directions renderer
        const directionsRenderer = new google.maps.DirectionsRenderer({
          map: map,
          suppressMarkers: false,
          polylineOptions: {
            strokeColor: "#4F46E5",
            strokeWeight: 5,
          },
        });

        directionsRendererRef.current = directionsRenderer;
        const directionsService = new google.maps.DirectionsService();

        const request = {
          origin: pickupAddress,
          destination: deliveryAddress,
          travelMode: google.maps.TravelMode.DRIVING,
        };

        console.log('Calculating route from:', pickupAddress, 'to:', deliveryAddress);

        directionsService.route(request, (result, status) => {
          console.log('Directions API status:', status);
          
          if (status === google.maps.DirectionsStatus.OK && result) {
            directionsRenderer.setDirections(result);

            const route = result.routes[0];
            const leg = route.legs[0];

            setRouteInfo({
              distance: leg.distance?.text || "N/A",
              duration: leg.duration?.text || "N/A",
            });

            toast({
              title: "Route Calculated",
              description: `Distance: ${leg.distance?.text}, Duration: ${leg.duration?.text}`,
            });
          } else {
            let errorMessage = "Could not calculate route. ";
            
            switch (status) {
              case google.maps.DirectionsStatus.NOT_FOUND:
                errorMessage += "One or both locations could not be found.";
                break;
              case google.maps.DirectionsStatus.ZERO_RESULTS:
                errorMessage += "No route could be found between these locations.";
                break;
              case google.maps.DirectionsStatus.INVALID_REQUEST:
                errorMessage += "Invalid route request.";
                break;
              default:
                errorMessage += `Error: ${status}`;
            }

            toast({
              title: "Error",
              description: errorMessage,
              variant: "destructive",
            });
          }
          setRouteLoading(false);
        });
      }, 300);
    } catch (error) {
      console.error("Route error:", error);
      toast({
        title: "Error",
        description: "Failed to load map: " + (error as Error).message,
        variant: "destructive",
      });
      setRouteLoading(false);
    }
  };

  const closeRouteModal = () => {
    setShowRouteModal(false);
    setSelectedTask(null);
    setRouteInfo(null);
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null);
      directionsRendererRef.current = null;
    }
    googleMapRef.current = null;
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
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleViewRoute(task)}
                    >
                      <RouteIcon className="w-4 h-4 mr-2" />
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

      {/* Route Modal */}
      <Dialog open={showRouteModal} onOpenChange={(open) => !open && closeRouteModal()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Delivery Route</DialogTitle>
                <DialogDescription>
                  Route from pickup location to delivery destination
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeRouteModal}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          {selectedTask && (
            <div className="space-y-4">
              {/* Warning for same addresses */}
              {selectedTask.pickupLocation.address.trim().toLowerCase() === 
               selectedTask.deliveryLocation.address.trim().toLowerCase() && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>⚠️ Same Location Issue:</strong> Both pickup and delivery locations are identical. This happens when the donor and NGO registered with the same address. 
                    <br/><br/>
                    <strong>To fix this:</strong>
                    <ul className="list-disc ml-5 mt-2">
                      <li>The donor should update their profile with their actual pickup address</li>
                      <li>The NGO should update their profile with their actual delivery address</li>
                      <li>Or contact support if this is a system error</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Route Summary */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-success mt-1" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm">Pickup Location</p>
                        <p className="text-sm text-muted-foreground">
                          {getDonorName(selectedTask.donorId)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {selectedTask.pickupLocation.address}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-destructive mt-1" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm">Delivery Location</p>
                        <p className="text-sm text-muted-foreground">
                          {getNGOName(selectedTask.ngoId)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {selectedTask.deliveryLocation.address}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Route Info */}
              {routeInfo && (
                <div className="flex gap-4 justify-center">
                  <Badge variant="secondary" className="text-base py-2 px-4">
                    📏 Distance: {routeInfo.distance}
                  </Badge>
                  <Badge variant="secondary" className="text-base py-2 px-4">
                    ⏱️ Duration: {routeInfo.duration}
                  </Badge>
                </div>
              )}

              {/* Map Container */}
              <div className="relative">
                <div
                  ref={mapRef}
                  className="w-full h-[400px] rounded-lg border border-border bg-muted/20"
                  style={{ minHeight: '400px' }}
                >
                  {routeLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg z-10">
                      <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Calculating route...</p>
                      </div>
                    </div>
                  )}
                  {!routeLoading && !googleMapRef.current && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">Map will appear here</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Item Details */}
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold">{getSurplusTitle(selectedTask.surplusId)}</p>
                      <p className="text-sm text-muted-foreground">
                        {getSurplusDetails(selectedTask.surplusId)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AvailableTasks;
function setRouteLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}

