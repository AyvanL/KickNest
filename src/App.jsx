import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { supabase } from './services/supabase';
import SplashScreen from './components/SplashScreen';
import BottomNavbar from './components/BottomNavbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProfileSetup from './pages/ProfileSetup';
import Home from './pages/Home';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);

  const checkProfile = useCallback(async (userId) => {
    try {
      setCheckingProfile(true);
      const { data } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();
      
      if (data) setHasProfile(true);
      else setHasProfile(false);
    } catch {
      setHasProfile(false);
    } finally {
      setCheckingProfile(false);
    }
  }, []);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      if (initialSession) {
        checkProfile(initialSession.user.id);
      } else {
        setCheckingProfile(false);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      if (currentSession) {
        checkProfile(currentSession.user.id);
      } else {
        setHasProfile(false);
        setCheckingProfile(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [checkProfile]);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (loading || (session && checkingProfile)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen relative">
        <Toaster position="top-center" />
        <Routes>
          <Route
            path="/"
            element={
              session ? (
                hasProfile ? <Home /> : <Navigate to="/setup-profile" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/analytics"
            element={
              session ? (
                hasProfile ? <Analytics /> : <Navigate to="/setup-profile" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/profile"
            element={
              session ? (
                hasProfile ? <Profile /> : <Navigate to="/setup-profile" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/setup-profile"
            element={
              session ? (
                !hasProfile ? <ProfileSetup /> : <Navigate to="/" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/login"
            element={!session ? <Login /> : <Navigate to="/" replace />}
          />
          <Route
            path="/signup"
            element={!session ? <Signup /> : <Navigate to="/" replace />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        {/* Only show navbar if logged in and profile is setup */}
        {session && hasProfile && <BottomNavbar />}
      </div>
    </BrowserRouter>
  );
}

export default App;
