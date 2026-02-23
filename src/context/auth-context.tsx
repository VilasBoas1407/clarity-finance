"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";
import { User } from "@/types/user";
import { auth, provider } from "../lib/firebase";
import { useUser } from "@/hooks/use-user";

type AuthContextType = {
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, loadOrCreateUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextFirebaseUser) => {
      setFirebaseUser(nextFirebaseUser);

      try {
        if (nextFirebaseUser) {
          await loadOrCreateUser(nextFirebaseUser);
        }
      } catch (error) {
        console.error("Error on auth state sync:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [loadOrCreateUser]);

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      await loadOrCreateUser(result.user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isAuthenticated = !!firebaseUser;

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        isAuthenticated,
        user,
        loading,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
