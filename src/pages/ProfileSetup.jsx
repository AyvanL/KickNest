import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import logo from '../assets/KickNest_Logo.png';
import toast from 'react-hot-toast';
import { HiUser, HiCalendar, HiArrowRight, HiHeart } from 'react-icons/hi';

const ProfileSetup = () => {
  const [fullName, setFullName] = useState('');
  const [weeksPregnant, setWeeksPregnant] = useState('');
  const [babyName, setBabyName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName,
          weeks_pregnant: parseInt(weeksPregnant),
          baby_name: babyName || null, // Save as null if empty
          updated_at: new Date(),
        });

      if (error) throw error;
      
      toast.success('Profile updated! Welcome to KickNest.');
      window.location.href = '/';
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center page-gradient px-4 py-6 sm:px-6">
      <div className="max-w-md w-full space-y-7 bg-white/92 backdrop-blur-xl rounded-3xl shadow-2xl shadow-primary/10 p-6 min-[380px]:p-8 sm:p-10 border border-white/80">
        <div className="text-center">
          <img src={logo} alt="KickNest Logo" className="w-20 h-20 mx-auto mb-6 transform transition-transform hover:scale-110 duration-500" />
          <h2 className="text-3xl font-black text-textMain tracking-tight mb-2">Almost There!</h2>
          <p className="text-textSecondary font-medium">Let's personalize your experience</p>
        </div>

        <form onSubmit={handleProfileSubmit} className="mt-6 space-y-6">
          <div className="space-y-5">
            <div className="group relative">
              <label className="block text-sm font-bold text-textMain mb-1.5 ml-1 transition-colors group-focus-within:text-primary">What's your full name?</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-textSecondary group-focus-within:text-primary transition-colors">
                  <HiUser className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-11 pr-4 py-3.5 bg-background/50 border-2 border-borderSoft rounded-2xl text-textMain focus:ring-0 focus:border-primary focus:bg-white transition-all outline-none"
                  placeholder="Jane Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            <div className="group relative">
              <label className="block text-sm font-bold text-textMain mb-1.5 ml-1 transition-colors group-focus-within:text-primary">How many weeks pregnant are you?</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-textSecondary group-focus-within:text-primary transition-colors">
                  <HiCalendar className="h-5 w-5" />
                </div>
                <input
                  type="number"
                  min="0"
                  max="42"
                  required
                  className="block w-full pl-11 pr-4 py-3.5 bg-background/50 border-2 border-borderSoft rounded-2xl text-textMain focus:ring-0 focus:border-primary focus:bg-white transition-all outline-none"
                  placeholder="e.g. 24"
                  value={weeksPregnant}
                  onChange={(e) => setWeeksPregnant(e.target.value)}
                />
              </div>
            </div>

            <div className="group relative">
              <div className="flex flex-col min-[380px]:flex-row min-[380px]:justify-between min-[380px]:items-center gap-1 mb-1.5 ml-1">
                <label className="block text-sm font-bold text-textMain transition-colors group-focus-within:text-primary">Baby's Name (Optional)</label>
                <span className="text-xs font-medium text-textSecondary">Leave blank if not ready</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-textSecondary group-focus-within:text-primary transition-colors">
                  <HiHeart className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-11 pr-4 py-3.5 bg-background/50 border-2 border-borderSoft rounded-2xl text-textMain focus:ring-0 focus:border-primary focus:bg-white transition-all outline-none"
                  placeholder="Little KickNest"
                  value={babyName}
                  onChange={(e) => setBabyName(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center items-center py-4 px-6 text-base font-black rounded-2xl text-white bg-primary hover:bg-opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-primary/20"
          >
            {loading ? 'Saving Profile...' : (
              <span className="flex items-center">
                Complete Setup <HiArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
