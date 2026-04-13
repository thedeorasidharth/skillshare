import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Users, MessageSquare, Video, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import GuestPreview from '../components/GuestPreview';
import AnimatedPage from '../components/AnimatedPage';

const Landing = () => {
  const { user, loading } = useContext(AuthContext);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <AnimatedPage>
      <div className="space-y-32 py-10 sm:py-20 overflow-hidden">
        {/* Premium Hero Section */}
        <section className="relative px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
              {/* Left Content */}
              <motion.div 
                className="relative z-20 text-center lg:text-left"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div 
                  variants={itemVariants}
                  className="mb-8 inline-flex items-center gap-2 rounded-full bg-secondary/30 px-5 py-2 text-xs font-black uppercase tracking-[0.25em] text-primary"
                >
                  <Sparkles size={14} /> Peer-to-Peer Mastery
                </motion.div>
                <motion.h1 
                  variants={itemVariants}
                  className="text-5xl font-black leading-[1.1] tracking-tighter text-text-dark sm:text-7xl xl:text-8xl"
                >
                  Learn Skills. <br />
                  Teach Skills. <br />
                  <span className="text-primary italic font-serif">Grow Together.</span>
                </motion.h1>
                <motion.p 
                  variants={itemVariants}
                  className="mt-10 max-w-xl text-lg font-bold leading-relaxed text-text-muted sm:text-xl"
                >
                  SwapSkill is the elite directory where expertise is the currency. Connect with curated matches, exchange knowledge, and transcend traditional learning.
                </motion.p>
                <motion.div 
                  variants={itemVariants}
                  className="mt-12 flex flex-col items-center gap-6 sm:flex-row lg:justify-start"
                >
                  <Link 
                    to="/register" 
                    className="group flex w-full items-center justify-center gap-3 rounded-full bg-primary px-10 py-5 text-lg font-black text-white shadow-2xl shadow-primary/30 transition-all hover:bg-black active:scale-95 sm:w-auto"
                  >
                    Get Started <ArrowRight size={22} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link 
                    to="/matches" 
                    className="flex w-full items-center justify-center rounded-full border-2 border-border-secondary bg-white/50 backdrop-blur-md px-10 py-5 text-lg font-black text-text-dark transition-all hover:bg-secondary/10 active:scale-95 sm:w-auto"
                  >
                    Explore Skills
                  </Link>
                </motion.div>
              </motion.div>

            {/* Right Visual - Skill Playground */}
            <div className="relative hidden h-[600px] lg:block animate-in fade-in zoom-in duration-1000">
              {/* Background Glows */}
              <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
              <div className="absolute top-1/3 left-2/3 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/20 blur-[80px]" />

              {/* Floating Cards */}
              <FloatingCard 
                icon={<div className="font-serif italic text-2xl">R</div>} 
                label="React Master" 
                top="15%" left="15%" 
                delay="0s" 
              />
              <FloatingCard 
                icon={<Sparkles size={24} />} 
                label="AI Specialist" 
                top="40%" left="65%" 
                delay="1.5s" 
                theme="burgundy"
              />
              <FloatingCard 
                icon={<Video size={24} />} 
                label="Video Content" 
                top="65%" left="20%" 
                delay="0.7s" 
              />
              <FloatingCard 
                icon={<Users size={24} />} 
                label="UI Design" 
                top="10%" left="70%" 
                delay="2.2s" 
              />
              <FloatingCard 
                icon={<MessageSquare size={24} />} 
                label="Marketing" 
                top="75%" left="60%" 
                delay="1s" 
                theme="burgundy"
              />

              {/* Central Connection Arc */}
              <div className="absolute top-1/2 left-1/2 flex h-64 w-64 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-dashed border-primary/20 bg-primary/5">
                <div className="h-12 w-12 rounded-full bg-primary shadow-2xl shadow-primary/40 flex items-center justify-center text-white">
                    <Sparkles size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-6">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center"
        >
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl text-text-dark">The Art of Skill Swapping</h2>
          <p className="mt-6 text-xl font-bold text-text-muted">A refined ecosystem for elite knowledge exchange.</p>
        </motion.div>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard 
            icon={<Users className="text-primary" size={28} />} 
            title="Elite Matching" 
            description="Our refined algorithm curates learning partners tailored to your specific mastery goals." 
            delay={0.1}
          />
          <FeatureCard 
            icon={<MessageSquare className="text-primary" size={28} />} 
            title="Elegant Chat" 
            description="Coordinate your exchange through a beautiful, distraction-free communication suite." 
            delay={0.2}
          />
          <FeatureCard 
            icon={<Video className="text-primary" size={28} />} 
            title="Direct Sessions" 
            description="High-fidelity video exchanges integrated seamlessly into your learning workflow." 
            delay={0.3}
          />
          <FeatureCard 
            icon={<Sparkles className="text-primary" size={28} />} 
            title="Curated Path" 
            description="Intelligent recommendations to broaden your horizons and reach your full potential." 
            delay={0.4}
          />
        </div>
      </section>

      {/* Guest Preview Section - Visible ONLY to non-logged users */}
      {!user && !loading && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <GuestPreview />
        </motion.div>
      )}

      {/* How it Works Section */}
      <section className="mx-auto max-w-6xl rounded-[32px] border-2 border-border-secondary bg-card-bg p-12 md:p-20 shadow-xl shadow-secondary/5">
        <div className="mb-20 text-center">
          <h2 className="text-4xl font-black text-text-dark tracking-tight">The Three Pillars</h2>
        </div>
        <div className="grid grid-cols-1 gap-16 md:grid-cols-3">
          <Step 
            number="01" 
            title="Curate Profile" 
            description="Define your expertise and identify the elusive skills you wish to acquire." 
          />
          <Step 
            number="02" 
            title="Find Mastery" 
            description="Discover partners whose passions complement your own for a balanced exchange." 
          />
          <Step 
            number="03" 
            title="Exchange Value" 
            description="Engage in meaningful sessions and watch your capabilities transcend boundaries." 
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center px-4 pb-12">
        <div className="mx-auto max-w-4xl rounded-[40px] bg-primary p-16 text-white shadow-3xl shadow-primary/40">
          <h2 className="text-4xl font-black tracking-tight sm:text-6xl">Step Into Excellence</h2>
          <p className="mt-6 text-xl font-bold text-secondary opacity-90 leading-relaxed">
            The premium community for free knowledge exchange awaits.
          </p>
          <Link 
            to="/register" 
            className="group mt-12 inline-flex items-center gap-3 rounded-full bg-card-bg px-12 py-5 text-lg font-black text-primary transition-all hover:bg-secondary hover:text-primary active:scale-95 shadow-xl"
          >
            Create Your Account <ArrowRight size={22} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
      </div>
    </AnimatedPage>
  );
};

