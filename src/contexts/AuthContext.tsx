/**
 * @fileoverview Authentication context
 * @module contexts/AuthContext
 */

import { createContext } from "react";
import { User } from "@supabase/supabase-js";

export interface AuthContextValue {
  user: User | null;
  profile: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);
