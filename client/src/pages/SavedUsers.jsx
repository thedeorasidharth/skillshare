import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { MessageSquare, Video, Star, User, Users, Sparkles, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import AnimatedPage from '../components/AnimatedPage';
import { getStatusObj } from '../utils/status';

const SavedUsers = () => {
  const [savedUsers, setSavedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchBookmarks = async () => {
    try {
      const res = await api.get('/api/users/bookmarks');
      if (res.data.success) {
        setSavedUsers(res.data.data);
      }
    } catch (error) {
      showToast('Mastery index synchronization failed.', 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const toggleBookmark = async (userId) => {
    try {
      const res = await api.post('/api/users/bookmark/toggle', { targetUserId: userId });
      if (res.data.success) {
        // Remove from list if unbookmarked
        setSavedUsers(prev => prev.filter(u => u._id !== userId));
        showToast(res.data.message, 'success');
      }
    } catch (error) {
      showToast('Toggle failed.', 'error');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  if (loading) return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-secondary border-t-primary shadow-xl"></div>
      <p className="font-black uppercase tracking-widest text-primary/40 animate-pulse text-xs">Accessing Vault</p>
    </div>
  );

  return (
    <AnimatedPage>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-primary">
            <Heart size={14} className="fill-primary" /> Personalized Circle
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-text-dark sm:text-6xl">Your Saved <span className="text-primary italic font-serif">Masters</span></h1>
          <p className="mt-4 text-xl font-bold text-text-muted">
            A curated directory of elite talent you've marked for future collaboration.
          </p>
        </div>

        {savedUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[40px] border-2 border-border-secondary bg-card-bg p-8 text-center shadow-2xl shadow-secondary/5 transition-all duration-500 sm:p-16">
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/5 text-primary/30 sm:h-24 sm:w-24">
              <Users size={48} />
            </div>
            <h3 className="text-2xl font-black text-text-dark sm:text-3xl">Vault is Empty</h3>
            <p className="mt-4 max-w-sm text-base font-bold text-text-muted sm:text-lg">
              Explore the discovery engine to find and save masters worth revisiting.
            </p>
            <Link 
              to="/matches" 
              className="mt-10 rounded-full bg-primary px-8 py-3.5 text-base font-black text-white shadow-xl shadow-primary/30 transition-all hover:bg-black active:scale-95 sm:px-10 sm:py-4"
            >
              Explore Discovery
            </Link>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 grid-cols-1 md:gap-10 lg:grid-cols-2"
          >
            <AnimatePresence>
              {savedUsers.map(match => (
                <motion.div 
                  key={match._id} 
                  variants={itemVariants}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
                  layout
                  className="group relative flex flex-col overflow-hidden rounded-[32px] border-2 border-border-secondary bg-card-bg p-6 shadow-lg transition-all duration-300 sm:p-10"
                >
                  <button 
                    onClick={() => toggleBookmark(match._id)}
                    className="absolute top-6 right-6 p-2 rounded-xl bg-primary/10 text-primary transition-all hover:scale-110 active:scale-90"
                    title="Remove from Saved"
                  >
                    <Heart size={20} className="fill-primary" />
                  </button>

                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-6">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/5 text-primary border-2 border-border-secondary shadow-inner">
                        <User size={36} />
                      </div>
                      <div>
                        <h3 className="flex items-center gap-3 text-2xl font-black text-text-dark">
                          {match.name}
                          <Star size={18} className="fill-primary text-primary" />
                        </h3>
                        <div className="flex items-center gap-3">
                          <p className="text-sm font-black uppercase tracking-widest text-primary/60">Verified Mentor</p>
                          <span className="text-[10px] font-black uppercase tracking-widest text-text-muted flex items-center gap-1">
                            <div className={`h-2 w-2 rounded-full ${getStatusObj(match.lastActive).isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                            {getStatusObj(match.lastActive).text}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-10">
                    <p className="mb-4 text-xs font-black uppercase tracking-widest text-text-muted">Mastery to Share:</p>
                    <div className="flex flex-wrap gap-2.5">
                      {match.skillsTeach?.map(s => (
                        <span key={s} className="rounded-xl bg-secondary/30 px-4 py-1.5 text-xs font-black text-primary border border-secondary/20">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-10 flex gap-4">
                    <Link 
                      to={`/chat/${match._id}`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-border-secondary bg-card-bg px-4 py-3 text-sm font-black text-primary transition-all hover:bg-secondary/10"
                    >
                      <MessageSquare size={18} /> Chat
                    </Link>
                    <button 
                      className="flex flex-[1.5] items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-black text-white shadow-xl shadow-primary/30 transition-all hover:bg-black active:scale-95"
                    >
                      <Video size={18} /> Request Session
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </AnimatedPage>
  );
};

export default SavedUsers;
