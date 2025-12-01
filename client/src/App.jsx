// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import CollapsibleSidebar from "./components/CollapsibleSidebar";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

import DashboardClient from "./pages/DashboardClient";
import DashboardLawyer from "./pages/DashboardLawyer";

import SearchLawyers from "./pages/SearchLawyers";
import LawyerProfile from "./pages/LawyerProfile";

import CaseDetails from "./pages/CaseDetails";

import AIWorkspace from "./pages/AIWorkspace";
import CaseWorkspace from "./pages/CaseWorkspace";

import UpcomingHearings from "./pages/UpcomingHearings";
import CalendarView from "./pages/CalendarView";
import TasksReminders from "./pages/TasksReminders";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  // Sidebar width control (256px open / 64px collapsed)
  const [sidebarWidth, setSidebarWidth] = useState(256);

  return (
    <div className="min-h-screen bg-black text-white">

      {/* TOP NAVBAR */}
      <Navbar />

      {/* COLLAPSIBLE SIDEBAR (only for logged in users) */}
      <ProtectedRoute>
        <CollapsibleSidebar onWidthChange={(w) => setSidebarWidth(w)} />
      </ProtectedRoute>

      {/* MAIN PAGE WRAPPER (shifts right based on sidebar width) */}
      <div
        className="pt-20 transition-all duration-300"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        <Routes>

          {/* Public Pages */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/search-lawyers" element={<SearchLawyers />} />
          <Route path="/lawyer/:id" element={<LawyerProfile />} />

          {/* Client Dashboard */}
          <Route
            path="/dashboard-client"
            element={
              <ProtectedRoute>
                <DashboardClient />
              </ProtectedRoute>
            }
          />

          {/* Lawyer Dashboard */}
          <Route
            path="/dashboard-lawyer"
            element={
              <ProtectedRoute>
                <DashboardLawyer />
              </ProtectedRoute>
            }
          />

          {/* AI Document Chat Workspace */}
          <Route
            path="/workspace"
            element={
              <ProtectedRoute>
                <AIWorkspace />
              </ProtectedRoute>
            }
          />

          {/* Case Details Page */}
          <Route
            path="/case/:id"
            element={
              <ProtectedRoute>
                <CaseDetails />
              </ProtectedRoute>
            }
          />

          {/* Case Workspace */}
          <Route
            path="/case/:caseId/workspace"
            element={
              <ProtectedRoute>
                <CaseWorkspace />
              </ProtectedRoute>
            }
          />

          {/* Hearings Page */}
          <Route
            path="/hearings"
            element={
              <ProtectedRoute>
                <UpcomingHearings />
              </ProtectedRoute>
            }
          />

          {/* Calendar Page */}
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <CalendarView />
              </ProtectedRoute>
            }
          />

          {/* Tasks & Reminders */}
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <TasksReminders />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<h1 className="p-10">404 - Page Not Found</h1>} />
        </Routes>
      </div>
    </div>
  );
}
