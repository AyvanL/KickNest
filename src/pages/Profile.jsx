import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import toast from 'react-hot-toast';
import { HiOutlineMail, HiCalendar, HiHeart, HiArrowLeft, HiLogout, HiPencil, HiCheck, HiX } from 'react-icons/hi';
import { Link } from 'react-router-dom';

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

  return (
    <>
      <div className={`min-h-screen page-gradient pb-28 sm:pb-32 transition-opacity duration-200 ${isEditing ? 'opacity-0 pointer-events-none' : ''}`}>
        <header className="bg-white/80 backdrop-blur-xl border-b border-borderSoft/80 pt-10 sm:pt-12 pb-7 sm:pb-8 px-4 sm:px-6 relative">
        <Link to="/" className="absolute top-5 left-4 sm:top-6 sm:left-6 text-textSecondary hover:text-primary">
          <HiArrowLeft className="w-6 h-6" />
        </Link>
        <div className="max-w-5xl mx-auto text-center">
          <div className="w-24 h-24 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center text-primary text-4xl font-black">
            {profile?.full_name?.charAt(0) || 'U'}
          </div>
          <h2 className="text-3xl font-black text-textMain tracking-tight">{profile?.full_name || 'KickNest User'}</h2>
          <p className="text-textSecondary font-medium">Mom-to-be</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4">
        <div className="bg-white/90 p-4 sm:p-6 rounded-2xl border border-borderSoft flex items-center justify-between gap-4 shadow-lg shadow-primary/5">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 bg-peach/20 rounded-2xl flex items-center justify-center text-peach">
              <HiCalendar className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-textSecondary uppercase tracking-widest">Pregnancy Stage</p>
              <p className="text-lg font-black text-textMain">{profile?.weeks_pregnant} Weeks</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 p-4 sm:p-6 rounded-2xl border border-borderSoft flex items-center justify-between gap-4 shadow-lg shadow-primary/5">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 bg-lavender/20 rounded-2xl flex items-center justify-center text-lavender">
              <HiHeart className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-textSecondary uppercase tracking-widest">Baby's Name</p>
              <p className="text-lg font-black text-textMain">{profile?.baby_name || 'Not set yet'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 p-4 sm:p-6 rounded-2xl border border-borderSoft flex items-center gap-4 shadow-lg shadow-primary/5">
          <div className="w-12 h-12 bg-mint/20 rounded-2xl flex items-center justify-center text-mint">
            <HiOutlineMail className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-textSecondary uppercase tracking-widest">Account Status</p>
            <p className="text-lg font-black text-textMain">Active Member</p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(true)}
          className="w-full flex items-center justify-center gap-2 rounded-2xl border border-borderSoft bg-white/90 px-4 py-3 text-sm font-bold text-textSecondary transition-all hover:border-primary/30 hover:text-primary active:scale-95"
        >
          <HiPencil className="w-4 h-4" />
          Edit Profile
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 rounded-2xl border border-red-300 bg-white/90 px-4 py-3 text-sm font-bold text-red-600 transition-all hover:border-red-600 hover:bg-red-50 active:scale-95"
        >
          <HiLogout className="w-4 h-4" />
          Log out
        </button>
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
