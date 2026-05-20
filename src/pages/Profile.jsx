import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import toast from 'react-hot-toast';
import { HiOutlineMail, HiCalendar, HiHeart, HiLogout, HiPencil, HiCheck, HiX, HiSparkles } from 'react-icons/hi';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(data);
        setEditData(data || {});
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) toast.error(error.message);
    else toast.success('Logged out successfully');
  };

  const handleSaveProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          full_name: editData.full_name,
          weeks_pregnant: parseInt(editData.weeks_pregnant),
          baby_name: editData.baby_name || null,
          updated_at: new Date(),
        });

      if (error) throw error;
      setProfile(editData);
      setIsEditing(false);
      toast.success('Profile updated!');
    } catch (error) {
      toast.error('Failed to update profile: ' + error.message);
    }
  };

  const handleCancel = () => {
    setEditData(profile || {});
    setIsEditing(false);
  };

  if (loading) return null;

  const initials = profile?.full_name
    ?.split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(name => name[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <>
      <div className={`min-h-screen page-gradient pb-28 sm:pb-32 transition-opacity duration-200 ${isEditing ? 'opacity-0 pointer-events-none' : ''}`}>
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 py-5 sm:py-7 space-y-5">
        <section className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/90 p-5 sm:p-7 shadow-2xl shadow-primary/10">
          <div className="absolute right-0 top-0 h-36 w-36 translate-x-10 -translate-y-10 rounded-full bg-primary/10 blur-2xl"></div>
          <div className="relative flex items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-primary text-3xl font-black text-white shadow-xl shadow-primary/25">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="mb-1 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-primary">
                  <HiSparkles className="h-4 w-4" />
                  Profile
                </div>
                <h2 className="truncate text-3xl font-black tracking-tight text-textMain">{profile?.full_name || 'KickNest User'}</h2>
                <p className="font-bold text-textSecondary">Mom-to-be</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 min-[460px]:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-white/90 p-5 rounded-2xl border border-borderSoft shadow-lg shadow-primary/5">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-peach/20 text-peach">
              <HiCalendar className="w-6 h-6" />
            </div>
            <p className="text-xs font-black text-textSecondary uppercase tracking-[0.12em]">Pregnancy Stage</p>
            <p className="mt-1 text-2xl font-black text-textMain">{profile?.weeks_pregnant} Weeks</p>
          </div>

          <div className="bg-white/90 p-5 rounded-2xl border border-borderSoft shadow-lg shadow-primary/5">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-lavender/20 text-lavender">
              <HiHeart className="w-6 h-6" />
            </div>
            <p className="text-xs font-black text-textSecondary uppercase tracking-[0.12em]">Baby's Name</p>
            <p className="mt-1 truncate text-2xl font-black text-textMain">{profile?.baby_name || 'Not set yet'}</p>
          </div>
        </section>

        <section className="bg-white/90 p-5 sm:p-6 rounded-2xl border border-borderSoft shadow-lg shadow-primary/5">
          <div className="flex items-center gap-4">
          <div className="w-12 h-12 shrink-0 bg-mint/20 rounded-2xl flex items-center justify-center text-mint">
            <HiOutlineMail className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black text-textSecondary uppercase tracking-[0.12em]">Account Status</p>
            <p className="text-lg font-black text-textMain">Active Member</p>
            <p className="text-sm font-bold text-textSecondary">Your KickNest profile is ready for tracking.</p>
          </div>
        </div>
        </section>

        <section className="rounded-3xl border border-white/80 bg-white/80 p-3 shadow-xl shadow-primary/5 grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => setIsEditing(true)}
            className="w-full flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 text-sm font-black text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 active:scale-[0.98]"
          >
            <HiPencil className="w-5 h-5" />
            Edit Profile
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-black text-red-600 transition-all hover:border-red-300 hover:bg-red-100 active:scale-[0.98]"
          >
            <HiLogout className="w-5 h-5" />
            Log out
          </button>
        </section>
      </main>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-5 min-[380px]:p-7 sm:p-8 max-w-md w-full shadow-2xl border border-borderSoft max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-textMain">Edit Profile</h3>
              <button
                onClick={handleCancel}
                className="text-textSecondary hover:text-primary transition-colors"
              >
                <HiX className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-textMain mb-2">Full Name</label>
                <input
                  type="text"
                  value={editData.full_name || ''}
                  onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                  className="w-full px-4 py-3 bg-background border-2 border-borderSoft rounded-2xl text-textMain focus:ring-0 focus:border-primary focus:bg-white transition-all outline-none"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-textMain mb-2">Pregnancy Stage (weeks)</label>
                <input
                  type="number"
                  min="0"
                  max="42"
                  value={editData.weeks_pregnant || ''}
                  onChange={(e) => setEditData({ ...editData, weeks_pregnant: e.target.value })}
                  className="w-full px-4 py-3 bg-background border-2 border-borderSoft rounded-2xl text-textMain focus:ring-0 focus:border-primary focus:bg-white transition-all outline-none"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-textMain mb-2">Baby's Name (Optional)</label>
                <input
                  type="text"
                  value={editData.baby_name || ''}
                  onChange={(e) => setEditData({ ...editData, baby_name: e.target.value })}
                  className="w-full px-4 py-3 bg-background border-2 border-borderSoft rounded-2xl text-textMain focus:ring-0 focus:border-primary focus:bg-white transition-all outline-none"
                  placeholder="Baby's name"
                />
              </div>
            </div>

            <div className="flex flex-col min-[380px]:flex-row gap-3 mt-8">
              <button
                onClick={handleSaveProfile}
                className="flex-1 flex items-center justify-center gap-2 rounded-full border border-primary bg-primary px-4 py-3 text-sm font-bold text-white transition-all hover:bg-primary/90 active:scale-95"
              >
                <HiCheck className="w-4 h-4" />
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 flex items-center justify-center gap-2 rounded-full border border-borderSoft bg-white px-4 py-3 text-sm font-bold text-textSecondary transition-all hover:border-primary/30 hover:text-primary active:scale-95"
              >
                <HiX className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
