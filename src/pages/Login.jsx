import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabase';
import logo from '../assets/KickNest_Logo.png';
import toast from 'react-hot-toast';
import { HiMail, HiLockClosed, HiArrowRight, HiEye, HiEyeOff } from 'react-icons/hi';

const Login = () => {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState(location.state?.password || '');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;
      
      toast.success('Welcome back to KickNest!');
      navigate('/');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center page-gradient px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-7 bg-white/92 backdrop-blur-xl rounded-3xl shadow-2xl shadow-primary/10 p-6 min-[380px]:p-8 sm:p-10 border border-white/80">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
            <img src={logo} alt="KickNest Logo" className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-6 transform transition-transform hover:scale-110 duration-500" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-textMain tracking-tight mb-2">Welcome Back</h2>
          <p className="text-textSecondary text-base sm:text-lg font-medium">Ready to continue your journey?</p>
        </div>

        <form onSubmit={handleLogin} className="mt-6 space-y-5">
          <div className="space-y-4">
            <div className="group relative">
              <label className="block text-sm font-bold text-textMain mb-1.5 ml-1 transition-colors group-focus-within:text-primary">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-textSecondary group-focus-within:text-primary transition-colors">
                  <HiMail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-11 pr-4 py-3.5 bg-background/50 border-2 border-borderSoft rounded-2xl text-textMain placeholder-textSecondary/50 focus:ring-0 focus:border-primary focus:bg-white transition-all outline-none text-base"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="group relative">
              <label className="block text-sm font-bold text-textMain mb-1.5 ml-1 transition-colors group-focus-within:text-primary">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-textSecondary group-focus-within:text-primary transition-colors">
                  <HiLockClosed className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full pl-11 pr-12 py-3.5 bg-background/50 border-2 border-borderSoft rounded-2xl text-textMain placeholder-textSecondary/50 focus:ring-0 focus:border-primary focus:bg-white transition-all outline-none text-base"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-textSecondary hover:text-primary transition-colors"
                >
                  {showPassword ? <HiEyeOff className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <button type="button" className="text-xs font-bold text-primary hover:text-opacity-80 transition-colors">Forgot password?</button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center items-center py-4 px-6 border border-transparent text-base font-black rounded-2xl text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-4 focus:ring-primary/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 shadow-lg shadow-primary/20"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Authenticating...
              </span>
            ) : (
              <span className="flex items-center">
                Sign In <HiArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </button>
        </form>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-borderSoft"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="px-3 bg-white text-textSecondary font-bold tracking-widest">Or</span></div>
        </div>

        <p className="text-center text-textSecondary font-medium">
          New to KickNest?{' '}
          <Link to="/signup" className="text-primary font-black hover:underline underline-offset-4 decoration-2 transition-all">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
