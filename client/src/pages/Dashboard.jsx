import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Users, Video, Edit3, ArrowRight, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Welcome Hero Card */}
      <div className="relative mb-16 overflow-hidden rounded-[40px] border-2 border-border-secondary bg-card-bg p-10 shadow-2xl shadow-secondary/5 sm:p-16 transition-all duration-500">
        <div className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary/30 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-primary">
            <Sparkles size={14} /> Member Dashboard
          </div>
          <h1 className="text-4xl font-black tracking-tight text-text-dark sm:text-7xl">
            Welcome back, <br />
            <span className="text-primary italic font-serif tracking-tighter">{user?.name}</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg font-bold leading-relaxed text-text-muted sm:text-xl">
            The exchange of mastery continues. Your curated matches are awaiting your leadership and curiosity.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-6">
            <Link 
              to="/matches" 
              className="flex items-center justify-center rounded-full bg-primary px-8 py-4 text-base font-black text-white shadow-xl shadow-primary/30 transition-all hover:bg-black active:scale-95 sm:w-auto"
            >
              Explore Matches
            </Link>
            <Link 
              to="/profile" 
              className="flex items-center justify-center rounded-full border-2 border-secondary bg-transparent px-8 py-4 text-base font-black text-secondary transition-all hover:bg-secondary/10 active:scale-95 shadow-sm sm:w-auto"
            >
              Curate Profile
            </Link>
          </div>
        </div>
        {/* Soft Decorative Elements */}
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-secondary/10 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-primary/5 blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard 
          to="/profile" 
          icon={<Edit3 size={28} />} 
          title="Refine Expertise" 
          description="Update your directory of mastery and learning objectives." 
          color="primary"
        />
        <DashboardCard 
          to="/matches" 
          icon={<Users size={28} />} 
          title="Discover Talent" 
          description="Identify new partners for high-fidelity knowledge exchange." 
          color="primary"
        />
        <DashboardCard 
          to="/sessions" 
          icon={<Video size={28} />} 
          title="Learning Suite" 
          description="Access your scheduled sessions and active collaborations." 
          color="primary"
        />
      </div>
    </div>
  );
};

const DashboardCard = ({ to, icon, title, description, color }) => {
  return (
    <Link to={to} className="group flex flex-col justify-between overflow-hidden rounded-[32px] border-2 border-border-secondary bg-card-bg p-10 shadow-lg transition-all hover:-translate-y-2 hover:border-secondary/40 hover:shadow-2xl hover:shadow-primary/5 duration-500">
      <div>
        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/5 text-primary transition-transform group-hover:scale-110 group-hover:bg-primary/10">
          {icon}
        </div>
        <h3 className="text-2xl font-black text-text-dark transition-colors group-hover:text-primary">{title}</h3>
        <p className="mt-4 text-base font-bold leading-relaxed text-text-muted">{description}</p>
      </div>
      <div className="mt-10 flex items-center text-sm font-black uppercase tracking-widest text-primary opacity-0 transition-all group-hover:translate-x-2 group-hover:opacity-100">
        Enter <ArrowRight size={18} className="ml-2" />
      </div>
    </Link>
  );
};

export default Dashboard;
