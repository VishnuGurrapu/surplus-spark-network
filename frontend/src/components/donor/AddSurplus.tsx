import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Sparkles, AlertCircle, CheckCircle } from "lucide-react";
import { createSurplus, SurplusData } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const AddSurplus = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    quantity: "",
    unit: "",
    expiryDate: "",
    address: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.category || 
          !formData.quantity || !formData.unit || !formData.address) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      const surplusData: SurplusData = {
        title: formData.title,
        description: formData.description,
        category: formData.category as any,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        location: {
          address: formData.address,
        },
      };

      // Add expiry date if provided
      if (formData.expiryDate) {
        surplusData.expiryDate = formData.expiryDate;
      }

      console.log('Submitting surplus:', surplusData);

      const response = await createSurplus(surplusData);

      if (response.success) {
        setSuccess(true);
        toast({
          title: "Success!",
          description: "Surplus item created successfully",
        });

        // Reset form
        setFormData({
          title: "",
          description: "",
          category: "",
          quantity: "",
          unit: "",
          expiryDate: "",
          address: "",
        });

        // Navigate to surplus list after 2 seconds
        setTimeout(() => {
          navigate("/dashboard/donor/donations");
        }, 2000);
      } else {
        if (response.errors && response.errors.length > 0) {
          const errorMessages = response.errors.map((err: any) => err.msg || err.message).join(', ');
          setError(errorMessages);
        } else {
          setError(response.message || "Failed to create surplus item");
        }
      }
    } catch (err: any) {
      console.error('Create surplus error:', err);
      setError(err.message || "An error occurred while creating the surplus item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Add Surplus Item</h2>
        <p className="text-muted-foreground">Fill in the details of your surplus item</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 text-green-900 border-green-200">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>Surplus item created successfully! Redirecting...</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Item Details</CardTitle>
          <CardDescription>Provide information about the surplus item you want to donate</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="item-name">Item Name *</Label>
              <Input 
                id="item-name" 
                placeholder="e.g., Fresh Vegetables" 
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="educational">Educational</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input 
                  id="quantity" 
                  type="number" 
                  placeholder="0" 
                  min="0"
                  step="0.01"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  disabled={loading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit *</Label>
                <Select 
                  value={formData.unit}
                  onValueChange={(value) => setFormData({ ...formData, unit: value })}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilograms</SelectItem>
                    <SelectItem value="pieces">Pieces</SelectItem>
                    <SelectItem value="boxes">Boxes</SelectItem>
                    <SelectItem value="bags">Bags</SelectItem>
                    <SelectItem value="liters">Liters</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date (if applicable)</Label>
              <Input 
                id="expiry" 
                type="date" 
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Pickup Location *</Label>
              <Input 
                id="location" 
                placeholder="Enter your address" 
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea 
                id="description" 
                placeholder="Add any additional details..." 
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Upload Image (Coming Soon)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-muted/50">
                <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Image upload feature coming soon</p>
              </div>
            </div>

            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium text-primary">AI Classification (Coming Soon)</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Once you upload an image, our AI will automatically detect the item type and suggest optimal storage conditions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              type="submit" 
              className="w-full" 
              size="lg" 
              disabled={loading}
            >
              {loading ? "Creating..." : "Submit Donation"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddSurplus;
