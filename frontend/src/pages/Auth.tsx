import { useState, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { register as registerUser, login as loginUser, setAuthToken, setUser, RegisterData, LoginData } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Auth = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    donorType: "",
    ngoRegistrationId: "",
    vehicleType: "",
  });

  const roleConfig = {
    donor: { title: "Donor", dashboard: "/dashboard/donor" },
    ngo: { title: "NGO / Recipient", dashboard: "/dashboard/ngo" },
    logistics: { title: "Logistics Partner", dashboard: "/dashboard/logistics" },
    admin: { title: "Admin", dashboard: "/dashboard/admin" }
  };

  const config = roleConfig[role as keyof typeof roleConfig];

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await loginUser(loginForm);
      
      if (response.success && response.data) {
        setAuthToken(response.data.token);
        setUser(response.data.user);
        setSuccess("Login successful! Redirecting...");
        
        setTimeout(() => {
          navigate(config?.dashboard || "/");
        }, 1000);
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const registerData: RegisterData = {
        name: signupForm.name,
        email: signupForm.email,
        password: signupForm.password,
        role: role as 'donor' | 'ngo' | 'logistics' | 'admin',
        location: signupForm.location,
      };

      // Add role-specific fields
      if (role === 'donor' && signupForm.donorType) {
        registerData.donorType = signupForm.donorType as any;
      } else if (role === 'ngo' && signupForm.ngoRegistrationId) {
        registerData.ngoRegistrationId = signupForm.ngoRegistrationId;
      } else if (role === 'logistics' && signupForm.vehicleType) {
        registerData.vehicleType = signupForm.vehicleType as any;
      }

      console.log('Sending registration data:', registerData); // Debug log

      const response = await registerUser(registerData);
      
      if (response.success && response.data) {
        setAuthToken(response.data.token);
        setUser(response.data.user);
        setSuccess("Registration successful! Redirecting...");
        
        setTimeout(() => {
          navigate(config?.dashboard || "/");
        }, 1000);
      } else {
        // Handle validation errors
        if (response.errors && response.errors.length > 0) {
          const errorMessages = response.errors.map((err: any) => err.msg || err.message).join(', ');
          setError(errorMessages);
        } else {
          setError(response.message || "Registration failed");
        }
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  if (!config) {
    navigate("/select-role");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate("/select-role")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to role selection
        </Button>

        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">{config.title}</CardTitle>
            <CardDescription>Sign in to your account or create a new one</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="mb-4 bg-green-50 text-green-900 border-green-200">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="example@email.com" 
                      required 
                      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                      title="Please enter a valid email address"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      required 
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Logging in..." : "Continue"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      type="text" 
                      required 
                      value={signupForm.name}
                      onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-signup">Email</Label>
                    <Input 
                      id="email-signup" 
                      type="email" 
                      placeholder="example@email.com" 
                      required 
                      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                      title="Please enter a valid email address"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signup">Password (min 6 characters)</Label>
                    <Input 
                      id="password-signup" 
                      type="password" 
                      required 
                      minLength={6}
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location" 
                      type="text" 
                      placeholder="City, State" 
                      required 
                      value={signupForm.location}
                      onChange={(e) => setSignupForm({ ...signupForm, location: e.target.value })}
                      disabled={loading}
                    />
                  </div>

                  {role === "donor" && (
                    <div className="space-y-2">
                      <Label htmlFor="donor-type">Donor Type</Label>
                      <Select 
                        value={signupForm.donorType} 
                        onValueChange={(value) => setSignupForm({ ...signupForm, donorType: value })}
                        disabled={loading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">Individual</SelectItem>
                          <SelectItem value="restaurant">Restaurant</SelectItem>
                          <SelectItem value="grocery">Grocery Store</SelectItem>
                          <SelectItem value="hotel">Hotel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {role === "ngo" && (
                    <div className="space-y-2">
                      <Label htmlFor="ngo-id">NGO Registration ID</Label>
                      <Input 
                        id="ngo-id" 
                        type="text" 
                        required 
                        value={signupForm.ngoRegistrationId}
                        onChange={(e) => setSignupForm({ ...signupForm, ngoRegistrationId: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                  )}

                  {role === "logistics" && (
                    <div className="space-y-2">
                      <Label htmlFor="vehicle-type">Vehicle Type</Label>
                      <Select 
                        value={signupForm.vehicleType} 
                        onValueChange={(value) => setSignupForm({ ...signupForm, vehicleType: value })}
                        disabled={loading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select vehicle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bike">Bike</SelectItem>
                          <SelectItem value="car">Car</SelectItem>
                          <SelectItem value="van">Van</SelectItem>
                          <SelectItem value="truck">Truck</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
