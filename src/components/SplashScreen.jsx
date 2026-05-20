import { useEffect, useState } from 'react';
import logo from '../assets/KickNest_Logo.png';

const SplashScreen = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onFinish, 800); // Allow more time for smooth exit animation
    }, 2200);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-background z-[100] transition-all duration-700 ease-in-out ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'
      }`}
    >
      <div className="relative text-center">
        {/* Animated Glow Background */}
        <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full animate-pulse"></div>
        
        <div className="relative space-y-6">
          <div className="relative inline-block transform transition-transform animate-bounce duration-[2000ms]">
            <img 
              src={logo} 
              alt="KickNest Logo" 
              className="w-32 h-32 sm:w-40 sm:h-40 mx-auto drop-shadow-2xl" 
            />
          </div>
          
          <div className="overflow-hidden">
            <h1 className="text-4xl sm:text-5xl font-black text-primary tracking-tighter animate-reveal">
              KickNest
            </h1>
            <div className="h-1 w-0 bg-primary mx-auto rounded-full mt-2 animate-expand"></div>
          </div>

          <p className="text-xs font-black uppercase tracking-[0.22em] text-textSecondary/70">
            Developed by AyTech 2026.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
