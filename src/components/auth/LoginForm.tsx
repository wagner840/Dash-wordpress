/**
 * @fileoverview Login form component using React 19 Actions API
 * @module components/auth/LoginForm
 */

import { useActionState, ReactElement } from "react";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";

/**
 * Zod schema for login form validation.
 *
 * Validates email format and password requirements before submission.
 * Ensures data integrity and provides user-friendly error messages.
 */
const LoginFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

/**
 * State interface for the login form action.
 *
 * Tracks form submission state, validation errors, and success status
 * for proper UI feedback and error handling.
 */
interface LoginFormState {
  success?: boolean;
  error?: string;
  fieldErrors?: {
    email?: string[];
    password?: string[];
  };
}

/**
 * Props for the LoginForm component.
 */
interface LoginFormProps {
  /** Callback fired when login is successful */
  onSuccess?: () => void;
}

/**
 * Login form component using React 19 Actions API.
 *
 * Provides email/password authentication with automatic pending state
 * management, form validation, and error handling. Uses the new Actions API
 * for improved form handling without manual state management.
 *
 * @component
 * @example
 * ```tsx
 * <LoginForm onSuccess={() => router.push('/dashboard')} />
 * ```
 */
export function LoginForm({ onSuccess }: LoginFormProps): ReactElement {
  const { signIn } = useAuth();

  /**
   * Form action handler with built-in state management.
   *
   * Handles form submission with validation, authentication, and error handling.
   * Uses React 19's Actions API for automatic pending state and error management.
   *
   * @param previousState - Previous form state (unused in this implementation)
   * @param formData - Raw form data from submission
   * @returns Promise resolving to success or error state
   */
  const [state, submitAction, isPending] = useActionState(
    async (
      previousState: LoginFormState | null,
      formData: FormData
    ): Promise<LoginFormState> => {
      // Extract form data
      const rawFormData = {
        email: formData.get("email"),
        password: formData.get("password"),
      };

      // Validate form data with Zod
      const result = LoginFormSchema.safeParse(rawFormData);

      if (!result.success) {
        return {
          error: "Please correct the errors below",
          fieldErrors: result.error.flatten().fieldErrors,
        };
      }

      try {
        // Attempt authentication
        await signIn(result.data.email, result.data.password);

        // Call success callback if provided
        onSuccess?.();

        return { success: true };
      } catch (error) {
        // Handle authentication errors
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred during login";

        return {
          error: errorMessage,
        };
      }
    },
    null
  );

  return (
    <div className="card max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Sign in to your account
        </h2>
        <p className="text-gray-600">Access your WordPress SaaS Dashboard</p>
      </div>

      <form action={submitAction} className="space-y-4">
        {/* Email field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={`input-field ${
              state?.fieldErrors?.email
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : ""
            }`}
            placeholder="Enter your email"
            aria-describedby={
              state?.fieldErrors?.email ? "email-error" : undefined
            }
          />
          {state?.fieldErrors?.email && (
            <p id="email-error" className="mt-1 text-sm text-red-600">
              {state.fieldErrors.email[0]}
            </p>
          )}
        </div>

        {/* Password field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className={`input-field ${
              state?.fieldErrors?.password
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : ""
            }`}
            placeholder="Enter your password"
            aria-describedby={
              state?.fieldErrors?.password ? "password-error" : undefined
            }
          />
          {state?.fieldErrors?.password && (
            <p id="password-error" className="mt-1 text-sm text-red-600">
              {state.fieldErrors.password[0]}
            </p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary w-full"
        >
          {isPending ? "Signing in..." : "Sign in"}
        </button>

        {/* Error message */}
        {state?.error && !state?.fieldErrors && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Sign in failed
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{state.error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success message */}
        {state?.success && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L7.53 10.43a.75.75 0 00-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Successfully signed in!
                </p>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Additional actions */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            type="button"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Contact your administrator
          </button>
        </p>
      </div>
    </div>
  );
}
