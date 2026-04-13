import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { X, Plus, Sparkles, User as UserIcon, Mail, ShieldCheck, Star, MessageCircle, Info } from 'lucide-react';
import SkillDiscovery from '../components/SkillDiscovery';
import { useToast } from '../context/ToastContext';
import { useNotifications } from '../context/NotificationContext';

import { getStatusObj } from '../utils/status';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const { showToast } = useToast();
  const { addNotification } = useNotifications();
  const [teachSkills, setTeachSkills] = useState(user?.skillsTeach || []);
  const [learnSkills, setLearnSkills] = useState(user?.skillsLearn || []);
  const [newTeach, setNewTeach] = useState('');
  const [newLearn, setNewLearn] = useState('');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setTeachSkills(user.skillsTeach || []);
      setLearnSkills(user.skillsLearn || []);
      setBio(user.bio || '');
    }
  }, [user]);

  const calculateCompleteness = () => {
    let score = 0;
    if (user?.name) score += 20;
    if (teachSkills.length > 0) score += 30;
    if (learnSkills.length > 0) score += 30;
    if (bio.trim().length > 0) score += 20;
    return score;
  };

  const getSuggestions = () => {
    const suggestions = [];
    if (teachSkills.length === 0) suggestions.push('Add mastery to share');
    if (learnSkills.length === 0) suggestions.push('Define learning objectives');
    if (!bio.trim()) suggestions.push('Write a professional bio');
    return suggestions;
  };

  const completeness = calculateCompleteness();
  const suggestions = getSuggestions();

  const addSkill = (type) => {
    const val = type === 'teach' ? newTeach : newLearn;
    if (!val.trim()) return;

    if (type === 'teach' && !teachSkills.includes(val.trim())) {
      setTeachSkills([...teachSkills, val.trim()]);
      setNewTeach('');
    } else if (type === 'learn' && !learnSkills.includes(val.trim())) {
      setLearnSkills([...learnSkills, val.trim()]);
      setNewLearn('');
    }
  };

  const removeSkill = (type, skill) => {
    if (type === 'teach') {
      setTeachSkills(teachSkills.filter(s => s !== skill));
    } else {
      setLearnSkills(learnSkills.filter(s => s !== skill));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put('/api/profile/skills', {
        skillsTeach: teachSkills,
        skillsLearn: learnSkills,
        bio: bio
      });
      if (res.data.success) {
        setUser(res.data.data);
        showToast('Your elite profile has been refined and saved to the registry.', 'success');
        addNotification('Your profile refinements have been committed to the mastery ledger.', 'success');
      }
    } catch (error) {
      showToast('Mastery synchronization failed. Please try again.', 'error');
    }
    setSaving(false);
  };

  const handleDiscoveryAdd = (type, skillName) => {
    if (type === 'teach') {
      if (!teachSkills.includes(skillName)) setTeachSkills([...teachSkills, skillName]);
    } else {
      if (!learnSkills.includes(skillName)) setLearnSkills([...learnSkills, skillName]);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 transition-colors duration-500 sm:px-6 sm:py-16 lg:px-8">
      <div className="overflow-hidden rounded-[40px] border-2 border-border-secondary bg-card-bg shadow-2xl shadow-secondary/5">
        <div className="border-b border-border-secondary bg-bg-luxury/20 p-8 sm:p-16">
           <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary/30 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-primary">
            <ShieldCheck size={14} /> Profile Settings
          </div>
          <h1 className="text-3xl font-black tracking-tight text-text-dark sm:text-6xl">Refine Your <br /><span className="text-primary italic font-serif">Expertise</span></h1>
          <p className="mt-4 text-lg font-bold text-text-muted sm:text-xl">Manage your directory of skills to ensure high-fidelity peer matching.</p>
          
          {/* Profile Progress Bar */}
          <div className="mt-10">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-black uppercase tracking-widest text-primary">Profile Integrity: {completeness}%</span>
              {completeness === 100 && (
                <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-green-600">
                  <ShieldCheck size={12} /> Elite Profile
                </span>
              )}
            </div>
            <div className="h-4 w-full overflow-hidden rounded-full bg-secondary/20 border-2 border-border-secondary shadow-inner">
              <div 
                className="h-full bg-primary transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(128,0,32,0.3)]"
                style={{ width: `${completeness}%` }}
              />
            </div>
            {suggestions.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted flex items-center gap-1">
                  <Info size={12} /> Optimizer Suggestions:
                </span>
                {suggestions.map(s => (
                  <span key={s} className="rounded-full bg-primary/5 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-primary/60 border border-primary/10">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-8 sm:p-16">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-text-muted pl-1">Legal Name</label>
              <div className="flex items-center justify-between gap-3 rounded-2xl border-2 border-border-secondary bg-primary/5 px-6 py-4 text-base font-black text-text-dark sm:text-lg">
                <div className="flex items-center gap-3">
                  <UserIcon size={20} className="text-primary/40" />
                  {user?.name}
                </div>
                {user && (
                  <span className="flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-muted flex items-center gap-1">
                      <div className={`h-2 w-2 rounded-full ${getStatusObj(user.lastActive).isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                      {getStatusObj(user.lastActive).text}
                    </span>
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-text-muted pl-1">Email Coordinates</label>
              <div className="flex items-center gap-3 rounded-2xl border-2 border-border-secondary bg-primary/5 px-6 py-4 text-base font-black text-text-dark sm:text-lg overflow-hidden text-ellipsis whitespace-nowrap">
                <Mail size={20} className="text-primary/40" />
                {user?.email}
              </div>
            </div>
            <div className="md:col-span-2 space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-text-muted pl-1">Professional Narrative (Bio)</label>
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Detail your journey and mastery objectives..."
                className="block w-full rounded-2xl border-2 border-border-secondary bg-card-bg py-4 px-6 text-base font-bold text-text-dark placeholder-text-muted/40 transition-all focus:border-primary/40 focus:outline-none focus:ring-0 min-h-[120px] shadow-inner"
              />
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-2">
            {/* Skills to Teach */}
            <div className="flex flex-col rounded-[32px] border-2 border-border-secondary bg-primary/5 p-6 shadow-sm sm:p-8">
              <h3 className="mb-6 text-xl font-black text-primary font-serif italic tracking-tight sm:text-2xl">Mastery to Share</h3>
              <div className="mb-8 flex flex-col gap-3 sm:flex-row">
                <input 
                  type="text" 
                  value={newTeach} 
                  onChange={(e) => setNewTeach(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill('teach')}
                  className="block w-full rounded-2xl border-2 border-border-secondary bg-card-bg py-3 px-5 text-base font-bold text-text-dark placeholder-text-muted/40 transition-all focus:border-primary/40 focus:outline-none focus:ring-0 sm:py-3.5"
                  placeholder="e.g. Advanced React"
                />
                <button 
                  onClick={() => addSkill('teach')}
                  className="flex h-12 w-full shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-xl shadow-primary/20 transition-all hover:bg-black active:scale-95 sm:h-14 sm:w-14"
                >
                  <Plus size={24} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {teachSkills.map(skill => (
                  <div key={skill} className="flex items-center gap-2 rounded-full border-2 border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-black text-primary sm:text-sm">
                    {skill}
                    <button onClick={() => removeSkill('teach', skill)} className="ml-1 text-primary/40 transition-colors hover:text-primary">
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills to Learn */}
            <div className="flex flex-col rounded-[32px] border-2 border-border-secondary bg-secondary/5 p-6 shadow-sm sm:p-8">
              <h3 className="mb-6 text-xl font-black text-primary font-serif italic tracking-tight sm:text-2xl">Objectives to Acquire</h3>
              <div className="mb-8 flex flex-col gap-3 sm:flex-row">
                <input 
                  type="text" 
                  value={newLearn} 
                  onChange={(e) => setNewLearn(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill('learn')}
                  className="block w-full rounded-2xl border-2 border-border-secondary bg-card-bg py-3 px-5 text-base font-bold text-text-dark placeholder-text-muted/40 transition-all focus:border-primary/40 focus:outline-none focus:ring-0 sm:py-3.5"
                  placeholder="e.g. Python Mastery"
                />
                <button 
                  onClick={() => addSkill('learn')}
                  className="flex h-12 w-full shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-xl shadow-primary/20 transition-all hover:bg-black active:scale-95 sm:h-14 sm:w-14"
                >
                  <Plus size={24} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {learnSkills.map(skill => (
                  <div key={skill} className="flex items-center gap-2 rounded-full border-2 border-secondary/20 bg-secondary/10 px-4 py-1.5 text-sm font-black text-secondary">
                    {skill}
                    <button onClick={() => removeSkill('learn', skill)} className="ml-1 text-secondary/40 transition-colors hover:text-secondary">
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Skill Discovery Explorer */}
          <div className="mt-12">
            <SkillDiscovery 
              onAddSkill={handleDiscoveryAdd} 
              existingSkills={[...teachSkills, ...learnSkills]} 
            />
          </div>

          <div className="mt-8 sm:mt-16">
            <button 
              onClick={handleSave}
              disabled={saving}
              className="group flex w-full items-center justify-center gap-3 rounded-[24px] bg-primary px-6 py-4 text-lg font-black text-white shadow-2xl shadow-primary/30 transition-all hover:bg-black active:scale-[0.98] disabled:opacity-70 sm:px-8 sm:py-5 sm:text-xl"
            >
              {saving ? (
                 <div className="h-6 w-6 animate-spin rounded-full border-4 border-white border-t-transparent" />
              ) : (
                'Commit Refinements'
              )}
            </button>
          </div>

          {/* User Reviews Section */}
          <div className="mt-16 border-t-2 border-border-secondary pt-16">
            <div className="mb-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-3xl font-black tracking-tight text-text-dark sm:text-4xl">Client <span className="text-primary italic font-serif">Testimonials</span></h3>
                <p className="mt-2 text-base font-bold text-text-muted">Peer reviews detailing your mastery exchange quality.</p>
              </div>
              <div className="flex h-20 items-center justify-center gap-4 rounded-3xl border-2 border-border-secondary bg-primary/5 px-8 shadow-inner">
                <div className="flex flex-col text-right">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Aggregate Score</span>
                  <span className="text-2xl font-black text-text-dark">{user?.avgRating ? user.avgRating.toFixed(1) : 'No Ratings'}</span>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-md">
                  <Star size={24} className="fill-primary text-primary" />
                </div>
              </div>
            </div>

            {(!user?.ratings || user.ratings.length === 0) ? (
              <div className="flex flex-col items-center justify-center rounded-[32px] border-2 border-border-secondary bg-card-bg p-12 text-center shadow-lg sm:p-16">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                  <MessageCircle size={32} />
                </div>
                <h4 className="text-xl font-black text-text-dark">Awaiting Feedback</h4>
                <p className="mt-2 max-w-sm text-sm font-bold text-text-muted">Engage in knowledge exchange sessions to accumulate peer testimonials.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {user.ratings.map((review, idx) => (
                  <div key={idx} className="flex flex-col justify-between rounded-[32px] border-2 border-border-secondary bg-white p-8 shadow-md transition-transform hover:-translate-y-1 hover:shadow-xl">
                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={18} 
                              className={i < review.rating ? 'fill-primary text-primary' : 'fill-border-secondary text-border-secondary'} 
                            />
                          ))}
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-text-muted">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-base font-bold leading-relaxed text-text-dark">{review.review || <span className="italic opacity-50">No written feedback provided.</span>}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
