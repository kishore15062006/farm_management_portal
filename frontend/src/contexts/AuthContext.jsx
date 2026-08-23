import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';

const AuthContext = createContext(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored user session
        const storedUser = localStorage.getItem('farmPortalUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password, role) => {
        setLoading(true);
        try {
            const { token, user: loggedInUser } = await api.auth.login(email, password, role);
            setUser(loggedInUser);
            localStorage.setItem('farmPortalUser', JSON.stringify(loggedInUser));
            localStorage.setItem('farmPortalToken', token);
        }
        catch (error) {
            throw new Error(error.message || 'Invalid credentials or role mismatch');
        }
        finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        try {
            const { token, user: registeredUser } = await api.auth.register(userData);
            setUser(registeredUser);
            localStorage.setItem('farmPortalUser', JSON.stringify(registeredUser));
            localStorage.setItem('farmPortalToken', token);
        }
        catch (error) {
            throw new Error(error.message || 'Registration failed');
        }
        finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('farmPortalUser');
        localStorage.removeItem('farmPortalToken');
    };

    return (<AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            register,
            logout,
            loading
        }}>
      {children}
    </AuthContext.Provider>);
};
