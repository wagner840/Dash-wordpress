/**
 * @fileoverview Main application component with routing and providers
 * @module App
 */

import { ReactElement } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Dashboard } from "@/pages/Dashboard";
import { Blogs } from "@/pages/Blogs";
import { Analytics } from "@/pages/Analytics";
import { Settings } from "@/pages/Settings";
import { WordPress } from "@/pages/WordPress";
import { KeywordsManagement } from "@/pages/KeywordsManagement";
import { Workflows } from "@/pages/Workflows";

// Create a client for TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

/**
 * Main application component.
 *
 * Sets up the application with all necessary providers, routing,
 * and global configuration. Includes authentication, query client,
 * and protected routes for the dashboard interface.
 *
 * @component
 */
function App(): ReactElement {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Protected dashboard routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/blogs"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Blogs />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />


            <Route
              path="/workflows"
              element={
                <ProtectedRoute requiredRole="editor">
                  <DashboardLayout>
                    <Workflows />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Analytics />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/wordpress"
              element={
                <ProtectedRoute requiredRole="editor">
                  <DashboardLayout>
                    <WordPress />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/keywords"
              element={
                <ProtectedRoute requiredRole="editor">
                  <DashboardLayout>
                    <KeywordsManagement />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute requiredRole="admin">
                  <DashboardLayout>
                    <Settings />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />


            {/* Redirect any unknown routes to dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
