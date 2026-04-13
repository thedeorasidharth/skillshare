import { useState, useEffect, useRef } from 'react';
import { Search, X, User, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { getStatusObj } from '../utils/status';

const SearchSystem = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = async (val) => {
    if (!val.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(`/api/users/search?q=${val}`);
      if (res.data.success) {
        setResults(res.data.data);
      }
    } catch (error) {
      console.error("Search failure:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query) performSearch(query);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="relative z-50 w-full max-w-md mx-auto mb-8" ref={searchRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-primary/40">
          <Search size={18} />
        </div>
        <input
          type="text"
          className="block w-full rounded-2xl border-2 border-border-secondary bg-card-bg py-3 pl-11 pr-10 text-sm font-bold text-text-dark placeholder-text-muted transition-all focus:border-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/5"
          placeholder="Search by name or mastery..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted hover:text-primary"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (query || loading) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full mt-2 w-full overflow-hidden rounded-[24px] border-2 border-border-secondary bg-card-bg shadow-2xl backdrop-blur-xl"
          >
            <div className="max-h-[400px] overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  <p className="mt-2 text-xs font-black uppercase tracking-widest text-primary/40">Scanning Directory</p>
                </div>
              ) : results.length > 0 ? (
                <div className="p-2">
                  <p className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-text-muted">Top Curations</p>
                  {results.map((user) => (
                    <Link
                      key={user._id}
                      to={`/chat/${user._id}`}
                      onClick={() => setIsOpen(false)}
                      className="group flex items-center gap-4 rounded-xl p-3 transition-all hover:bg-secondary/10"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/5 text-primary border border-border-secondary">
                        <User size={20} />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-black text-text-dark group-hover:text-primary">{user.name}</p>
                          <div className={`h-1.5 w-1.5 rounded-full ${getStatusObj(user.lastActive).isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                        </div>
                        <p className="truncate text-[10px] font-bold text-text-muted">
                          {user.skillsTeach?.join(' • ')}
                        </p>
                      </div>
                      <div className="opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100 text-primary">
                        <ArrowRight size={16} />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : query && (
                <div className="p-8 text-center">
                  <p className="text-sm font-bold text-text-muted">No compatible masters found for "{query}"</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchSystem;
