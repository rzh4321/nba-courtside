"use client";
import React, { useState, useEffect, createContext, useContext } from "react";
import type { User } from "@/types";
import { API_URL } from "@/config";

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  verifyToken: () => Promise<void>;
  loading: boolean;
  deposit: (amount: number) => void;
  subtractBalance: (amount: number) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const verifyToken = async (): Promise<void> => {
    setLoading(true); // auth status is loading
    console.log("in verifytoken, localstorage is ", localStorage);
    const token = localStorage.getItem("token");
    if (token) {
      console.log(
        "token detected in localstorage, verifying it in backend now...",
      );
      try {
        const response = await fetch(`${API_URL}/auth/verify-token`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          console.log("token authenticated. ur now authenticated");
          const userData: User = await response.json();
          console.log(userData);
          setIsAuthenticated(true);
          setUser(userData);
        } else {
          console.log("token NOT authenticaed. ur logged out now");
          // Token is invalid or expired
          logout();
        }
      } catch (error) {
        console.error("Token verification error:", error);
        logout();
      } finally {
        setLoading(false); // auth status is determined
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (token: string): void => {
    console.log("login called.  token stored to localstorage.");
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    verifyToken();
  };

  const logout = (): void => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  const deposit = (amount: number) => {
    setUser((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        amount_deposited: prev.amount_deposited + amount,
        balance: prev.balance + amount,
      };
    });
  };

  const subtractBalance = (amount: number) => {
    setUser((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        amount_placed: prev.amount_placed + amount,
        bets_placed: prev.bets_placed + 1,
        balance: prev.balance - amount,
      };
    });
  };
  // TODO: add more functions for updating the state, like updating bets won
  // add web socket support. BetCrud.process_bet will send msg, use that to update user state

  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    verifyToken,
    loading,
    deposit,
    subtractBalance,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useAuth;
