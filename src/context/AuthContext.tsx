import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  getAuth
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { initializeApp, deleteApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { User, UserRole, Permission } from '@/types';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: UserRole) => boolean;
  createUserByAdmin: (userData: Omit<User, 'uid' | 'createdAt' | 'lastLoginAt'> & { password: string }) => Promise<void>;
  updateUserByAdmin: (uid: string, updates: Partial<User>) => Promise<void>;
  deleteUserByAdmin: (uid: string) => Promise<void>;
  getAllUsers: () => Promise<User[]>;
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

const allPermissions: Permission[] = [
  'portfolio:view', 'portfolio:edit', 'portfolio:delete',
  'trades:view', 'trades:edit', 'trades:delete',
  'research:view', 'research:edit', 'research:delete',
  'investors:view', 'investors:edit', 'investors:delete',
  'reports:view', 'reports:generate', 'reports:export',
  'users:view', 'users:edit', 'users:delete',
  'settings:view', 'settings:edit'
];

const permissionsByRole: Record<UserRole, Permission[]> = {
  admin: allPermissions,
  manager: [
    'portfolio:view', 'portfolio:edit',
    'trades:view', 'trades:edit',
    'research:view', 'research:edit',
    'investors:view', 'investors:edit',
    'reports:view', 'reports:generate',
  ],
  analyst: [
    'portfolio:view',
    'trades:view',
    'research:view',
  ],
  investor: [
    'portfolio:view',
    'reports:view',
  ],
  compliance: [
    'portfolio:view',
    'trades:view',
    'investors:view',
    'reports:view',
  ]
};

