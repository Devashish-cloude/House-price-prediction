import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';

const AuthContext = createContext();

const DEFAULT_AVATAR = '/avatar.jpg';

const GUEST_USER = {
  id: 'guest-user-01',
  email: 'student@aiml.edu',
  user_metadata: {
    full_name: 'Devashish Itankar',
    avatar_url: DEFAULT_AVATAR,
    role: 'AIML Researcher / Student',
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('houseai_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.user_metadata?.avatar_url?.includes('photo-1534528741775-53994a69daeb')) {
          parsed.user_metadata.avatar_url = DEFAULT_AVATAR;
          localStorage.setItem('houseai_user', JSON.stringify(parsed));
        }
        return parsed;
      } catch {}
    }
    return GUEST_USER;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isSupabaseConfigured() && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user);
          localStorage.setItem('houseai_user', JSON.stringify(session.user));
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser(session.user);
          localStorage.setItem('houseai_user', JSON.stringify(session.user));
        } else if (!localStorage.getItem('houseai_user')) {
          setUser(null);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setUser(data.user);
        localStorage.setItem('houseai_user', JSON.stringify(data.user));
        return { success: true };
      } else {
        // Mock Login for academic evaluation
        const mockUser = {
          id: `usr-${Date.now()}`,
          email,
          user_metadata: {
            full_name: email.split('@')[0].toUpperCase(),
            avatar_url: DEFAULT_AVATAR,
            role: 'Property Analyst',
          }
        };
        setUser(mockUser);
        localStorage.setItem('houseai_user', JSON.stringify(mockUser));
        return { success: true };
      }
    } catch (error) {
      return { success: false, error: error.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, fullName) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName, avatar_url: DEFAULT_AVATAR } },
        });
        if (error) throw error;
        setUser(data.user);
        localStorage.setItem('houseai_user', JSON.stringify(data.user));
        return { success: true };
      } else {
        const mockUser = {
          id: `usr-${Date.now()}`,
          email,
          user_metadata: {
            full_name: fullName || email.split('@')[0],
            avatar_url: DEFAULT_AVATAR,
            role: 'AIML User',
          }
        };
        setUser(mockUser);
        localStorage.setItem('houseai_user', JSON.stringify(mockUser));
        return { success: true };
      }
    } catch (error) {
      return { success: false, error: error.message || 'Signup failed' };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = (metadataUpdates) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      user_metadata: {
        ...user.user_metadata,
        ...metadataUpdates
      }
    };
    setUser(updatedUser);
    localStorage.setItem('houseai_user', JSON.stringify(updatedUser));
  };

  const loginAsDemo = () => {
    setUser(GUEST_USER);
    localStorage.setItem('houseai_user', JSON.stringify(GUEST_USER));
  };

  const logout = async () => {
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('houseai_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        updateProfile,
        loginAsDemo,
        logout,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
