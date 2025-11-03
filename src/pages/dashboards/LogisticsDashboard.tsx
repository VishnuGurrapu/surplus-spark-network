import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Home, Package, Truck, CheckCircle, Map, TrendingUp, User } from "lucide-react";
import LogisticsHome from "@/components/logistics/LogisticsHome";
import AvailableTasks from "@/components/logistics/AvailableTasks";
import ActiveDeliveries from "@/components/logistics/ActiveDeliveries";
import CompletedDeliveries from "@/components/logistics/CompletedDeliveries";
import RouteMap from "@/components/logistics/RouteMap";
import Performance from "@/components/logistics/Performance";
import LogisticsProfile from "@/components/logistics/LogisticsProfile";

const LogisticsDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");

  const tabs = [
    { label: "Home", value: "home", icon: Home },
    { label: "Available Tasks", value: "tasks", icon: Package },
    { label: "Active Deliveries", value: "active", icon: Truck },
    { label: "Completed", value: "completed", icon: CheckCircle },
    { label: "Route Map", value: "map", icon: Map },
    { label: "Performance", value: "performance", icon: TrendingUp },
    { label: "Profile", value: "profile", icon: User }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <LogisticsHome />;
      case "tasks":
        return <AvailableTasks />;
      case "active":
        return <ActiveDeliveries />;
      case "completed":
        return <CompletedDeliveries />;
      case "map":
        return <RouteMap />;
      case "performance":
        return <Performance />;
      case "profile":
        return <LogisticsProfile />;
      default:
        return <LogisticsHome />;
    }
  };

  return (
    <DashboardLayout
      title="Logistics Dashboard"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default LogisticsDashboard;