const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ 
      y: -10, 
      boxShadow: "0 25px 50px -12px rgba(128, 0, 32, 0.15)",
      borderColor: "rgba(128, 0, 32, 0.4)" 
    }}
    className="group rounded-[24px] border-2 border-border-secondary bg-card-bg p-10 shadow-lg transition-all duration-300"
  >
    <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/20 transition-transform group-hover:scale-110 group-hover:bg-secondary/40">
      {icon}
    </div>
    <h3 className="text-2xl font-black text-text-dark">{title}</h3>
    <p className="mt-4 text-base font-bold leading-relaxed text-text-muted">{description}</p>
  </motion.div>
);

const Step = ({ number, title, description }) => (
  <div className="relative">
    <div className="mb-8 text-7xl font-black text-primary/10 tracking-tighter">{number}</div>
    <div className="flex items-center gap-4 mb-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
        <CheckCircle size={20} className="text-primary" />
      </div>
      <h3 className="text-2xl font-black text-text-dark">{title}</h3>
    </div>
    <p className="text-lg font-bold text-text-muted leading-relaxed">{description}</p>
  </div>
);

const FloatingCard = ({ icon, label, top, left, delay, theme = 'light' }) => (
  <div 
    className={`absolute flex items-center gap-4 rounded-3xl border-2 p-5 shadow-2xl backdrop-blur-xl transition-all duration-700 animate-float ${
      theme === 'burgundy' 
        ? 'border-primary/20 bg-primary text-white' 
        : 'border-border-secondary bg-white/70 text-text-dark'
    }`}
    style={{ top, left, animationDelay: delay }}
  >
    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
      theme === 'burgundy' ? 'bg-white/10' : 'bg-primary/5 text-primary'
    }`}>
      {icon}
    </div>
    <div className="whitespace-nowrap pr-4">
      <p className="text-xs font-black uppercase tracking-widest opacity-60">Mastery</p>
      <p className="text-sm font-black">{label}</p>
    </div>
  </div>
);

export default Landing;
