import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  user_email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<User>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = "http://localhost:3000/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_email: email, user_clave: password }),
    });

    if (!res.ok) throw new Error("Error en credenciales");
    const data = await res.json();
    console.log(data)
    localStorage.setItem("token", data.access_token);
    const userData = await fetchUser();
  if (userData) setUser(userData);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_names: name, user_email: email, user_clave: password }),
    });
    console.log(res)
    if (!res.ok) throw new Error("No se pudo registrar");
    const data = await res.json();

    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const fetchUser = async (): Promise<User | undefined> => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    const res = await fetch(`${API_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
    if (res.ok) {
      const data = await res.json();
      const userData: User = {
        id: data.user_id,
        name: data.user_names,
        user_email: data.user_email,
        avatar: null,
      };
      setUser(userData);
      return userData;
    } else {
      logout(); // token inválido
    }
  };
  
  

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      fetchUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
