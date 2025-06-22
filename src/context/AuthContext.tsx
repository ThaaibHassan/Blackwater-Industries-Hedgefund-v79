import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User, UserRole, Permission } from '@/types';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

// Mock user for demo purposes when Firebase is not configured
const mockUser: User = {
  uid: 'demo-user-id',
  email: 'admin@blackwater.com',
  displayName: 'Admin User',
  photoURL: undefined,
  role: 'admin',
  permissions: [
    'portfolio:view', 'portfolio:edit', 'portfolio:delete',
    'trades:view', 'trades:edit', 'trades:delete',
    'research:view', 'research:edit', 'research:delete',
    'investors:view', 'investors:edit', 'investors:delete',
    'reports:view', 'reports:generate', 'reports:export',
    'users:view', 'users:edit', 'users:delete',
    'settings:view', 'settings:edit'
  ],
  createdAt: new Date(),
  lastLoginAt: new Date(),
  isActive: true,
  twoFactorEnabled: false,
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(mockUser);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [useMockAuth, setUseMockAuth] = useState(true);

  // Check if Firebase is properly configured
  useEffect(() => {
    const checkFirebaseConfig = () => {
      try {
        // Try to access Firebase auth to see if it's configured
        if (!auth || !db) {
          throw new Error('Firebase not configured');
        }
        setUseMockAuth(false);
      } catch (error) {
        console.warn('Firebase not configured, using mock authentication');
        setUseMockAuth(true);
        setLoading(false);
      }
    };
    
    checkFirebaseConfig();
  }, []);

  // Mock authentication functions
  const mockSignIn = async (email: string) => {
    if (email === 'admin@blackwater.com') {
      setUser(mockUser);
      setFirebaseUser(null);
    } else {
      throw new Error('Invalid credentials. Use admin@blackwater.com');
    }
  };

  const mockSignUp = async (email: string, password: string, displayName: string, role: UserRole) => {
    // Mock signup - just set the user
    const newUser = { ...mockUser, email, displayName, role };
    setUser(newUser);
    setFirebaseUser(null);
  };

  const mockLogout = async () => {
    setUser(null);
    setFirebaseUser(null);
  };

  const mockResetPassword = async (email: string) => {
    console.log('Mock password reset for:', email);
  };

  const mockUpdateUserProfile = async (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  // Real Firebase authentication functions
  const fetchUserData = async (firebaseUser: FirebaseUser): Promise<User> => {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    
    if (userDoc.exists()) {
      return userDoc.data() as User;
    } else {
      // Create new user document
      const newUser: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || '',
        photoURL: firebaseUser.photoURL || undefined,
        role: 'analyst',
        permissions: ['portfolio:view', 'trades:view', 'research:view'],
        createdAt: new Date(),
        lastLoginAt: new Date(),
        isActive: true,
        twoFactorEnabled: false,
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      return newUser;
    }
  };

  const signIn = async (email: string, password: string) => {
    if (useMockAuth) {
      return mockSignIn(email);
    }
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userData = await fetchUserData(userCredential.user);
      setUser(userData);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, displayName: string, role: UserRole) => {
    if (useMockAuth) {
      return mockSignUp(email, password, displayName, role);
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile
      await updateProfile(userCredential.user, { displayName });
      
      // Create user document
      const newUser: User = {
        uid: userCredential.user.uid,
        email: userCredential.user.email || '',
        displayName: displayName,
        photoURL: userCredential.user.photoURL || undefined,
        role: role,
        permissions: ['portfolio:view', 'trades:view', 'research:view'],
        createdAt: new Date(),
        lastLoginAt: new Date(),
        isActive: true,
        twoFactorEnabled: false,
      };
      
      await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
      setUser(newUser);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const logout = async () => {
    if (useMockAuth) {
      return mockLogout();
    }
    
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    if (useMockAuth) {
      return mockResetPassword(email);
    }
    
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (useMockAuth) {
      return mockUpdateUserProfile(updates);
    }
    
    if (!user) throw new Error('No user logged in');

    try {
      await updateDoc(doc(db, 'users', user.uid), updates);
      setUser({ ...user, ...updates });
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const hasPermission = (permission: Permission): boolean => {
    return user?.permissions.includes(permission) || false;
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role || false;
  };

  // Listen to auth state changes (only for real Firebase)
  useEffect(() => {
    if (useMockAuth) return;
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        const userData = await fetchUserData(firebaseUser);
        setUser(userData);
        setFirebaseUser(firebaseUser);
        
        // Update last login
        await updateDoc(doc(db, 'users', firebaseUser.uid), {
          lastLoginAt: new Date(),
        });

      } else {
        setUser(null);
        setFirebaseUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [useMockAuth]);

  const value = {
    user,
    firebaseUser,
    loading,
    signIn,
    signUp,
    logout,
    resetPassword,
    updateUserProfile,
    hasPermission,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 