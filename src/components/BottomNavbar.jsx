import { Link, useLocation } from 'react-router-dom';
import { HiChartBar, HiUser, HiFingerPrint } from 'react-icons/hi';

const BottomNavbar = () => {
  const location = useLocation();
  const path = location.pathname;

  const isActive = (p) => path === p;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 sm:pb-6">
      <div className="max-w-md mx-auto bg-white/92 backdrop-blur-xl border border-white/80 rounded-3xl shadow-2xl shadow-primary/20 flex items-center justify-between px-5 min-[380px]:px-8 py-3.5">
        
        {/* Analytics Link */}
        <Link 
          to="/analytics" 
          className={`min-w-16 flex flex-col items-center gap-1 transition-all ${
            isActive('/analytics') ? 'text-primary scale-110' : 'text-textSecondary hover:text-primary/70'
          }`}
        >
          <HiChartBar className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-[0.12em]">Stats</span>
        </Link>

        {/* Counter (Kick Tracker) Link */}
        <Link 
          to="/" 
          className={`min-w-16 flex flex-col items-center gap-1 transition-all ${
            isActive('/') ? 'text-primary scale-110' : 'text-textSecondary hover:text-primary/70'
          }`}
        >
          <HiFingerPrint className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-[0.12em]">Kicks</span>
        </Link>

        {/* Profile Link */}
        <Link 
          to="/profile" 
          className={`min-w-16 flex flex-col items-center gap-1 transition-all ${
            isActive('/profile') ? 'text-primary scale-110' : 'text-textSecondary hover:text-primary/70'
          }`}
        >
          <HiUser className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-[0.12em]">Profile</span>
        </Link>

      </div>
    </div>
  );
};

export default BottomNavbar;
