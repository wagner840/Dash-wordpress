/**
 * @fileoverview Protected route wrapper for authentication-required pages
 * @module components/auth/ProtectedRoute
 */

import { ReactElement, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LoginForm } from "./LoginForm";

/**
 * Props for the ProtectedRoute component.
 */
interface ProtectedRouteProps {
  /** Child components that require authentication */
  children: ReactNode;
  /** Optional custom loading component */
  loadingComponent?: ReactElement;
  /** Minimum role required to access the route */
  requiredRole?: "admin" | "editor" | "viewer";
}

/**
 * Loading skeleton component for protected routes.
 *
 * Displays a skeleton layout while authentication state is loading.
 * Provides visual feedback that the page is loading content.
 */
function LoadingSkeleton(): ReactElement {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header skeleton */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="skeleton h-8 w-32"></div>
            <div className="skeleton h-8 w-24"></div>
          </div>
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex-1 flex">
        {/* Sidebar skeleton */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="bg-white shadow-sm h-full p-4 space-y-4">
            <div className="skeleton h-6 w-full"></div>
            <div className="skeleton h-6 w-3/4"></div>
            <div className="skeleton h-6 w-full"></div>
            <div className="skeleton h-6 w-1/2"></div>
          </div>
        </div>

        {/* Content skeleton */}
        <div className="flex-1 p-6 space-y-6">
          <div className="skeleton h-8 w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="skeleton h-32"></div>
            <div className="skeleton h-32"></div>
            <div className="skeleton h-32"></div>
          </div>
          <div className="skeleton h-64 w-full"></div>
        </div>
      </div>
    </div>
  );
}

/**
 * Access denied component for insufficient permissions.
 *
 * Displays when a user is authenticated but doesn't have
 * the required role to access a protected route.
 */
function AccessDenied({
  requiredRole,
}: {
  requiredRole: string;
}): ReactElement {
  const { signOut, profile } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="card max-w-md">
        <div className="text-center">
          <svg
            className="mx-auto h-16 w-16 text-red-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>

          <p className="text-gray-600 mb-4">
            You don't have permission to access this page. This page requires{" "}
            <span className="font-medium">{requiredRole}</span> role.
          </p>

          <p className="text-sm text-gray-500 mb-6">
            Your current role:{" "}
            <span className="font-medium">{profile?.role || "Unknown"}</span>
          </p>

          <div className="space-y-2">
            <button
              onClick={() => window.history.back()}
              className="btn-secondary w-full"
            >
              Go Back
            </button>

            <button onClick={() => signOut()} className="btn-primary w-full">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Protected route wrapper component for authentication-required pages.
 *
 * Handles authentication state checking, role-based access control,
 * and provides appropriate UI for different authentication states.
 * Shows loading, login form, or access denied based on user state.
 *
 * @component
 * @example
 * ```tsx
 * <ProtectedRoute requiredRole="editor">
 *   <AdminDashboard />
 * </ProtectedRoute>
 * ```
 */
export function ProtectedRoute({
  children,
  loadingComponent,
  requiredRole = "viewer",
}: ProtectedRouteProps): ReactElement {
  const { user, profile, loading } = useAuth();

  // Show loading state while authentication is being determined
  if (loading) {
    return loadingComponent || <LoadingSkeleton />;
  }

  // Show login form if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoginForm />
      </div>
    );
  }

  // Check role-based access if profile is available
  if (profile && requiredRole !== "viewer") {
    const roleHierarchy = {
      viewer: 1,
      editor: 2,
      admin: 3,
    };

    const userRoleLevel = roleHierarchy[profile.role];
    const requiredRoleLevel = roleHierarchy[requiredRole];

    // Deny access if user role is insufficient
    if (userRoleLevel < requiredRoleLevel) {
      return <AccessDenied requiredRole={requiredRole} />;
    }
  }

  // User is authenticated and has sufficient permissions
  return <>{children}</>;
}
