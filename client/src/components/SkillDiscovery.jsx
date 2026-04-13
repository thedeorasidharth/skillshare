import { useState, useEffect } from 'react';
import { Sparkles, ArrowLeft, Plus, Check, Search, TrendingUp, Compass } from 'lucide-react';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';

const SkillDiscovery = ({ onAddSkill, existingSkills = [] }) => {
  const [currentSkill, setCurrentSkill] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [suggestion, setSuggestion] = useState(null);
  const [isFallback, setIsFallback] = useState(false);
  const { showToast } = useToast();

  // Initial Load: Popular Skills
  useEffect(() => {
    fetchPopular();
  }, []);

  const fetchPopular = async () => {
    setLoading(true);
    try {
      const res = await api.post('/api/skills/smart-suggest', { selectedSkills: [] });
      if (res.data.success) {
        setSuggestions(res.data.data);
        setCurrentSkill(null);
        setHistory([]);
      }
    } catch (err) {
      showToast('Mastery resonance failed. Please refresh.', 'error');
    }
    setLoading(false);
  };

  const exploreSkill = async (skillObj) => {
    setLoading(true);
    const skillName = typeof skillObj === 'string' ? skillObj : skillObj.name;
    
    // Use history and current selection to get smarter suggestions
    const selectedContext = [...history.map(s => s.name), skillName];

    try {
      const res = await api.post('/api/skills/smart-suggest', { selectedSkills: selectedContext });
      if (res.data.success) {
        if (currentSkill) {
          setHistory(prev => [...prev, currentSkill]);
        }
        setCurrentSkill(skillObj);
        setSuggestions(res.data.data);
        setSearchQuery('');
        setSearchResults([]);
      }
    } catch (err) {
      showToast('Exploration interrupted. Reconnecting...', 'error');
    }
    setLoading(false);
  };

  const goBack = () => {
    if (history.length === 0) {
      fetchPopular();
      return;
    }
    const previous = history[history.length - 1];
    const newHistory = history.slice(0, -1);
    
    setHistory(newHistory);
    setCurrentSkill(previous);
    
    // Re-fetch smart suggestions for the truncated context
    const selectedContext = [...newHistory.map(s => s.name), previous.name];
    api.post('/api/skills/smart-suggest', { selectedSkills: selectedContext })
       .then(res => {
         if (res.data.success) setSuggestions(res.data.data);
       });
  };

  // Debounced Search Implementation
  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchQuery.length >= 2) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
        setSuggestion(null);
        setIsFallback(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [searchQuery]);

  const performSearch = async (query) => {
    try {
      const res = await api.post('/api/skills/search', { query });
      if (res.data.success) {
        setSearchResults(res.data.data);
        setSuggestion(res.data.suggestion);
        setIsFallback(res.data.isFallback);
      }
    } catch (err) {
      showToast('Search indexing failed.', 'error');
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const getLevelInfo = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return { icon: '🌱', bg: 'bg-[#D1FAE5]', text: 'text-[#065F46]' };
      case 'intermediate': return { icon: '⚡', bg: 'bg-[#FEF3C7]', text: 'text-[#92400E]' };
      case 'advanced': return { icon: '🔥', bg: 'bg-[#800020]', text: 'text-white' };
      default: return { icon: '✨', bg: 'bg-primary/10', text: 'text-primary' };
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[32px] border-2 border-border-secondary bg-card-bg p-8 shadow-2xl transition-all duration-500">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="flex items-center gap-3 text-2xl font-black text-text-dark">
            <Sparkles size={24} className="text-primary" />
            AI Skill Curator
          </h3>
          <p className="mt-1 text-sm font-bold text-text-muted">Explore the global directory of masteries.</p>
        </div>

        <div className="relative w-full max-w-xs">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/50" />
          <input 
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search masteries..."
            className="w-full rounded-2xl border border-border-secondary bg-primary/5 py-3 pl-12 pr-4 text-sm font-bold text-text-dark focus:border-primary/40 focus:outline-none"
          />
          {searchResults.length > 0 && (
            <div className="absolute top-full z-50 mt-2 w-full rounded-2xl border border-border-secondary bg-card-bg p-2 shadow-2xl min-w-[280px]">
              {isFallback && (
                <div className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-primary/60 border-b border-border-secondary">
                  Did you mean: <span className="text-primary italic cursor-pointer hover:underline" onClick={() => { setSearchQuery(suggestion); performSearch(suggestion); }}>{suggestion}</span>?
                </div>
              )}
              {searchResults.map(s => (
                <button 
                  key={s.id}
                  onClick={() => exploreSkill(s)}
                  className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-left text-sm font-bold text-text-dark hover:bg-primary/5"
                >
                  <span className="text-base">{getLevelInfo(s.level).icon}</span>
                  {s.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Explorer Interface */}
      <div className="space-y-6">
        {/* Breadcrumbs / Back button */}
        {(currentSkill || history.length > 0) && (
          <button 
            onClick={goBack}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary/60 hover:text-primary"
          >
            <ArrowLeft size={14} /> Back to {history.length > 0 ? history[history.length-1].name : 'Popular'}
          </button>
        )}

        {/* Hero Section of Explorer */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {!currentSkill ? (
            <div className="flex items-center gap-3 rounded-2xl bg-primary/5 p-4 border border-primary/10">
              <TrendingUp size={20} className="text-primary" />
              <span className="text-sm font-black uppercase tracking-widest text-text-dark">Popular in the Circle</span>
            </div>
          ) : (
            <div className="rounded-2xl bg-primary/5 p-6 border border-primary/10">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">{currentSkill.category}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${getLevelInfo(currentSkill.level).bg} ${getLevelInfo(currentSkill.level).text}`}>
                      {getLevelInfo(currentSkill.level).icon} {currentSkill.level}
                    </span>
                  </div>
                  <h4 className="text-3xl font-black text-text-dark">{currentSkill.name}</h4>
                  <p className="mt-2 text-sm font-bold text-text-muted leading-relaxed max-w-lg">
                    {currentSkill.description || `Explore advanced concepts and related domains for ${currentSkill.name}.`}
                  </p>
                </div>
                {!existingSkills.includes(currentSkill.name) && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onAddSkill('teach', currentSkill.name)}
                      className="rounded-xl bg-primary px-4 py-2 text-xs font-black text-white shadow-lg shadow-primary/20 hover:bg-black"
                    >
                      Teach
                    </button>
                    <button 
                      onClick={() => onAddSkill('learn', currentSkill.name)}
                      className="rounded-xl border-2 border-secondary bg-transparent px-4 py-2 text-xs font-black text-secondary transition-all hover:bg-secondary/10"
                    >
                      Learn
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Exploration Grid (Spotify-style chips) */}
        <div className="flex flex-col gap-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
            {currentSkill ? `Related to ${currentSkill.name}` : "Kickstart your journey"}
          </p>
          <div className="flex flex-wrap gap-3">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="h-12 w-32 animate-pulse rounded-2xl bg-primary/5" />
              ))
            ) : (
              suggestions
                .filter(s => !existingSkills.includes(s.name))
                .map((s, idx) => (
                  <button
                    key={s.id || idx}
                    onClick={() => exploreSkill(s)}
                    className="group relative flex items-center gap-3 rounded-2xl border border-border-secondary bg-card-bg px-5 py-3.5 text-sm font-bold text-text-dark transition-all hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg active:scale-95"
                  >
                    <span className="text-base" title={s.level}>{getLevelInfo(s.level).icon}</span>
                    {s.name}
                    <Plus size={14} className="ml-1 opacity-0 transition-opacity group-hover:opacity-100 text-primary" />
                  </button>
                ))
            )}
          </div>
        </div>

        {/* Empty State / Encouragement */}
        {!loading && suggestions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Compass size={48} className="text-primary/20 animate-pulse mb-4" />
            <p className="text-sm font-black text-text-muted uppercase tracking-widest">End of the path</p>
            <button onClick={fetchPopular} className="mt-4 text-xs font-black text-primary hover:underline">Explore New Domain</button>
          </div>
        )}
      </div>

      <div className="absolute -right-8 -top-8 text-primary/5 pointer-events-none">
        <Sparkles size={160} />
      </div>
    </div>
  );
};

export default SkillDiscovery;
