import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Home, BarChart3, Users, ShieldCheck, TrendingUp, Calendar, Award, FileText, User } from "lucide-react";
import AdminHome from "@/components/admin/AdminHome";
import Analytics from "@/components/admin/Analytics";
import ManageUsers from "@/components/admin/ManageUsers";
import VerificationCenter from "@/components/admin/VerificationCenter";
import Forecasting from "@/components/admin/Forecasting";
import SeasonalInsights from "@/components/admin/SeasonalInsights";
import ImpactDashboard from "@/components/admin/ImpactDashboard";
import SystemLogs from "@/components/admin/SystemLogs";
import AdminProfile from "@/components/admin/AdminProfile";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");

  const tabs = [
    { label: "Home", value: "home", icon: Home },
    { label: "Analytics", value: "analytics", icon: BarChart3 },
    { label: "Manage Users", value: "users", icon: Users },
    { label: "Verification", value: "verification", icon: ShieldCheck },
    { label: "Forecasting", value: "forecasting", icon: TrendingUp },
    { label: "Seasonal Insights", value: "seasonal", icon: Calendar },
    { label: "Impact Dashboard", value: "impact", icon: Award },
    { label: "System Logs", value: "logs", icon: FileText },
    { label: "Profile", value: "profile", icon: User }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <AdminHome />;
      case "analytics":
        return <Analytics />;
      case "users":
        return <ManageUsers />;
      case "verification":
        return <VerificationCenter />;
      case "forecasting":
        return <Forecasting />;
      case "seasonal":
        return <SeasonalInsights />;
      case "impact":
        return <ImpactDashboard />;
      case "logs":
        return <SystemLogs />;
      case "profile":
        return <AdminProfile />;
      default:
        return <AdminHome />;
    }
  };

  return (
    <DashboardLayout
      title="Admin Dashboard"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default AdminDashboard;
