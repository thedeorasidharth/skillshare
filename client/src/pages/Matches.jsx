import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { getStatusObj } from '../utils/status';
import { MessageSquare, Video, Star, User, Users, Sparkles, Heart, X, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import AnimatedPage from '../components/AnimatedPage';
import SearchSystem from '../components/SearchSystem';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState([]);
  const [isScheduling, setIsScheduling] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sessionDateTime, setSessionDateTime] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Using settle to prevent one failure from blocking all data
        const [matchesRes, bookmarksRes] = await Promise.allSettled([
          api.get('/api/matches'),
          api.get('/api/users/bookmarks')
        ]);
        
        if (matchesRes.status === 'fulfilled' && matchesRes.value.data.success) {
          setMatches(matchesRes.value.data.data);
          console.log("Discovery Curations:", matchesRes.value.data);
        } else if (matchesRes.status === 'rejected' || !matchesRes.value.data.success) {
          console.error("Discovery Engine Sync Failure", matchesRes);
          showToast('Peer directory synchronization interrupted.', 'error');
        }

        if (bookmarksRes.status === 'fulfilled' && bookmarksRes.value.data.success) {
          setBookmarks(bookmarksRes.value.data.data.map(b => b._id || b.id));
          console.log("Bookmarks Vault Sync:", bookmarksRes.value.data);
        }
      } catch (error) {
        console.error("Fatal Synchronization Error:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, [showToast]);

  const toggleBookmark = async (userId) => {
    try {
      const res = await api.post('/api/users/bookmark/toggle', { targetUserId: userId });
      if (res.data.success) {
        setBookmarks(res.data.data); // Update with the new list of IDs
        showToast(res.data.message, 'success');
      }
    } catch (error) {
      showToast('Mastery preservation failed.', 'error');
    }
  };
  
  const handleOpenScheduling = (user) => {
    setSelectedUser(user);
    setIsScheduling(true);
  };

  const submitSessionRequest = async () => {
    if (!sessionDateTime) {
      showToast('Please select a preferred date and time.', 'error');
      return;
    }

    if (new Date(sessionDateTime) < new Date()) {
      showToast('Cannot select past date/time for mastery sessions.', 'error');
      return;
    }

    try {
      const res = await api.post('/api/sessions/request', { 
        receiverId: selectedUser._id,
        dateTime: sessionDateTime
      });
      if (res.data.success) {
        showToast('Session request dispatched to the elite circle. Mastery awaits!', 'success');
        setIsScheduling(false);
        setSessionDateTime('');
      }
    } catch (error) {
      showToast('Mastery synchronization interrupted. Please re-dispatched your request.', 'error');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
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
      <p className="font-black uppercase tracking-widest text-primary/40 animate-pulse text-xs">Curating Matches</p>
    </div>
  );

  return (
    <>
    <AnimatedPage>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary/30 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-primary">
            <Sparkles size={14} /> Discovery Engine
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-text-dark sm:text-6xl">Your Peer <span className="text-primary italic font-serif">Curations</span></h1>
          <p className="mt-4 text-xl font-bold text-text-muted">
            We discovered {matches.length} compatible masters ready for high-fidelity exchange.
          </p>
        </div>
        {!loading && matches.length > 0 && (
          <div className="rounded-full bg-card-bg px-6 py-2 text-sm font-black uppercase tracking-widest text-primary border-2 border-border-secondary shadow-md">
            All Potential matches
          </div>
        )}
      </div>

      <SearchSystem />

      {matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[40px] border-2 border-border-secondary bg-card-bg p-8 text-center shadow-2xl shadow-secondary/5 transition-all duration-500 sm:p-16">
          <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/5 text-primary/30 sm:h-24 sm:w-24">
            <Users size={48} />
          </div>
          <h3 className="text-2xl font-black text-text-dark sm:text-3xl">Expansion Required</h3>
          <p className="mt-4 max-w-sm text-base font-bold text-text-muted sm:text-lg">
            The directory awaits more objectives. Broaden your learning requirements to discover more matches.
          </p>
          <Link 
            to="/profile" 
            className="mt-10 rounded-full bg-primary px-8 py-3.5 text-base font-black text-white shadow-xl shadow-primary/30 transition-all hover:bg-black active:scale-95 sm:px-10 sm:py-4"
          >
            Refine Learning Goals
          </Link>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 grid-cols-1 md:gap-10 lg:grid-cols-2"
        >
          {matches.map(match => (
            <motion.div 
              key={match._id} 
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02, 
                boxShadow: "0 25px 50px -12px rgba(128, 0, 32, 0.12)",
                borderColor: "rgba(128, 0, 32, 0.2)"
              }}
              className="group relative flex flex-col overflow-hidden rounded-[32px] border-2 border-border-secondary bg-card-bg p-6 shadow-lg transition-all duration-300 sm:p-10"
            >
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
                <button 
                  onClick={() => toggleBookmark(match._id)}
                  className={`p-3 rounded-2xl transition-all active:scale-90 ${
                    bookmarks.includes(match._id) 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                      : 'bg-card-bg border-2 border-border-secondary text-primary hover:bg-secondary/10'
                  }`}
                  title={bookmarks.includes(match._id) ? "Remove Master" : "Save Master"}
                >
                  <Heart size={20} className={bookmarks.includes(match._id) ? 'fill-white' : ''} />
                </button>
              </div>
              
              <div className="mt-10">
                <p className="mb-4 text-xs font-black uppercase tracking-widest text-text-muted">Mastery to Share:</p>
                <div className="flex flex-wrap gap-2.5">
                  {match.skillsTeach.map(s => (
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
                  onClick={() => handleOpenScheduling(match)}
                  className="flex flex-[1.5] items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-black text-white shadow-xl shadow-primary/30 transition-all hover:bg-black active:scale-95"
                >
                  <Video size={18} /> Request Session
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
     </div>
    </AnimatedPage>
    
    <AnimatePresence>
      {isScheduling && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-text-dark/40 px-4 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden rounded-[40px] border-2 border-border-secondary bg-card-bg p-8 shadow-2xl sm:p-12"
          >
            <button 
              onClick={() => setIsScheduling(false)}
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-border-secondary bg-primary/5 text-primary transition-all hover:bg-secondary/20"
            >
              <X size={20} />
            </button>
            
            <div className="mb-10 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                <Calendar size={36} />
              </div>
              <h3 className="text-2xl font-black text-text-dark sm:text-3xl">Schedule Mastery</h3>
              <p className="mt-3 text-sm font-bold text-text-muted">Propose a time for your session with <span className="text-primary">{selectedUser?.name}</span></p>
            </div>

            <div className="mb-10">
              <label className="mb-3 block text-xs font-black uppercase tracking-widest text-text-muted">Preferred Date & Time</label>
              <input 
                type="datetime-local" 
                min={new Date().toISOString().slice(0, 16)}
                value={sessionDateTime}
                onChange={(e) => setSessionDateTime(e.target.value)}
                className="w-full rounded-2xl border-2 border-border-secondary bg-card-bg p-5 text-sm font-black text-text-dark transition-all focus:border-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/5 sm:text-lg"
              />
            </div>

            <button 
              onClick={submitSessionRequest}
              className="w-full rounded-[24px] bg-primary py-4 text-base font-black text-white shadow-xl shadow-primary/30 transition-all hover:bg-black active:scale-[0.98] sm:py-5 sm:text-lg"
            >
              Confirm Request
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
};

export default Matches;
