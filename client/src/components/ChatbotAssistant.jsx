import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User as UserIcon, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const responses = {
  hello: "Hi! How can I help you today in the Mastery Circle?",
  hi: "Hello! Looking for expertise or looking to share some?",
  react: "Excellent choice. You can explore frontend masteries like React, Next.js, and Tailwind CSS in the curator.",
  ai: "Join the frontier of knowledge! Check out AI, Machine Learning, and Data Science in the curator section.",
  match: "Head over to your dashboard to discover your elite peer matches.",
  session: "You can coordinate live mastery exchanges from the Sessions page.",
  help: "I can guide you through skill curation, finding matches, or navigating sessions. What's on your mind?",
  profile: "Maintaining a refined profile is key to high-fidelity matching. Update your skills in the Profile section."
};

function getBotReply(message) {
  const msg = message.toLowerCase();
  for (let key in responses) {
    if (msg.includes(key)) return responses[key];
  }
  return "I'm still learning the depths of this circle. Try asking about skills, matches, sessions, or profile refinements.";
}

const ChatbotAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { text: "Welcome to SwapSkill Elite. How may I assist your journey today?", sender: "bot" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { text: userMsg, sender: "user" }]);
    setInput('');
    setIsTyping(true);

    // Simulate thinking delay
    setTimeout(() => {
      const reply = getBotReply(userMsg);
      setMessages(prev => [...prev, { text: reply, sender: "bot" }]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.9, originY: 1, originX: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="mb-4 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-[32px] border-2 border-border-secondary bg-card-bg shadow-2xl sm:w-[400px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-primary p-6 text-white shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest">SwapSkill Assistant</h3>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/70">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online & Ready
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 transition-colors hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 space-y-4 overflow-y-auto p-6 scrollbar-hide bg-primary/[0.02]"
            >
              {messages.map((m, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-[24px] px-5 py-3.5 text-sm shadow-sm ${
                    m.sender === 'user' 
                      ? 'bg-primary text-white rounded-br-none' 
                      : 'bg-secondary/40 text-text-dark border border-secondary/20 rounded-bl-none dark:bg-[#2A1618] dark:text-white'
                  }`}>
                    <p className="font-bold leading-relaxed">{m.text}</p>
                  </div>
                </motion.div>
              ))}
              <AnimatePresence>
                {isTyping && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-center gap-2 rounded-[24px] bg-secondary/20 px-5 py-3 dark:bg-[#2A1618]">
                       <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
                       <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:0.2s]" />
                       <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:0.4s]" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input Area */}
            <form 
              onSubmit={handleSend}
              className="flex items-center gap-2 border-t border-border-secondary bg-card-bg p-4"
            >
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about skills or matches..."
                className="flex-1 rounded-2xl border-2 border-border-secondary bg-primary/5 px-4 py-3 text-sm font-bold text-text-dark transition-all focus:border-primary/40 focus:outline-none focus:ring-0"
              />
              <button 
                type="submit"
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 transition-all hover:bg-black active:scale-95"
              >
                <Send size={20} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-2xl relative"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isOpen ? 'close' : 'open'}
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X size={32} /> : <MessageCircle size={32} />}
          </motion.div>
        </AnimatePresence>
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 animate-bounce items-center justify-center rounded-full bg-secondary text-[10px] font-black text-primary border-2 border-card-bg">
            1
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-20 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl bg-card-bg px-4 py-2 text-xs font-black uppercase tracking-widest text-primary shadow-xl border border-border-secondary pointer-events-none"
          >
            Curious? Ask the assistant <Sparkles size={14} className="inline ml-1" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatbotAssistant;
