import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Home, Package, Plus, MapPin, TrendingUp, AlertCircle, Trophy, User } from "lucide-react";
import NGOHome from "@/components/ngo/NGOHome";
import AvailableSurplus from "@/components/ngo/AvailableSurplus";
import RequestSurplus from "@/components/ngo/RequestSurplus";
import MyRequests from "@/components/ngo/MyRequests";
import ImpactReports from "@/components/ngo/ImpactReports";
import UrgentNeeds from "@/components/ngo/UrgentNeeds";
import NGOLeaderboard from "@/components/ngo/NGOLeaderboard";
import NGOProfile from "@/components/ngo/NGOProfile";

const NGODashboard = () => {
  const [activeTab, setActiveTab] = useState("home");

  const tabs = [
    { label: "Home", value: "home", icon: Home },
    { label: "Available Surplus", value: "available", icon: Package },
    { label: "Request Surplus", value: "request", icon: Plus },
    { label: "My Requests", value: "requests", icon: MapPin },
    { label: "Impact Reports", value: "impact", icon: TrendingUp },
    { label: "Urgent Needs", value: "urgent", icon: AlertCircle },
    { label: "Leaderboard", value: "leaderboard", icon: Trophy },
    { label: "Profile", value: "profile", icon: User }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <NGOHome />;
      case "available":
        return <AvailableSurplus />;
      case "request":
        return <RequestSurplus />;
      case "requests":
        return <MyRequests />;
      case "impact":
        return <ImpactReports />;
      case "urgent":
        return <UrgentNeeds />;
      case "leaderboard":
        return <NGOLeaderboard />;
      case "profile":
        return <NGOProfile />;
      default:
        return <NGOHome />;
    }
  };

  return (
    <DashboardLayout
      title="NGO Dashboard"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default NGODashboard;