// Mock user for demo purposes when Firebase is not configured
const mockUser: User = {
  uid: 'demo-user-id',
  email: 'admin@blackwater.com',
  displayName: 'Admin User',
  photoURL: undefined,
  role: 'admin',
  permissions: allPermissions,
  createdAt: new Date(),
  lastLoginAt: new Date(),
  isActive: true,
  twoFactorEnabled: false,
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [useMockAuth, setUseMockAuth] = useState(false);

  // Mock authentication functions
  const mockSignIn = async (email: string) => {
    if (email === 'admin@blackwater.com') {
      setUser(mockUser);
      setFirebaseUser(null);
    } else {
      throw new Error('Invalid credentials. Use admin@blackwater.com');
    }
  };

  const mockSignUp = async (email: string, password: string, displayName: string) => {
    // Mock signup - just set the user
    const role: UserRole = 'analyst';
    const newUser = { ...mockUser, email, displayName, role: role, permissions: permissionsByRole[role] || [] };
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
      const data = userDoc.data();
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || '',
        role: data.role || 'analyst',
        permissions: data.permissions || [],
        createdAt: data.createdAt?.toDate() || new Date(),
        lastLoginAt: data.lastLoginAt?.toDate() || new Date(),
        isActive: data.isActive ?? true,
        twoFactorEnabled: data.twoFactorEnabled ?? false,
        photoURL: firebaseUser.photoURL || undefined,
      };
    } else {
      // Create user document if it doesn't exist
      const newUser: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || '',
        role: 'analyst',
        permissions: permissionsByRole['analyst'],
        createdAt: new Date(),
        lastLoginAt: new Date(),
        isActive: true,
        twoFactorEnabled: false,
        photoURL: firebaseUser.photoURL || undefined,
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        ...newUser,
        createdAt: new Date(),
        lastLoginAt: new Date(),
      });
      
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

  const signUp = async (email: string, password: string, displayName: string) => {
    if (useMockAuth) {
      return mockSignUp(email, password, displayName);
    }
    
    try {
      // Determine user role - first user is admin, others are analysts
      const usersCollection = collection(db, 'users');
      const userCountSnapshot = await getDocs(usersCollection);
      const userCount = userCountSnapshot.size;
      const role: UserRole = userCount === 0 ? 'admin' : 'analyst';

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile
      await updateProfile(userCredential.user, { displayName });
      
      // Create user document
      const newUser: Omit<User, 'photoURL'> & { photoURL?: string } = {
        uid: userCredential.user.uid,
        email: userCredential.user.email || '',
        displayName: displayName,
        role: role,
        permissions: permissionsByRole[role] || [],
        createdAt: new Date(),
        lastLoginAt: new Date(),
        isActive: true,
        twoFactorEnabled: false,
      };

      if (userCredential.user.photoURL) {
        newUser.photoURL = userCredential.user.photoURL;
      }
      
      await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
      setUser(newUser as User);
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

  const createUserByAdmin = async (userData: Omit<User, 'uid' | 'createdAt' | 'lastLoginAt'> & { password: string }) => {
    if (!user || user.role !== 'admin') {
      throw new Error('Only admins can create users');
    }

    try {
      const { password, ...userInfo } = userData;
      const result = await createUserWithEmailAndPassword(auth, userInfo.email!, password);
      
      if (userInfo.displayName) {
        await updateProfile(result.user, { displayName: userInfo.displayName });
      }

      const newUser: User = {
        uid: result.user.uid,
        email: result.user.email || '',
        displayName: result.user.displayName || '',
        role: userInfo.role,
        permissions: permissionsByRole[userInfo.role] || [],
        createdAt: new Date(),
        lastLoginAt: new Date(),
        isActive: true,
        twoFactorEnabled: false,
        photoURL: result.user.photoURL || undefined,
      };

      await setDoc(doc(db, 'users', result.user.uid), {
        ...newUser,
        createdAt: new Date(),
        lastLoginAt: new Date(),
      });
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  };

  const updateUserByAdmin = async (uid: string, updates: Partial<User>) => {
    if (user?.role !== 'admin') throw new Error("Only admins can update users.");
    const userDocRef = doc(db, 'users', uid);
    const updateData: any = { ...updates };
    if (updates.role) {
      updateData.permissions = permissionsByRole[updates.role] || [];
    }
    await updateDoc(userDocRef, updateData);
  };

  const deleteUserByAdmin = async (uid: string) => {
    if (user?.role !== 'admin') throw new Error("Only admins can delete users.");
    // This only deletes the Firestore document, not the Firebase Auth user.
    // A cloud function is needed for full deletion.
    const userDocRef = doc(db, 'users', uid);
    await deleteDoc(userDocRef);
  };

  const getAllUsers = async (): Promise<User[]> => {
    if (user?.role !== 'admin') throw new Error("Only admins can view all users.");
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          uid: doc.id,
          email: data.email,
          displayName: data.displayName,
          role: data.role || 'analyst',
          permissions: data.permissions || [],
          createdAt: data.createdAt?.toDate() || new Date(),
          lastLoginAt: data.lastLoginAt?.toDate() || new Date(),
          isActive: data.isActive ?? true,
          twoFactorEnabled: data.twoFactorEnabled ?? false,
          photoURL: data.photoURL,
        };
      });
    } catch (error) {
      console.error('Get all users error:', error);
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
    const useMock = import.meta.env.VITE_USE_MOCK_AUTH === 'true';
    setUseMockAuth(useMock);

    if (useMock) {
      setUser(mockUser);
      setLoading(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userData = await fetchUserData(firebaseUser);
          setUser(userData);
          setFirebaseUser(firebaseUser);
          
          await updateDoc(doc(db, 'users', firebaseUser.uid), {
            lastLoginAt: new Date(),
          });

        } else {
          setUser(null);
          setFirebaseUser(null);
        }
      } catch (error) {
        console.error("Error during auth state change:", error);
        setUser(null);
        setFirebaseUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    firebaseUser,
    loading,
    signIn,
    signUp,
    logout,
    resetPassword,
    updateUserProfile,
    createUserByAdmin,
    updateUserByAdmin,
    deleteUserByAdmin,
    getAllUsers,
    hasPermission,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 