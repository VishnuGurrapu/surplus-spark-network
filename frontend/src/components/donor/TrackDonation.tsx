import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { QrCode, Search, CheckCircle2, Package, Truck, MapPin, Loader2, AlertCircle, Navigation } from "lucide-react";
import { trackDonationById } from "@/lib/api";
import { loadGoogleMapsScript, createMap, createMarker, geocodeAddress, getDirections } from "@/lib/googleMaps";

const TrackDonation = () => {
  const [donationId, setDonationId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackingData, setTrackingData] = useState<any>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [mapLoading, setMapLoading] = useState(false);

  const handleTrack = async () => {
    if (!donationId.trim()) {
      setError("Please enter a donation ID");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await trackDonationById(donationId);

      if (response.success && response.data) {
        setTrackingData(response.data);
        if (response.data.surplus?.location?.address) {
          initializeMap(response.data);
        }
      } else {
        setError(response.message || "Donation not found");
      }
    } catch (err: any) {
      console.error('Track donation error:', err);
      setError(err.message || "An error occurred while tracking");
    } finally {
      setLoading(false);
    }
  };

  const initializeMap = async (data: any) => {
    try {
      setMapLoading(true);
      await loadGoogleMapsScript();

      if (!mapRef.current) return;

      const pickupAddress = data.surplus?.location?.address || "Mumbai, India";
      const deliveryAddress = data.task?.ngoId?.address || data.task?.deliveryLocation?.address;

      const pickupLocation = await geocodeAddress(pickupAddress);
      
      if (!pickupLocation) {
        console.warn('Could not geocode pickup address');
        setMapLoading(false);
        return;
      }

      const mapInstance = createMap(mapRef.current, {
        center: { lat: pickupLocation.lat(), lng: pickupLocation.lng() },
        zoom: 13,
        mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID',
      });

      setMap(mapInstance);

      // Pickup marker
      createMarker({
        position: pickupLocation,
        map: mapInstance,
        title: 'Pickup Location',
        label: 'P',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#0b66d0',
          fillOpacity: 1,
          strokeColor: '#fff',
          strokeWeight: 2,
        },
      });

      // Delivery marker and route if available
      if (deliveryAddress) {
        const deliveryLocation = await geocodeAddress(deliveryAddress);
        if (deliveryLocation) {
          createMarker({
            position: deliveryLocation,
            map: mapInstance,
            title: 'Delivery Location',
            label: 'D',
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#16a34a',
              fillOpacity: 1,
              strokeColor: '#fff',
              strokeWeight: 2,
            },
          });

          // Draw route if in transit or delivered
          if (data.surplus?.status === 'in-transit' || data.surplus?.status === 'delivered') {
            const directions = await getDirections(pickupLocation, deliveryLocation);
            if (directions) {
              const renderer = new window.google.maps.DirectionsRenderer({
                map: mapInstance,
                suppressMarkers: true,
                polylineOptions: {
                  strokeColor: '#0b66d0',
                  strokeWeight: 4,
                },
              });
              renderer.setDirections(directions);
            }
          }

          // Fit bounds to show both markers
          const bounds = new window.google.maps.LatLngBounds();
          bounds.extend(pickupLocation);
          bounds.extend(deliveryLocation);
          mapInstance.fitBounds(bounds);
        }
      }

      setMapLoading(false);
    } catch (err) {
      console.error('Map initialization error:', err);
      setMapLoading(false);
    }
  };

  const getTimeline = () => {
    if (!trackingData) return [];

    const { surplus, task, timeline } = trackingData;

    return [
      { 
        label: "Donated", 
        icon: Package, 
        completed: true, 
        date: timeline.created ? new Date(timeline.created).toLocaleString() : 'N/A'
      },
      { 
        label: "Claimed", 
        icon: CheckCircle2, 
        completed: !!timeline.claimed, 
        date: timeline.claimed ? new Date(timeline.claimed).toLocaleString() : 'Pending'
      },
      { 
        label: "Picked Up", 
        icon: Truck, 
        completed: !!timeline.pickedUp, 
        date: timeline.pickedUp ? new Date(timeline.pickedUp).toLocaleString() : 'Pending'
      },
      { 
        label: "Delivered", 
        icon: MapPin, 
        completed: !!timeline.delivered, 
        date: timeline.delivered ? new Date(timeline.delivered).toLocaleString() : 'Pending'
      },
    ];
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Track Donation</h2>
        <p className="text-muted-foreground">Monitor your donation's journey in real-time</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enter Tracking Details</CardTitle>
          <CardDescription>Use donation ID to track your surplus item</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input 
              placeholder="Enter Donation ID" 
              className="flex-1" 
              value={donationId}
              onChange={(e) => setDonationId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
            />
            <Button onClick={handleTrack} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
              Track
            </Button>
          </div>
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-3">OR</p>
            <Button variant="outline" disabled>
              <QrCode className="w-4 h-4 mr-2" />
              Scan QR Code (Coming Soon)
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {trackingData && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>{trackingData.surplus.title}</CardTitle>
              <CardDescription>
                {trackingData.surplus.quantity} {trackingData.surplus.unit} - {trackingData.surplus.category}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {getTimeline().map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step.completed ? "bg-success" : "bg-muted"
                      }`}>
                        {step.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        ) : (
                          <step.icon className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      {index < getTimeline().length - 1 && (
                        <div className={`absolute left-1/2 top-10 w-0.5 h-12 -ml-px ${
                          step.completed ? "bg-success" : "bg-muted"
                        }`} />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <h4 className="font-semibold mb-1">{step.label}</h4>
                      <p className="text-sm text-muted-foreground">{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {trackingData.task && (
            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium">NGO/Recipient</p>
                  <p className="text-sm text-muted-foreground">
                    {trackingData.task.ngoId?.name || 'Not assigned'}
                  </p>
                </div>
                {trackingData.task.logisticsPartnerId && (
                  <div>
                    <p className="text-sm font-medium">Logistics Partner</p>
                    <p className="text-sm text-muted-foreground">
                      {trackingData.task.logisticsPartnerId.name} - {trackingData.task.logisticsPartnerId.vehicleType}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {trackingData.surplus.status.replace('-', ' ')}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {trackingData.surplus?.location?.address && (
            <Card>
              <CardHeader>
                <CardTitle>Delivery Map</CardTitle>
                <CardDescription>Track your donation's journey on the map</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-96 bg-muted rounded-lg overflow-hidden">
                  {mapLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <span className="ml-2">Loading map...</span>
                    </div>
                  )}
                  <div ref={mapRef} className="w-full h-full" />
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>P = Pickup Location</span>
                  <MapPin className="w-4 h-4 text-success" />
                  <span>D = Delivery Location</span>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <QrCode className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-medium">Verified Donation</p>
                  <p className="text-sm text-muted-foreground">
                    This donation is tracked in our system for complete transparency
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default TrackDonation;
