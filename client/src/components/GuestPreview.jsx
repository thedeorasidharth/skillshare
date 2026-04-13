import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Users, Sparkles } from 'lucide-react';
import api from '../utils/api';

const GuestPreview = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRandomUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/users/random');
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch random users');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRandomUsers();
  }, []);

  if (!loading && users.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary/30 px-4 py-1 text-xs font-black uppercase tracking-widest text-primary">
          <Sparkles size={14} /> Community Preview
        </div>
        <h2 className="text-4xl font-black tracking-tight text-text-dark sm:text-5xl">
          Explore Skills from the Community
        </h2>
        <p className="mt-4 text-lg font-bold text-text-muted">
          Discover what others are teaching before you join
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-[24px] bg-secondary/10" />
          ))
        ) : (
          users.map((u) => (
            <div
              key={u.id || u._id}
              onClick={() => navigate('/login')}
              className="group cursor-pointer overflow-hidden rounded-[24px] border-2 border-border-secondary bg-card-bg p-8 shadow-lg transition-all hover:-translate-y-2 hover:border-secondary/40 hover:shadow-2xl hover:shadow-primary/5 active:scale-95"
            >
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl font-black text-white shadow-lg shadow-primary/20">
                  {u.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-black text-text-dark">{u.name}</h3>
                  <span className="text-xs font-black uppercase tracking-wider text-primary opacity-60">Mastery Share</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {u.skillsTeach.map((skill, idx) => (
                  <span 
                    key={idx} 
                    className="rounded-full bg-secondary/20 px-3 py-1 text-xs font-black text-primary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              
              <div className="mt-8 flex items-center text-xs font-black uppercase tracking-widest text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Join to connect
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-12 flex justify-center">
        <button
          onClick={fetchRandomUsers}
          disabled={loading}
          className="flex items-center gap-2 rounded-full border-2 border-secondary bg-transparent px-8 py-3 text-sm font-black text-secondary transition-all hover:bg-secondary/10 active:scale-95 disabled:opacity-50"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Refresh Discoveries
        </button>
      </div>
    </section>
  );
};

export default GuestPreview;
