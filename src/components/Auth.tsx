import React, { useState } from 'react';
import { auth, db } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthStore } from '../store/useStore';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!auth || !db) {
      setError('Firebase is not configured correctly. Please set your Firebase secrets in AI Studio.');
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const displayName = `${firstName} ${lastName}`;

        await updateProfile(user, { displayName });

        // Save metadata to Firestore
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName,
          firstName,
          lastName,
          createdAt: serverTimestamp(),
          photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`,
        });
      }
    } catch (err: any) {
      console.error('Auth Error:', err);
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoMode = () => {
    const { setUser } = useAuthStore.getState();
    setUser({
      uid: 'demo-user',
      username: 'rico_santos',
      displayName: 'Rico Santos',
      email: 'rico@itambayan.com',
      photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      isVerified: true
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-20 w-full max-w-[1000px]">
        {/* Branding Section */}
        <div className="flex flex-col text-center lg:text-left max-w-[500px]">
          <h1 className="text-brand text-7xl font-bold mb-4 tracking-tighter drop-shadow-[0_0_20px_rgba(0,210,255,0.3)]">iTambayan</h1>
          <p className="text-2xl text-text-primary leading-snug font-medium">
            iTambayan helps you connect and share with the people in your life.
          </p>
          <div className="mt-8 hidden lg:block">
             <button 
               onClick={handleDemoMode}
               className="text-brand font-semibold hover:underline bg-brand/10 px-4 py-2 rounded-lg border border-brand/20 transition-all hover:bg-brand/20"
             >
               Try Demo Mode (No Setup Required)
             </button>
          </div>
        </div>

        {/* Auth Card */}
        <div className="w-full max-w-[400px]">
          <div className="bg-surface p-4 pb-6 rounded-xl shadow-2xl border border-divider">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="First name"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-1/2 p-3 bg-background border border-divider rounded-lg focus:outline-none focus:ring-1 focus:ring-brand text-text-primary placeholder:text-text-secondary"
                  />
                  <input
                    type="text"
                    placeholder="Last name"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-1/2 p-3 bg-background border border-divider rounded-lg focus:outline-none focus:ring-1 focus:ring-brand text-text-primary placeholder:text-text-secondary"
                  />
                </div>
              )}
              <input
                type="email"
                placeholder="Email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-background border border-divider rounded-lg focus:outline-none focus:ring-1 focus:ring-brand text-text-primary placeholder:text-text-secondary"
              />
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-background border border-divider rounded-lg focus:outline-none focus:ring-1 focus:ring-brand text-text-primary placeholder:text-text-secondary"
              />
              
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-xs text-center">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand text-background py-3 rounded-lg text-xl font-bold hover:bg-brand-hover transition-all shadow-lg shadow-brand/20 disabled:opacity-50"
              >
                {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
              </button>
            </form>

            <div className="text-center mt-4">
              <a href="#" className="text-brand text-sm hover:underline opacity-80 hover:opacity-100">Forgotten password?</a>
            </div>

            <div className="my-4 border-t border-divider" />

            <div className="flex flex-col gap-3 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="bg-[#42b72a] text-white px-4 py-3 rounded-lg font-bold text-lg hover:brightness-110 transition-all shadow-lg shadow-green-500/10"
              >
                {isLogin ? 'Create new account' : 'Already have an account?'}
              </button>
              
              <button 
                onClick={handleDemoMode}
                className="lg:hidden text-brand font-semibold hover:underline"
              >
                Try Demo Mode
              </button>
            </div>
          </div>
          <p className="text-sm mt-6 text-center text-text-secondary">
            <span className="font-bold text-text-primary hover:underline cursor-pointer">Create a Page</span> for a celebrity, brand or business.
          </p>
        </div>
      </div>
    </div>
  );
};
