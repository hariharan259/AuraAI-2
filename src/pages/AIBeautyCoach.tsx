import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAura } from '../context/AuraContext';
import { MessageSquare, Send, MessageCircle, Sparkles, User, Brain } from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export default function AIBeautyCoach() {
  const navigate = useNavigate();
  const { state } = useAura();
  const result = state.analysisResult;

  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'ai', text: 'Hello! I am your AI Beauty Intelligence Coach. Ask me anything about your current skin metrics, formulation safety, or routine improvements.' }
  ]);
  const [input, setInput] = useState('');

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 px-6 min-h-[75vh]">
        <MessageSquare size={48} className="text-cyan-400 mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold text-white font-display">No Diagnostics Found</h2>
        <p className="text-aura-muted text-sm max-w-sm mt-2 mb-6">
          Please run your skin diagnostics scan first to wake your AI Beauty Coach.
        </p>
        <button 
          className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition shadow-glow-primary"
          onClick={() => navigate('/profile')}
        >
          Start Analysis
        </button>
      </div>
    );
  }

  const handleSend = (textToSend = input) => {
    if (!textToSend.trim()) return;

    const newMsgs = [...messages, { sender: 'user' as const, text: textToSend }];
    setMessages(newMsgs);
    setInput('');

    // Simulate AI response based on questions
    setTimeout(() => {
      let reply = "Based on your clinical parameters, maintaining hydration at 80%+ will optimize cell renewal cycles.";
      if (textToSend.toLowerCase().includes('acne')) {
        reply = "Your acne risk is currently flagged. I recommend applying your 2% Salicylic Acid Gel Cleanser during the morning cycle to dissolve pore lipid congestion.";
      } else if (textToSend.toLowerCase().includes('sleep')) {
        reply = "Yes, nocturnal mitosis peaks between 11 PM and 2 AM. Aim for 8 hours of sleep to support the stratum corneum lipid barrier restoration.";
      } else if (textToSend.toLowerCase().includes('hair') || textToSend.toLowerCase().includes('scalp')) {
        reply = "Your scalp health is rated at 76%. I advise applying a rosemary scalp serum twice weekly and washing with a pH-balanced sulfate-free formula.";
      }
      setMessages([...newMsgs, { sender: 'ai' as const, text: reply }]);
    }, 1000);
  };

  const presets = [
    'How do I reduce my acne risk score?',
    'What role does sleep play in cell repair?',
    'How should I treat scalp dryness?'
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn text-aura-text">
      
      {/* Header */}
      <header className="mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-3">
          <MessageSquare size={12} /> Conversational Assistant
        </span>
        <h1 className="text-3xl font-extrabold text-white font-display">AI Beauty Coach</h1>
        <p className="text-sm text-aura-muted mt-1">Chat in real-time with your digital assistant to receive personalized skin and hair care advice.</p>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Chat Window (8 Cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient flex flex-col min-h-[480px] justify-between">
          
          {/* Chat Messages */}
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto max-h-[360px] mb-4 pr-2">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
              >
                <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-white ${msg.sender === 'user' ? 'bg-cyan-600' : 'bg-purple-600'}`}>
                  {msg.sender === 'user' ? <User size={14} /> : <Brain size={14} />}
                </div>
                <div className={`p-3.5 rounded-xl text-xs leading-relaxed ${msg.sender === 'user' ? 'bg-cyan-950/40 text-white border border-cyan-500/20' : 'bg-black/45 text-white/95 border border-aura-border'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Form and Presets */}
          <div>
            {/* Presets */}
            <div className="flex gap-2 flex-wrap mb-4">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p)}
                  className="px-3 py-1.5 bg-black/45 border border-white/5 hover:border-cyan-500/40 hover:bg-cyan-950/10 text-white/80 hover:text-white text-[10px] rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-100"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Ask about active compounds, routines, UV indices..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 px-4 py-3 bg-black/45 border border-aura-border rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500/50"
              />
              <button 
                onClick={() => handleSend()}
                className="p-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-all duration-300 hover:scale-[1.05] active:scale-100 flex items-center justify-center shrink-0 shadow-glow-primary"
              >
                <Send size={14} />
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Coaching Goals Cards (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          <div className="p-6 rounded-2xl bg-aura-panel border border-aura-border glass-gradient">
            <h3 className="text-sm font-bold text-white mb-4">Coaching Targets</h3>
            
            <div className="flex flex-col gap-4">
              
              <div className="p-3 rounded-xl bg-black/25 border border-white/5">
                <div className="text-[10px] font-bold text-cyan-400 uppercase mb-0.5">Hydration Target</div>
                <div className="text-xs font-bold text-white">Drink 9 glasses daily</div>
                <p className="text-[10px] text-aura-muted mt-1 leading-relaxed">Locks humectant moisture in your skin, boosting elasticity indices.</p>
              </div>

              <div className="p-3 rounded-xl bg-black/25 border border-white/5">
                <div className="text-[10px] font-bold text-purple-400 uppercase mb-0.5">Sleep Target</div>
                <div className="text-xs font-bold text-white">8 hours rest tonight</div>
                <p className="text-[10px] text-aura-muted mt-1 leading-relaxed">Ensures peak clock-gene activation for epidermal barrier repair.</p>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
