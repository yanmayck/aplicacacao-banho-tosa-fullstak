
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the user types - This might need adjustment based on backend's roles structure
export type UserRole = "admin" | "common" | "user"; // Adjusted to include a more generic "user"

// Define the user interface - Aligning with backend response
export interface User {
  id: string; // Or number, if backend uses number
  email: string; // Changed from username
  name?: string; // Optional name field from backend
  roles: string[]; // Backend returns roles as an array of strings
  // Computed property, not directly from backend, but derived
  primaryRole: UserRole;
}

// Interface for the backend login response structure
interface BackendUser {
  id: string; // Or number
  email: string;
  name?: string;
  roles: string[];
}

interface LoginResponse {
  access_token: string;
  user: BackendUser;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API Base URL - Vite handles .env files automatically.
// VITE_API_BASE_URL should be set in .env.development or .env.production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3333";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Check localStorage on mount to restore session
  useEffect(() => {
    const storedToken = localStorage.getItem("petshop-token");
    const storedUser = localStorage.getItem("petshop-user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Helper function to determine primary role from roles array
  const getPrimaryRole = (roles: string[]): UserRole => {
    if (roles.includes("admin")) return "admin";
    if (roles.includes("common")) return "common"; // Assuming "common" is a possible role string
    if (roles.length > 0) return roles[0] as UserRole; // Fallback to the first role
    return "user"; // Default fallback
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role: 'USER' }),
      });

      if (!response.ok) {
        console.error('Registration failed:', response.status, response.statusText);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => { // Changed username to email
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // Changed username to email
      });

      if (!response.ok) {
        console.error('Login failed:', response.status, response.statusText);
        try {
          const errorData = await response.json();
          console.error('Error details:', errorData);
        } catch (e) {
          // Ignore if error response is not JSON
        }
        return false;
      }

      const data: LoginResponse = await response.json();
      
      if (data.access_token && data.user) {
        // Map backend user structure to frontend User interface
        const mappedUser: User = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          roles: data.user.roles || [], // Ensure roles is always an array
          primaryRole: getPrimaryRole(data.user.roles || []),
        };

        setToken(data.access_token);
        setUser(mappedUser);
        localStorage.setItem("petshop-token", data.access_token);
        localStorage.setItem("petshop-user", JSON.stringify(mappedUser));
        return true;
      } else {
        console.error('Login failed: Invalid response structure from server.', data);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };
  
  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("petshop-token");
    localStorage.removeItem("petshop-user");
    // Potentially call a backend /auth/logout endpoint here if available
    // fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
  };

  // const getAuthToken = (): string | null => {
  //   return token;
  // };
  
  // Helper function to check if user is admin
  const isAdmin = (): boolean => {
    // Check if 'admin' is present in the roles array
    return user?.roles?.includes("admin") || user?.primaryRole === "admin" || false;
  };
  
  const value = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    isAdmin
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
