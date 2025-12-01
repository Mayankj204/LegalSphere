// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

import DashboardClient from "./pages/DashboardClient";
import DashboardLawyer from "./pages/DashboardLawyer";

import SearchLawyers from "./pages/SearchLawyers";
import LawyerProfile from "./pages/LawyerProfile";

import CaseDetails from "./pages/CaseDetails";

import AIWorkspace from "./pages/AIWorkspace";   // ✅ FIXED IMPORT
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white pt-20">
      
      <Navbar />

      <Routes>

        {/* Public Pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/search-lawyers" element={<SearchLawyers />} />
        <Route path="/lawyer/:id" element={<LawyerProfile />} />

        {/* Dashboards */}
        <Route
          path="/dashboard-client"
          element={
            <ProtectedRoute>
              <DashboardClient />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard-lawyer"
          element={
            <ProtectedRoute>
              <DashboardLawyer />
            </ProtectedRoute>
          }
        />

        {/* 🔥 AI Workspace — Unified document chat system */}
        <Route
          path="/workspace"
          element={
            <ProtectedRoute>
              <AIWorkspace />
            </ProtectedRoute>
          }
        />

        {/* Case Details */}
        <Route
          path="/case/:id"
          element={
            <ProtectedRoute>
              <CaseDetails />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<h1 className="p-10">404 - Page Not Found</h1>} />
      </Routes>

    </div>
  );
}
