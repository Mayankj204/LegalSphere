import { Routes, Route } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "./context/AuthContext";

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

import GlobalAIChat from "./pages/GlobalAIChat";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* NAVBAR */}
      <Navbar />

     
      {/* SIDEBAR ONLY FOR LAWYERS */}
      {user?.role === "lawyer" && (
        <CollapsibleSidebar onWidthChange={(w) => setSidebarWidth(w)} />
      )}

      {/* MAIN CONTENT */}
      <div
        className="pt-20 transition-all duration-300"
        style={{
          marginLeft: user?.role === "lawyer" ? `${sidebarWidth}px` : "0px",
        }}
      >

        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search-lawyers" element={<SearchLawyers />} />
          <Route path="/lawyer/:id" element={<LawyerProfile />} />

          {/* PROTECTED ROUTES */}
          <Route
            path="/dashboard-client"
            element={
              <ProtectedRoute role="client">
                <DashboardClient />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard-lawyer"
            element={
              <ProtectedRoute role="lawyer">
                <DashboardLawyer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ai-assistant"
            element={
              <ProtectedRoute>
                <GlobalAIChat />
              </ProtectedRoute>
            }
          />

          <Route
            path="/workspace"
            element={
              <ProtectedRoute role="lawyer">
                <AIWorkspace />
              </ProtectedRoute>
            }
          />

          <Route
            path="/case/:id"
            element={
              <ProtectedRoute>
                <CaseDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/case/:caseId/workspace"
            element={
              <ProtectedRoute>
                <CaseWorkspace />
              </ProtectedRoute>
            }
          />

          <Route
            path="/hearings"
            element={
              <ProtectedRoute>
                <UpcomingHearings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <CalendarView />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <TasksReminders />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={<h1 className="p-10">404 - Page Not Found</h1>}
          />
        </Routes>
      </div>
    </div>
  );
}
