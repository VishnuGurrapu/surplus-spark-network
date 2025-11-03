import { useState } from "react";
import { Routes, Route } from "react-router-dom";
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
  return (
    <DashboardLayout userRole="donor">
      <Routes>
        <Route index element={<DonorHome />} />
        <Route path="donations" element={<MyDonations />} />
        <Route path="add-surplus" element={<AddSurplus />} />
        <Route path="track" element={<TrackDonation />} />
        <Route path="impact" element={<Impact />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </DashboardLayout>
  );
};

export default DonorDashboard;
