import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { mockUsers } from '../mock/mockData';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    case 'UPDATE_BALANCE':
      return {
        ...state,
        user: { 
          ...state.user, 
          balance: action.payload.balance,
          payoutBalance: action.payload.payoutBalance || state.user.payoutBalance
        }
      };
    default:
      return state;
  }
};

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for existing token in localStorage
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      dispatch({
        type: 'LOGIN',
        payload: {
          user: JSON.parse(userData),
          token
        }
      });
    }
  }, []);

  const login = async (email, password) => {
    try {
      // Mock login - in real app, this would call the API
      const user = mockUsers.find(u => u.email === email);
      
      if (user && password === 'password') {
        const token = `mock-jwt-token-${user.id}`;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        dispatch({
          type: 'LOGIN',
          payload: { user, token }
        });
        
        return { success: true };
      } else {
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const register = async (name, email, password, role = 'clipper') => {
    try {
      // Mock register - in real app, this would call the API
      const existingUser = mockUsers.find(u => u.email === email);
      
      if (existingUser) {
        return { success: false, error: 'User already exists' };
      }

      const newUser = {
        id: `${Date.now()}`,
        name,
        email,
        role,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        instagramConnected: false,
        tiktokConnected: false,
        balance: 0,
        payoutBalance: 0
      };

      // Add to mock users
      mockUsers.push(newUser);
      
      const token = `mock-jwt-token-${newUser.id}`;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      dispatch({
        type: 'LOGIN',
        payload: { user: newUser, token }
      });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (userData) => {
    const updatedUser = { ...state.user, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  const updateBalance = (balance, payoutBalance) => {
    const updatedUser = { ...state.user, balance, payoutBalance };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    dispatch({ type: 'UPDATE_BALANCE', payload: { balance, payoutBalance } });
  };

  const connectSocialAccount = (platform) => {
    // Mock social account connection
    const updates = {};
    updates[`${platform}Connected`] = true;
    updateUser(updates);
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    updateBalance,
    connectSocialAccount
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};