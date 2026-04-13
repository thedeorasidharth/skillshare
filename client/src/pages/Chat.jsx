import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { Send, ArrowLeft, MessageSquare, Sparkles, User as UserIcon, Paperclip, FileText, Download, Eye } from 'lucide-react';
import { io } from 'socket.io-client';
import { getStatusObj } from '../utils/status';

const Chat = () => {
  const { userId } = useParams(); // The other user's ID
  const { user } = useContext(AuthContext); // Current user
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [chatPartner, setChatPartner] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const fetchChatPartner = async () => {
    try {
      const res = await api.get(`/api/users/${userId}`);
      if (res.data.success) {
        setChatPartner(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch chat partner details", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/api/chat/history/${userId}`);
      if (res.data.success) {
        setMessages(res.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchChatPartner();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    if (!user) return;
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5001');

    socket.emit('activity_ping', { userId: user.id || user._id, dbConnected: true });
    
    const interval = setInterval(() => {
      socket.emit('activity_ping', { userId: user.id || user._id, dbConnected: true });
    }, 30000);

    socket.on('user_status_update', (data) => {
      if (chatPartner && (data.userId === chatPartner.id || data.userId === chatPartner._id)) {
        setChatPartner(prev => ({ ...prev, lastActive: data.lastActive }));
      }
    });

    return () => {
      clearInterval(interval);
      socket.disconnect();
    };
  }, [user, chatPartner?._id, chatPartner?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e, type = 'text', fileData = null) => {
    if (e) e.preventDefault();
    if (type === 'text' && !text.trim()) return;
    
    try {
      const payload = { 
        receiverId: userId, 
        messageType: type,
        ...(type === 'text' ? { text } : { fileUrl: fileData.fileUrl, fileName: fileData.fileName, fileType: fileData.fileType })
      };
      
      const res = await api.post('/api/chat/send', payload);
      if (res.data.success) {
        if (type === 'text') setText('');
        fetchMessages();
      }
    } catch (error) {
      console.error("Failed to send message");
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    try {
      const res = await api.post('/api/chat/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        await sendMessage(null, 'file', res.data.data);
      }
    } catch (error) {
      console.error('File upload failed');
    } finally {
      setIsUploading(false);
      if(fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const isImage = (fileName) => {
    if (!fileName) return false;
    const ext = fileName.split('.').pop().toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif'].includes(ext);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-12 sm:px-6 lg:px-8 transition-colors duration-500">
      <div className="flex flex-col h-[85vh] sm:h-[80vh] overflow-hidden rounded-3xl sm:rounded-[40px] border-2 border-border-secondary bg-card-bg shadow-2xl shadow-secondary/5">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-border-secondary bg-bg-luxury/20 px-4 py-4 sm:px-8 sm:py-6">
          <div className="flex items-center gap-3 sm:gap-6">
            <Link to="/matches" className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl border-2 border-border-secondary bg-card-bg text-primary transition-all hover:bg-secondary/20">
              <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
            </Link>
            <div className="flex items-center gap-4">
              <div className="relative flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-primary/5 text-primary border-2 border-border-secondary shadow-inner">
                <UserIcon size={20} className="sm:w-7 sm:h-7" />
                {chatPartner && (
                  <div className={`absolute bottom-0 right-0 h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full border-2 border-card-bg ${getStatusObj(chatPartner.lastActive).isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                )}
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-black text-text-dark">{chatPartner?.name || 'User'}</h2>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-primary/60">
                    {chatPartner ? getStatusObj(chatPartner.lastActive).text : 'Secure Connection'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <Sparkles size={24} className="text-primary/20 hidden sm:block" />
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-10 space-y-4 sm:space-y-8 bg-white/50">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center opacity-30">
              <div className="mb-4 sm:mb-6 rounded-[24px] bg-secondary/30 p-4 sm:p-6"><MessageSquare size={32} className="text-primary sm:w-12 sm:h-12" /></div>
              <p className="text-text-muted font-black uppercase tracking-widest text-[10px] sm:text-xs">Initiate the Exchange</p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isMine = msg.sender === user.id || msg.sender === user._id;
              const isFile = msg.messageType === 'file';
              
              return (
                <div key={idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4`}>
                  <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl sm:rounded-[24px] px-4 py-3 sm:px-6 sm:py-4 shadow-md ${
                    isMine 
                      ? 'bg-primary text-white rounded-br-none shadow-primary/10' 
                      : 'bg-primary/5 text-text-dark border-2 border-border-secondary rounded-bl-none shadow-secondary/5'
                  }`}>
                    {isFile ? (
                      <div className="space-y-3">
                        {isImage(msg.fileName) ? (
                          <div className="relative group overflow-hidden rounded-xl border border-white/20">
                            <img 
                              src={msg.fileUrl} 
                              alt={msg.fileName}
                              className="max-h-48 sm:max-h-64 w-full object-cover transition-transform group-hover:scale-105"
                            />
                            <a 
                              href={msg.fileUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Eye size={24} className="text-white" />
                            </a>
                          </div>
                        ) : (
                          <div className={`flex items-center gap-2 sm:gap-3 rounded-xl p-2 sm:p-3 border ${isMine ? 'bg-white/10 border-white/20' : 'bg-primary/10 border-primary/20'}`}>
                            <div className={`p-1.5 sm:p-2 rounded-lg ${isMine ? 'bg-white/20' : 'bg-primary/20'}`}>
                              <FileText size={18} className="sm:w-5 sm:h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs sm:text-sm font-bold truncate">{msg.fileName}</p>
                              <p className="text-[8px] sm:text-[10px] uppercase opacity-60">File Attachment</p>
                            </div>
                            <a 
                              href={msg.fileUrl} 
                              download={msg.fileName}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`p-1.5 sm:p-2 rounded-lg transition-colors ${isMine ? 'hover:bg-white/20' : 'hover:bg-primary/20'}`}
                            >
                              <Download size={16} className="sm:w-18 sm:h-18" />
                            </a>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm sm:text-base font-bold leading-relaxed">{msg.text}</p>
                    )}
                    <p className={`mt-2 text-[8px] sm:text-[10px] font-black uppercase tracking-tighter ${isMine ? 'text-white/60' : 'text-primary/40'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-bg-luxury/20 p-4 sm:p-8 border-t border-border-secondary">
          <form onSubmit={sendMessage} className="flex gap-2 sm:gap-4">
            <input 
              type="file"
              hidden
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt"
            />
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center shrink-0 rounded-xl sm:rounded-2xl border-2 border-border-secondary bg-card-bg text-primary transition-all hover:bg-secondary/20 active:scale-90 disabled:opacity-30"
            >
              <Paperclip size={20} className={`sm:w-6 sm:h-6 ${isUploading ? 'animate-pulse' : ''}`} />
            </button>
            <input 
              type="text" 
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Express..."
              className="flex-1 rounded-xl sm:rounded-2xl border-2 border-border-secondary bg-card-bg px-4 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-bold text-text-dark placeholder-text-muted/40 transition-all focus:border-primary/40 focus:outline-none focus:ring-0 shadow-inner"
            />
            <button 
              type="submit"
              disabled={(!text.trim() && !isUploading) || isUploading}
              className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center shrink-0 rounded-xl sm:rounded-2xl bg-primary text-white shadow-xl shadow-primary/20 transition-all hover:bg-black hover:shadow-primary/40 active:scale-90 disabled:opacity-30"
            >
              <Send size={20} className="sm:w-6 sm:h-6" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
