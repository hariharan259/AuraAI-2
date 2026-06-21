import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, HelpCircle, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

const PRESET_ANSWERS: Record<string, string> = {
  "Why am I getting acne?": "Acne is primarily triggered by sebaceous gland hyper-activity (excess sebum) and clogging of the follicular openings by dead skin cells (keratinocytes), creating an anaerobic environment where Cutibacterium acnes bacteria thrives. High stress levels spike cortisol, which directly activates androgenic receptors to increase oil output. A salicylic acid cleanser helps dissolve this pore-clogging sebum.",
  "How do I reduce pigmentation?": "Hyperpigmentation develops when melanocyte cells are overstimulated by UV radiation or post-inflammatory stress, causing excess melanin transfer. To fade this, we recommend tyrosinase inhibitors like Vitamin C (L-Ascorbic Acid) or Alpha Arbutin in the morning, which prevent melanin synthesis, and Azelaic Acid at night to target inflamed vascular pigment.",
  "Which routine should I follow?": "You should follow the personalized morning and evening routines crafted by our Beauty Coach. The morning routine focuses on hydration, sebum control (Niacinamide), and mineral UV protection. The evening routine focuses on cellular exfoliation, barrier repair (Ceramides), and active treatments like Retinol or Salicylic Acid.",
  "How can I improve hydration?": "Skin hydration requires both humectants (water-binding agents) and occlusives (water-locking lipids). Apply multi-weight Hyaluronic Acid to slightly damp skin to draw moisture into the epidermal layers, then immediately seal it with a Ceramide-rich barrier cream to reduce transepidermal water loss (TEWL). Additionally, target drinking at least 8-10 glasses of water daily."
};

export default function SkincareCoachChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Hello! I am your AI Skincare Coach. Ask me any questions about your skin analysis, product ingredients, or routine instructions.",
      timestamp: new Date()
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // User message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let botResponse = "That is a great question. In clinical dermatology, we focus on maintaining the lipid integrity of the stratum corneum. I recommend reviewing your custom Active Ingredient ledger and testing that habit change in the Outcome Simulator.";
      
      // Check presets
      for (const preset of Object.keys(PRESET_ANSWERS)) {
        if (text.toLowerCase().includes(preset.toLowerCase()) || preset.toLowerCase().includes(text.toLowerCase())) {
          botResponse = PRESET_ANSWERS[preset];
          break;
        }
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-[500px] border border-aura-border bg-aura-panel rounded-2xl overflow-hidden glass-gradient">
      
      {/* Bot Header */}
      <div className="flex items-center gap-3 p-4 border-b border-aura-border bg-teal-950/20">
        <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400">
          <Bot size={20} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-aura-text m-0">AuraAI Clinical Coach</h4>
          <span className="text-[10px] text-teal-400 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Online • Medical Assistant
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
            
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 ${
              msg.sender === 'user' 
                ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' 
                : 'bg-teal-500/10 border-teal-500/30 text-teal-400'
            }`}>
              {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>

            {/* Message bubble */}
            <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-purple-950/20 border border-purple-500/20 text-aura-text rounded-tr-none'
                : 'bg-aura-panel border border-aura-border text-aura-text rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 max-w-[85%]">
            <div className="w-8 h-8 rounded-full border bg-teal-500/10 border-teal-500/30 text-teal-400 flex items-center justify-center flex-shrink-0">
              <Bot size={14} />
            </div>
            <div className="p-3.5 rounded-2xl text-xs bg-aura-panel border border-aura-border text-aura-muted rounded-tl-none flex items-center gap-2">
              <Loader2 size={12} className="animate-spin text-teal-400" /> Analysing diagnostics...
            </div>
          </div>
        )}
      </div>

      {/* Preset Questions Panel */}
      <div className="p-3 border-t border-aura-border bg-aura-bg/30">
        <span className="text-[10px] text-aura-muted font-bold block mb-2 uppercase tracking-wide flex items-center gap-1">
          <HelpCircle size={10} /> Suggested Questions
        </span>
        <div className="flex flex-wrap gap-1.5">
          {Object.keys(PRESET_ANSWERS).map((q, idx) => (
            <button
              key={idx}
              className="px-2.5 py-1 text-[10px] bg-aura-panel hover:bg-aura-primary/10 border border-aura-border hover:border-aura-primary-light text-aura-text hover:text-aura-primary-light rounded-full transition-all duration-200"
              onClick={() => handleSendMessage(q)}
              disabled={isTyping}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        className="p-3 border-t border-aura-border bg-teal-950/10 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputVal);
        }}
      >
        <input
          type="text"
          className="flex-1 px-4 py-2 text-xs bg-aura-panel border border-aura-border focus:border-teal-500 rounded-xl text-aura-text focus:outline-none transition"
          placeholder="Ask about skin, ingredients, or routines..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          disabled={isTyping}
        />
        <button
          type="submit"
          className="p-2 bg-teal-600 hover:bg-teal-500 disabled:bg-aura-muted text-white rounded-xl flex items-center justify-center transition-all duration-200"
          disabled={isTyping || !inputVal.trim()}
        >
          <Send size={14} />
        </button>
      </form>

    </div>
  );
}
