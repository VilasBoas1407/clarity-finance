"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
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
  loginWithEmailPassword: (email: string, password: string) => Promise<void>;
  registerWithEmailPassword: (
    name: string,
    email: string,
    password: string,
  ) => Promise<void>;
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

  const loginWithEmailPassword = async (email: string, password: string) => {
    try {
      setLoading(true);
      const methods = await fetchSignInMethodsForEmail(auth, email.trim());
      const hasGoogleProvider = methods.includes(GoogleAuthProvider.PROVIDER_ID);
      const hasPasswordProvider = methods.includes("password");

      if (hasGoogleProvider && !hasPasswordProvider) {
        throw new Error("GOOGLE_ACCOUNT_ONLY");
      }

      const result = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );
      await loadOrCreateUser(result.user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Email/password login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmailPassword = async (
    name: string,
    email: string,
    password: string,
  ) => {
    try {
      setLoading(true);
      const normalizedEmail = email.trim();
      const methods = await fetchSignInMethodsForEmail(auth, normalizedEmail);
      const hasGoogleProvider = methods.includes(GoogleAuthProvider.PROVIDER_ID);
      const hasPasswordProvider = methods.includes("password");

      if (hasGoogleProvider && !hasPasswordProvider) {
        throw new Error("GOOGLE_ACCOUNT_ONLY");
      }

      if (hasPasswordProvider) {
        throw new Error("EMAIL_ALREADY_REGISTERED");
      }

      const result = await createUserWithEmailAndPassword(
        auth,
        normalizedEmail,
        password,
      );

      if (name.trim()) {
        await updateProfile(result.user, { displayName: name.trim() });
      }

      await loadOrCreateUser(result.user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Register error:", error);
      throw error;
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
        loginWithEmailPassword,
        registerWithEmailPassword,
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
