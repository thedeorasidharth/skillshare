import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/api/auth/signup', formData);
      if (res.data.success) {
        showToast('Welcome to the elite circle! Please sign in.', 'success');
        navigate('/login');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Registration failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/5 text-primary shadow-inner border border-border-secondary">
            <UserPlus size={32} />
          </div>
          <h2 className="text-4xl font-black tracking-tight text-text-dark transition-all duration-500">Join the Circle</h2>
          <p className="mt-3 text-lg font-bold text-text-muted">Enter the premier knowledge exchange platform.</p>
        </div>

        <div className="rounded-[32px] border-2 border-border-secondary bg-card-bg p-10 shadow-2xl shadow-secondary/5 transition-all duration-500">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Errors handled by showToast */}

            <div className="space-y-2">
              <label className="text-sm font-black text-text-dark uppercase tracking-wider pl-1">Full Name</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-text-muted">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-2xl border-2 border-border-secondary bg-primary/5 py-3.5 pl-12 pr-4 text-text-dark font-bold placeholder-text-muted/50 transition-all focus:border-primary/40 focus:bg-card-bg focus:outline-none focus:ring-0"
                  placeholder="Master of Craft"
                />
              </div>
            </div>

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
                  onChange={handleChange}
                  required
                  className="block w-full rounded-2xl border-2 border-border-secondary bg-primary/5 py-3.5 pl-12 pr-4 text-text-dark font-bold placeholder-text-muted/50 transition-all focus:border-primary/40 focus:bg-card-bg focus:outline-none focus:ring-0"
                  placeholder="name@excellence.com"
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
                  onChange={handleChange}
                  required
                  className="block w-full rounded-2xl border-2 border-border-secondary bg-primary/5 py-3.5 pl-12 pr-4 text-text-dark font-bold placeholder-text-muted/50 transition-all focus:border-primary/40 focus:bg-card-bg focus:outline-none focus:ring-0"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-black text-white shadow-xl shadow-primary/20 transition-all hover:bg-black disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  Create Elite Account <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm font-bold text-text-muted">
              Already a member?{' '}
              <Link to="/login" className="text-primary font-black hover:underline underline-offset-4">
                Sign In
              </Link>
            </p>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center gap-2 text-primary/40 animate-pulse">
           <Sparkles size={16} />
           <span className="text-xs font-black uppercase tracking-widest">Invitation Only Excellence</span>
           <Sparkles size={16} />
        </div>
      </div>
    </div>
  );
};

export default Register;
