import { User } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export interface AuthUser {
  id: string;
  email: string;
  userType: string;
}

export const getStoredUser = (): AuthUser | null => {
  const userStr = localStorage.getItem("empaai_user");
  return userStr ? JSON.parse(userStr) : null;
};

export const setStoredUser = (user: AuthUser | null) => {
  if (user) {
    localStorage.setItem("empaai_user", JSON.stringify(user));
  } else {
    localStorage.removeItem("empaai_user");
  }
};

export const isAuthenticated = (): boolean => {
  return getStoredUser() !== null;
};

export const logout = async () => {
  try {
    await apiRequest("POST", "/api/auth/logout", {});
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    setStoredUser(null);
  }
};

export const checkSession = async (): Promise<AuthUser | null> => {
  try {
    const response = await fetch("/api/users/me", {
      credentials: "include",
    });
    
    if (response.ok) {
      const user = await response.json();
      setStoredUser(user);
      return user;
    } else {
      setStoredUser(null);
      return null;
    }
  } catch (error) {
    setStoredUser(null);
    return null;
  }
};
