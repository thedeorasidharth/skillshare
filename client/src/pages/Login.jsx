import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';
import { useNotifications } from '../context/NotificationContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const { showToast } = useToast();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post('/api/auth/login', formData);
      if (res.data.success) {
        login(res.data.data);
        showToast('Welcome back to the elite circle!', 'success');
        addNotification('Authentication successful. Welcome back to the Mastery Circle.', 'info');
        navigate('/');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setFormData({ email: 'alice@example.com', password: 'password123' });
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/5 text-primary shadow-inner border border-border-secondary">
            <LogIn size={32} />
          </div>
          <h2 className="text-4xl font-black tracking-tight text-text-dark transition-all duration-500">Welcome Back</h2>
          <p className="mt-3 text-lg font-bold text-text-muted">Experience luxury peer-learning.</p>
        </div>

        <div className="rounded-[32px] border-2 border-border-secondary bg-card-bg p-10 shadow-2xl shadow-secondary/5 transition-all duration-500">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error is now handled by showToast */}

            <div className="space-y-2">
              <label className="text-sm font-black text-text-dark uppercase tracking-wider pl-1">Email Address</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-text-muted">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="block w-full rounded-2xl border-2 border-border-secondary bg-primary/5 py-3.5 pl-12 pr-4 text-text-dark font-bold placeholder-text-muted/50 transition-all focus:border-primary/40 focus:bg-card-bg focus:outline-none focus:ring-0"
                  placeholder="name@luxury.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-text-dark uppercase tracking-wider pl-1">Password</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-text-muted">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  className="block w-full rounded-2xl border-2 border-border-secondary bg-primary/5 py-3.5 pl-12 pr-4 text-text-dark font-bold placeholder-text-muted/50 transition-all focus:border-primary/40 focus:bg-card-bg focus:outline-none focus:ring-0"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-black text-white shadow-xl shadow-primary/20 transition-all hover:bg-black disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  Sign In <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border-secondary"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-card-bg px-2 text-text-muted font-bold tracking-widest">Or Access Elite</span></div>
            </div>

            <button 
              type="button"
              onClick={handleDemoLogin}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-border-secondary bg-card-bg px-4 py-3.5 text-sm font-black text-primary transition-all hover:bg-secondary/10"
            >
              Use Demo Account
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm font-bold text-text-muted">
              Don't have an elite account?{' '}
              <Link to="/register" className="text-primary font-black hover:underline underline-offset-4">
                Join the Circle
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-2 text-primary/40 animate-pulse">
           <Sparkles size={16} />
           <span className="text-xs font-black uppercase tracking-widest">Premium Access Only</span>
           <Sparkles size={16} />
        </div>
      </div>
    </div>
  );
};

export default Login;
