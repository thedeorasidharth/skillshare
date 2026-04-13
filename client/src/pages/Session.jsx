import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { Video, Check, X, ExternalLink, Sparkles, Clock, Calendar, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import AnimatedPage from '../components/AnimatedPage';
import { formatSessionDate } from '../utils/date';

const SessionList = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [ratingData, setRatingData] = useState({ sessionId: null, receiverId: null, rating: 0, review: '' });
  const [submittingRating, setSubmittingRating] = useState(false);

  const { user } = useContext(AuthContext);
  const { showToast } = useToast();

  const fetchSessions = async () => {
    try {
      const res = await api.get('/api/sessions');
      if (res.data.success) {
        setSessions(res.data.data);
      }
    } catch (error) {
      showToast('Accessing your schedule failed. Directory synchronization in progress...', 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const updateSession = async (id, status) => {
    try {
      const res = await api.put(`/api/sessions/update/${id}`, { status });
      if (res.data.success) {
        showToast(`Mastery exchange is now ${status}. Readiness confirmed.`, 'success');
        fetchSessions();
      }
    } catch (error) {
      showToast('Mastery synchronization failed. Please try the update again.', 'error');
    }
  };

  const openRatingModal = (sessionId, receiverId) => {
    setRatingData({ sessionId, receiverId, rating: 0, review: '' });
    setIsRatingModalOpen(true);
  };

  const submitRating = async () => {
    if (ratingData.rating === 0) {
      showToast('Please select a rating tier.', 'error');
      return;
    }
    
    setSubmittingRating(true);
    try {
      const res = await api.post('/api/users/review/add', {
        sessionId: ratingData.sessionId,
        receiverId: ratingData.receiverId,
        rating: ratingData.rating,
        review: ratingData.review
      });

      if (res.data.success) {
        showToast('Your peer review has been inscribed into the registry.', 'success');
        setIsRatingModalOpen(false);
        // Optionally mark the session as completely rated locally to prevent double tapping
        setSessions(sessions.map(s => s._id === ratingData.sessionId ? { ...s, isRated: true } : s));
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Review synchronization failed. Try again.', 'error');
    }
    setSubmittingRating(false);
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  if (loading) return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-secondary border-t-primary shadow-xl"></div>
      <p className="font-black uppercase tracking-widest text-primary/40 animate-pulse text-xs">Accessing Schedule</p>
    </div>
  );

  return (
    <AnimatedPage>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary/30 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-primary">
          <Calendar size={14} /> Concierge
        </div>
        <h1 className="text-5xl font-black tracking-tighter text-text-dark sm:text-6xl">Elite <span className="text-primary italic font-serif">Sessions</span></h1>
        <p className="mt-4 text-xl font-bold text-text-muted">
          Manage your curated skill exchange meetings and digital salons.
        </p>
      </div>

      {sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[40px] border-2 border-border-secondary bg-card-bg p-16 text-center shadow-2xl shadow-secondary/5 transition-all duration-500">
          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/5 text-primary/30">
            <Video size={48} />
          </div>
          <h3 className="text-3xl font-black text-text-dark">No Scheduled Exchanges</h3>
          <p className="mt-4 max-w-sm text-lg font-bold text-text-muted">
            The calendar awaits your command. Request a session with a match to begin.
          </p>
        </div>
      ) : (
        <motion.div 
          variants={listVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-8"
        >
          {sessions.map(session => {
            const currentUserId = user.id || user._id;
            const isSender = session.senderId?._id === currentUserId || session.senderId === currentUserId;
            
            const partnerName = isSender 
              ? (session.receiverId?.name || 'Partner') 
              : (session.senderId?.name || 'Partner');

            const statusStyles = {
              accepted: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
              pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
              rejected: 'bg-rose-500/10 text-rose-500 border-rose-500/20'
            };

            return (
              <motion.div 
                key={session._id} 
                variants={itemVariants}
                whileHover={{ 
                  y: -4, 
                  scale: 1.01,
                  boxShadow: "0 25px 50px -12px rgba(128, 0, 32, 0.12)",
                  borderColor: "rgba(128, 0, 32, 0.3)"
                }}
                className="group relative flex flex-col items-center justify-between gap-6 rounded-[32px] border-2 border-border-secondary bg-card-bg p-6 shadow-lg transition-all duration-300 md:flex-row md:p-10"
              >
                
                <div className="flex flex-col items-center gap-6 text-center md:flex-row md:gap-8 md:text-left">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-[24px] border-2 shadow-inner transition-transform group-hover:scale-110 sm:h-20 sm:w-20 ${statusStyles[session.status]}`}>
                    <Video size={36} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-text-dark sm:text-2xl">Session with {partnerName}</h3>
                    <div className="mt-3 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                      <span className={`inline-flex items-center rounded-xl border-2 px-3 py-1 text-[10px] font-black uppercase tracking-widest sm:px-4 sm:text-xs ${statusStyles[session.status]}`}>
                        {session.status}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted sm:text-xs">
                        <Clock size={14} /> {formatSessionDate(session.dateTime)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
                  {session.status === 'pending' && !isSender && (
                    <>
                      <button 
                        onClick={() => updateSession(session._id, 'accepted')}
                        className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-black text-white shadow-xl shadow-primary/20 transition-all hover:bg-black md:flex-none md:px-8"
                      >
                        <Check size={18} /> Accept
                      </button>
                      <button 
                        onClick={() => updateSession(session._id, 'rejected')}
                        className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-secondary/40 bg-white px-6 py-3.5 text-sm font-black text-primary transition-all hover:bg-secondary/10 md:flex-none md:px-8"
                      >
                        <X size={18} /> Decline
                      </button>
                    </>
                  )}
                  {session.status === 'pending' && isSender && (
                    <div className="rounded-2xl border-2 border-border-secondary bg-primary/5 px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-primary/40 italic sm:px-10 sm:text-sm">
                      Awaiting Partner Acceptance
                    </div>
                  )}
                  {session.status === 'accepted' && session.meetingLink && (
                    <>
                      <a 
                        href={session.meetingLink} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-sm font-black text-white shadow-2xl shadow-primary/30 transition-all hover:bg-black active:scale-[0.98] md:flex-none md:px-10"
                      >
                        Join Session <ExternalLink size={18} />
                      </a>
                      {!session.isRated && (
                        <button 
                          onClick={() => openRatingModal(session._id, isSender ? session.receiverId?._id : session.senderId?._id)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-secondary/40 bg-white px-6 py-4 text-sm font-black text-primary transition-all hover:bg-secondary/10 active:scale-[0.98] md:flex-none md:px-10"
                        >
                          <Star size={18} className="text-secondary/80" /> Rate Partner
                        </button>
                      )}
                      {session.isRated && (
                        <div className="rounded-2xl border-2 border-border-secondary bg-secondary/5 px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-primary/40 italic sm:text-sm md:flex-none md:px-10 flex items-center justify-center">
                          Review Submitted
                        </div>
                      )}
                    </>
                  )}
                  {session.status === 'rejected' && (
                    <div className="rounded-2xl border-2 border-border-secondary bg-rose-500/5 px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-rose-500/60 italic sm:px-10 sm:text-sm">
                      Rejected
                    </div>
                  )}
                </div>

                <Sparkles size={24} className="absolute -right-4 -top-4 text-primary/10 opacity-0 transition-opacity group-hover:opacity-100" />
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* RATING MODAL */}
      <AnimatePresence>
        {isRatingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-text-dark/40 px-4 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg overflow-hidden rounded-[40px] border-2 border-border-secondary bg-card-bg p-8 shadow-2xl sm:p-12"
            >
              <button 
                onClick={() => setIsRatingModalOpen(false)}
                className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-border-secondary bg-primary/5 text-primary transition-all hover:bg-secondary/20"
              >
                <X size={20} />
              </button>
              
              <div className="mb-8 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                  <Star size={36} className="fill-primary" />
                </div>
                <h3 className="text-2xl font-black text-text-dark sm:text-3xl">Peer Review</h3>
                <p className="mt-3 text-sm font-bold text-text-muted">How was your knowledge exchange session?</p>
              </div>

              <div className="mb-8 flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRatingData({ ...ratingData, rating: star })}
                    className="transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star 
                      size={40} 
                      className={`transition-colors ${star <= ratingData.rating ? 'fill-primary text-primary' : 'text-border-secondary fill-transparent'}`} 
                    />
                  </button>
                ))}
              </div>

              <div className="mb-10">
                <textarea 
                  value={ratingData.review}
                  onChange={(e) => setRatingData({ ...ratingData, review: e.target.value })}
                  placeholder="Draft your thoughts (optional) ..."
                  className="w-full resize-none rounded-2xl border-2 border-border-secondary bg-card-bg p-5 text-sm font-bold text-text-dark placeholder-text-muted/40 transition-all focus:border-primary/40 focus:outline-none focus:ring-0 sm:text-base"
                  rows={4}
                />
              </div>

              <button 
                onClick={submitRating}
                disabled={submittingRating}
                className="w-full rounded-[24px] bg-primary py-4 text-base font-black text-white shadow-xl shadow-primary/30 transition-all hover:bg-black active:scale-[0.98] disabled:opacity-70 sm:py-5 sm:text-lg"
              >
                {submittingRating ? 'Inscribing...' : 'Submit Review'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
    </AnimatedPage>
  );
};

export default SessionList;
