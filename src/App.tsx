/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import { useAuthStore } from './store/useStore';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Feed } from './components/Feed';
import { RightSidebar } from './components/RightSidebar';
import { Messenger } from './components/Messenger';
import { Auth } from './components/Auth';

const queryClient = new QueryClient();

export default function App() {
  const { user, isAuthenticated, isLoading, setUser } = useAuthStore();

  useEffect(() => {
    if (!auth) {
      setUser(null);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let displayName = firebaseUser.displayName || 'Anonymous User';
        let photoURL = firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;

        // Try to fetch custom profile from Firestore
        if (db) {
          try {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
              const data = userDoc.data();
              displayName = data.displayName || displayName;
              photoURL = data.photoURL || photoURL;
            }
          } catch (error) {
            console.error("Error fetching user profile:", error);
          }
        }

        // Map Firebase user to our User type
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName,
          photoURL,
          username: firebaseUser.email?.split('@')[0] || firebaseUser.uid,
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <h1 className="text-brand text-5xl font-bold animate-pulse">iTambayan</h1>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Auth />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background font-sans text-text-primary overflow-x-hidden">
        {/* Navigation */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex justify-center pt-14">
          {/* Left Sidebar - Fixed */}
          <Sidebar />

          {/* Center Feed - Flexible */}
          <div className="flex-1 max-w-[560px] min-h-[calc(100vh-3.5rem)]">
            <Feed />
          </div>

          {/* Right Sidebar - Fixed */}
          <RightSidebar />
        </main>

        {/* Floating Components */}
        <Messenger />
      </div>
    </QueryClientProvider>
  );
}
