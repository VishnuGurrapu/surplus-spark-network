import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Home, Plus, Package, QrCode, TrendingUp, Trophy, User } from "lucide-react";
import DonorHome from "@/components/donor/DonorHome";
import AddSurplus from "@/components/donor/AddSurplus";
import MyDonations from "@/components/donor/MyDonations";
import TrackDonation from "@/components/donor/TrackDonation";
import Impact from "@/components/donor/Impact";
import Leaderboard from "@/components/donor/Leaderboard";
import Profile from "@/components/donor/Profile";

const DonorDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");

  const tabs = [
    { label: "Home", value: "home", icon: Home },
    { label: "Add Surplus", value: "add", icon: Plus },
    { label: "My Donations", value: "donations", icon: Package },
    { label: "Track Donation", value: "track", icon: QrCode },
    { label: "Impact", value: "impact", icon: TrendingUp },
    { label: "Leaderboard", value: "leaderboard", icon: Trophy },
    { label: "Profile", value: "profile", icon: User }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <DonorHome />;
      case "add":
        return <AddSurplus />;
      case "donations":
        return <MyDonations />;
      case "track":
        return <TrackDonation />;
      case "impact":
        return <Impact />;
      case "leaderboard":
        return <Leaderboard />;
      case "profile":
        return <Profile />;
      default:
        return <DonorHome />;
    }
  };

  return (
    <DashboardLayout
      title="Donor Dashboard"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default DonorDashboard;
