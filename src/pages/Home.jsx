import { useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '../assets/vite.svg'
import heroImg from '../assets/hero.png'
import { supabase } from '../services/supabase'
import toast from 'react-hot-toast'
import { HiLogout, HiOutlineLightBulb, HiOutlineGlobe, HiOutlineUserGroup } from 'react-icons/hi'
import '../App.css'

function Home() {
  const [count, setCount] = useState(0)

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) toast.error(error.message);
    else toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-background text-textMain">
      {/* Navigation */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-borderSoft px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-black text-primary tracking-tight">KickNest</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-xl font-bold transition-all active:scale-95"
          >
            <HiLogout className="w-5 h-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center space-y-8 mb-20">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
            <div className="relative flex items-center justify-center gap-4 sm:gap-8 flex-wrap">
              <img src={heroImg} className="w-32 sm:w-40 h-auto animate-bounce duration-[3000ms]" alt="" />
              <div className="flex gap-4">
                <img src={reactLogo} className="w-12 h-12 animate-spin-slow" alt="React" />
                <img src={viteLogo} className="w-12 h-12" alt="Vite" />
              </div>
            </div>
          </div>
          
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-4xl sm:text-6xl font-black text-textMain tracking-tight">
              Welcome to the <span className="text-primary">Next Level</span>
            </h2>
            <p className="text-lg text-textSecondary font-medium">
              You've successfully authenticated. This is your personal dashboard on KickNest.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={() => setCount((c) => c + 1)}
              className="w-full sm:w-auto bg-primary text-white text-lg font-black px-8 py-4 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95"
            >
              Interactive Count: {count}
            </button>
            <code className="bg-white px-4 py-4 rounded-2xl border border-borderSoft text-textSecondary font-mono text-sm overflow-hidden whitespace-nowrap">
              src/pages/Home.jsx
            </code>
          </div>
        </section>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white p-8 rounded-[2rem] border border-borderSoft shadow-xl shadow-primary/5 hover:shadow-primary/10 transition-all group">
            <div className="w-14 h-14 bg-lavender/20 rounded-2xl flex items-center justify-center text-lavender mb-6 group-hover:scale-110 transition-transform">
              <HiOutlineLightBulb className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Modern UI</h3>
            <p className="text-textSecondary leading-relaxed">Tailwind CSS powered design with a custom color palette and responsive layouts.</p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-borderSoft shadow-xl shadow-primary/5 hover:shadow-primary/10 transition-all group">
            <div className="w-14 h-14 bg-mint/20 rounded-2xl flex items-center justify-center text-mint mb-6 group-hover:scale-110 transition-transform">
              <HiOutlineGlobe className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Supabase Auth</h3>
            <p className="text-textSecondary leading-relaxed">Secure authentication flow with real-time session tracking and protected routes.</p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-borderSoft shadow-xl shadow-primary/5 hover:shadow-primary/10 transition-all group">
            <div className="w-14 h-14 bg-peach/20 rounded-2xl flex items-center justify-center text-peach mb-6 group-hover:scale-110 transition-transform">
              <HiOutlineUserGroup className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Responsive</h3>
            <p className="text-textSecondary leading-relaxed">Designed first for mobile but optimized for tablets and desktops of all sizes.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-12 border-t border-borderSoft text-center px-4">
        <p className="text-textSecondary font-medium">© 2026 KickNest. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Home
