import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../services/supabase'
import toast from 'react-hot-toast'
import { HiHeart, HiSparkles, HiRefresh, HiLogout } from 'react-icons/hi'
import { differenceInWeeks, startOfDay, endOfDay } from 'date-fns'
import '../App.css'

function Home() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [kicksCount, setKicksCount] = useState(0)
  const [recording, setRecording] = useState(false)
  const [lastKickId, setLastKickId] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch Profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // Fetch Today's Kicks
        const todayStart = startOfDay(new Date()).toISOString();
        const todayEnd = endOfDay(new Date()).toISOString();

        const { data: kicksData, error: kicksError } = await supabase
          .from('kicks')
          .select('id')
          .eq('user_id', user.id)
          .gte('created_at', todayStart)
          .lte('created_at', todayEnd)
          .order('created_at', { ascending: false });

        if (kicksError) throw kicksError;
        setKicksCount(kicksData?.length || 0);
        if (kicksData?.length > 0) setLastKickId(kicksData[0].id);

      } catch (error) {
        console.error('Error fetching data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) toast.error(error.message);
    else toast.success('Logged out successfully');
  };

  const handleRecordKick = async () => {
    if (recording) return;
    setRecording(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      const { data, error } = await supabase
        .from('kicks')
        .insert([{ user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      setKicksCount(prev => prev + 1);
      setLastKickId(data.id);
      toast.success('Baby kicked!', {
        duration: 2000,
        style: {
          borderRadius: '18px',
          background: '#FFF9F5',
          color: '#4A4A4A',
          border: '1px solid #FF8FA3',
          fontWeight: 'bold'
        },
      });
    } catch (error) {
      toast.error('Failed to record: ' + error.message);
    } finally {
      setRecording(false);
    }
  };

  const handleUndoKick = async () => {
    if (!lastKickId || recording) return;
    
    const confirmUndo = window.confirm("Undo the last kick record?");
    if (!confirmUndo) return;

    setRecording(true);
    try {
      const { error } = await supabase
        .from('kicks')
        .delete()
        .eq('id', lastKickId);

      if (error) throw error;

      setKicksCount(prev => Math.max(0, prev - 1));
      setLastKickId(null);
      toast.success('Last kick removed');
    } catch (error) {
      toast.error('Failed to undo: ' + error.message);
    } finally {
      setRecording(false);
    }
  };

  const currentWeek = useMemo(() => {
    if (!profile) return 0;
    const startDate = new Date(profile.updated_at);
    const today = new Date();
    const weeksPassed = differenceInWeeks(today, startDate);
    return profile.weeks_pregnant + weeksPassed;
  }, [profile]);

  const firstName = profile?.full_name?.split(' ')[0] || 'Ate';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col page-gradient text-textMain overflow-hidden font-sans relative">
      {/* Subtle Logout */}
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 p-3 bg-white/80 backdrop-blur-md rounded-2xl border border-borderSoft text-textSecondary shadow-lg shadow-primary/5 hover:text-primary transition-all active:scale-95"
        title="Logout"
      >
        <HiLogout className="w-5 h-5" />
      </button>

      {/* Main Content Area */}
      <div className="grow flex flex-col items-center px-4 sm:px-6 pt-8 sm:pt-10 pb-28 sm:pb-32 overflow-y-auto no-scrollbar">
        <div className="w-full max-w-lg space-y-7 sm:space-y-9">
          
          {/* Enhanced Header Info */}
          <div className="space-y-5 pr-12">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary font-extrabold text-xs uppercase tracking-[0.18em]">
                <HiHeart className="w-5 h-5" />
                <span>Happy Pregnancy</span>
              </div>
              <h2 className="text-3xl min-[380px]:text-4xl sm:text-5xl font-black text-textMain leading-[1.05] tracking-tight">
                {greeting}, <br />
                <span className="text-primary">{firstName}</span>
              </h2>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="px-4 sm:px-5 py-3 bg-white/85 shadow-lg shadow-peach/10 rounded-2xl border border-peach/30 flex items-center gap-3">
                <div className="w-2.5 h-2.5 bg-peach rounded-full"></div>
                <span className="font-black text-base sm:text-lg text-textMain">Week {currentWeek}</span>
              </div>
              
              {profile?.baby_name && (
                <div className="px-4 sm:px-5 py-3 bg-white/85 shadow-lg shadow-lavender/10 rounded-2xl border border-lavender/30 flex items-center gap-3 min-w-0">
                  <HiSparkles className="text-lavender w-5 h-5" />
                  <span className="font-black text-base sm:text-lg text-textMain truncate">Baby {profile.baby_name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Premium Kick Tracker Section */}
          <div className="relative">
            <div className="absolute -inset-3 bg-linear-to-tr from-primary/10 via-lavender/10 to-peach/10 blur-3xl rounded-[2rem] -z-10"></div>
            
            <div className="bg-white/90 backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.25rem] p-5 min-[380px]:p-7 sm:p-10 shadow-2xl shadow-primary/10 border border-white/80 relative flex flex-col items-center">
              
              <div className="relative z-10 text-center space-y-7 sm:space-y-9 w-full">
                <div className="space-y-2">
                  <h3 className="text-xs font-black text-textSecondary uppercase tracking-[0.22em]">Today's Kicks</h3>
                  <div className="text-7xl sm:text-8xl font-black text-textMain tracking-tight drop-shadow-md">{kicksCount}</div>
                </div>

                <div className="relative inline-block">
                  {/* Modern Undo Button */}
                  {lastKickId && (
                    <button
                      onClick={handleUndoKick}
                      disabled={recording}
                      className="absolute -top-2 -right-2 z-30 w-12 h-12 sm:w-14 sm:h-14 bg-white border border-borderSoft rounded-2xl flex items-center justify-center text-textSecondary hover:text-primary hover:border-primary/50 transition-all shadow-xl active:scale-95 disabled:opacity-50 group"
                      title="Undo last kick"
                    >
                      <HiRefresh className="w-6 h-6 sm:w-7 sm:h-7 group-hover:rotate-180 transition-transform duration-500" />
                    </button>
                  )}

                  <button
                    onClick={handleRecordKick}
                    disabled={recording}
                    className={`relative group flex items-center justify-center w-48 h-48 min-[380px]:w-56 min-[380px]:h-56 sm:w-64 sm:h-64 rounded-full bg-white shadow-[0_20px_50px_rgba(243,111,143,0.28)] transition-all active:scale-[0.96] disabled:opacity-80 border-[10px] sm:border-[12px] border-background ${
                      recording ? 'animate-pulse' : ''
                    }`}
                  >
                    {/* Animated Decorative Ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-dashed border-primary/20 animate-spin-slow"></div>
                    
                    <div className="flex flex-col items-center gap-4 relative z-10">
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 group-hover:scale-175 transition-transform"></div>
                        <HiHeart className={`w-20 h-20 min-[380px]:w-24 min-[380px]:h-24 sm:w-28 sm:h-28 text-primary transition-all duration-500 relative z-10 ${
                          recording ? 'scale-110 rotate-12' : 'group-hover:scale-110'
                        }`} />
                      </div>
                      <span className="text-[11px] font-black text-textMain uppercase tracking-[0.16em] pt-1">Tap to Record</span>
                    </div>
                  </button>
                </div>

                {/* Quick Stats Dashboard */}
                <div className="grid grid-cols-1 min-[380px]:grid-cols-3 gap-2.5 w-full pt-2">
                  <div className="bg-background/70 rounded-2xl p-3 border border-borderSoft/70 flex min-[380px]:flex-col items-center justify-between min-[380px]:justify-center gap-2">
                    <span className="text-[10px] font-bold text-textSecondary uppercase tracking-[0.08em]">Avg/day</span>
                    <span className="text-sm font-black text-textMain">16 kicks</span>
                  </div>
                  <div className="bg-background/70 rounded-2xl p-3 border border-borderSoft/70 flex min-[380px]:flex-col items-center justify-between min-[380px]:justify-center gap-2">
                    <span className="text-[10px] font-bold text-textSecondary uppercase tracking-[0.08em]">Most Active</span>
                    <span className="text-sm font-black text-textMain">8 PM</span>
                  </div>
                  <div className="bg-background/70 rounded-2xl p-3 border border-borderSoft/70 flex min-[380px]:flex-col items-center justify-between min-[380px]:justify-center gap-2">
                    <span className="text-[10px] font-bold text-textSecondary uppercase tracking-[0.08em]">Weekly Trend</span>
                    <span className="text-sm font-black text-textMain">Stable</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default Home
