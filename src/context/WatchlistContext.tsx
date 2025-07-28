import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Watchlist } from '@/types';
import { getFirestore, collection, doc, getDocs, addDoc, updateDoc, deleteDoc, onSnapshot, query, where } from 'firebase/firestore';
import { useAuth } from './AuthContext';

interface WatchlistContextType {
  watchlists: Watchlist[];
  loading: boolean;
  createWatchlist: (name: string) => Promise<void>;
  deleteWatchlist: (id: string) => Promise<void>;
  addAssetToWatchlist: (watchlistId: string, asset: any) => Promise<void>;
  removeAssetFromWatchlist: (watchlistId: string, symbol: string) => Promise<void>;
  updateWatchlist: (watchlist: Watchlist) => Promise<void>;
  // Dashboard layout persistence
  getDashboardLayout: () => Promise<{ order: string[]; enabled: string[] } | null>;
  setDashboardLayout: (order: string[], enabled: string[]) => Promise<void>;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const q = query(collection(db, 'watchlists'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lists: Watchlist[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Watchlist));
      setWatchlists(lists);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const createWatchlist = async (name: string) => {
    if (!user) return;
    await addDoc(collection(db, 'watchlists'), {
      name,
      userId: user.uid,
      assets: [],
      columns: [
        { id: 'symbol', label: 'Symbol', field: 'symbol', visible: true },
        { id: 'name', label: 'Name', field: 'name', visible: true },
      ],
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  const deleteWatchlist = async (id: string) => {
    await deleteDoc(doc(db, 'watchlists', id));
  };

  const addAssetToWatchlist = async (watchlistId: string, asset: any) => {
    const wlDoc = doc(db, 'watchlists', watchlistId);
    const wlSnap = await getDocs(query(collection(db, 'watchlists'), where('__name__', '==', watchlistId)));
    if (!wlSnap.empty) {
      const wl = wlSnap.docs[0].data() as Watchlist;
      const updatedAssets = [...(wl.assets || []), asset];
      await updateDoc(wlDoc, { assets: updatedAssets, updatedAt: new Date() });
    }
  };

  const removeAssetFromWatchlist = async (watchlistId: string, symbol: string) => {
    const wlDoc = doc(db, 'watchlists', watchlistId);
    const wlSnap = await getDocs(query(collection(db, 'watchlists'), where('__name__', '==', watchlistId)));
    if (!wlSnap.empty) {
      const wl = wlSnap.docs[0].data() as Watchlist;
      const updatedAssets = (wl.assets || []).filter(a => a.symbol !== symbol);
      await updateDoc(wlDoc, { assets: updatedAssets, updatedAt: new Date() });
    }
  };

  const updateWatchlist = async (watchlist: Watchlist) => {
    const wlDoc = doc(db, 'watchlists', watchlist.id);
    await updateDoc(wlDoc, { ...watchlist, updatedAt: new Date() });
  };

  // Dashboard layout persistence
  const getDashboardLayout = async () => {
    if (!user) return null;
    const docRef = doc(db, 'dashboard_layouts', user.uid);
    const snap = await getDocs(query(collection(db, 'dashboard_layouts'), where('__name__', '==', user.uid)));
    if (!snap.empty) {
      const data = snap.docs[0].data();
      return { order: data.order || [], enabled: data.enabled || [] };
    }
    return null;
  };
  const setDashboardLayout = async (order: string[], enabled: string[]) => {
    if (!user) return;
    const docRef = doc(db, 'dashboard_layouts', user.uid);
    await updateDoc(docRef, { order, enabled });
  };

  return (
    <WatchlistContext.Provider value={{
      watchlists, loading, createWatchlist, deleteWatchlist, addAssetToWatchlist, removeAssetFromWatchlist, updateWatchlist,
      getDashboardLayout, setDashboardLayout
    }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlists = () => {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error('useWatchlists must be used within a WatchlistProvider');
  return ctx;
}; 