import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'farmer' | 'veterinarian' | 'regulator';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organization?: string;
  licenseNumber?: string; // For veterinarians
  farmId?: string; // For farmers
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  organization?: string;
  licenseNumber?: string;
  farmId?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock authentication - replace with real API calls
const mockUsers: User[] = [
  {
    id: '1',
    email: 'farmer@demo.com',
    name: 'John Farm',
    role: 'farmer',
    organization: 'Green Valley Farm',
    farmId: 'farm_001'
  },
  {
    id: '2',
    email: 'vet@demo.com',
    name: 'Dr. Sarah Wilson',
    role: 'veterinarian',
    organization: 'Rural Veterinary Services',
    licenseNumber: 'VET12345'
  },
  {
    id: '3',
    email: 'regulator@demo.com',
    name: 'Mike Regulatory',
    role: 'regulator',
    organization: 'Department of Agriculture'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('farmPortalUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    setLoading(true);
    
    // Mock authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email && u.role === role);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('farmPortalUser', JSON.stringify(foundUser));
    } else {
      throw new Error('Invalid credentials or role mismatch');
    }
    
    setLoading(false);
  };

  const register = async (userData: RegisterData) => {
    setLoading(true);
    
    // Mock registration delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email,
      name: userData.name,
      role: userData.role,
      organization: userData.organization,
      licenseNumber: userData.licenseNumber,
      farmId: userData.farmId
    };
    
    setUser(newUser);
    localStorage.setItem('farmPortalUser', JSON.stringify(newUser));
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('farmPortalUser');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};