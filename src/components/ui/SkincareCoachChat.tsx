import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, HelpCircle, Loader2, Volume2, VolumeX, Mic, MicOff } from 'lucide-react';

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

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

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
  
  // Voice Assistant State
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('aura_coach_muted');
    return saved ? JSON.parse(saved) : true; // Muted by default to comply with browser auto-play guidelines
  });
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognitionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onerror = (e: any) => {
        console.error("Speech recognition error", e);
        setIsListening(false);
      };

      rec.onresult = (e: any) => {
        const resultText = e.results[0][0].transcript;
        if (resultText) {
          setInputVal(resultText);
          // Automatically send voice input after a small delay for user feedback
          setTimeout(() => {
            handleSendMessage(resultText);
          }, 600);
        }
      };

      recognitionRef.current = rec;
    }

    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

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

    // Cancel active speaking when user submits a new text
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);

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

      // Speak reply if not muted
      if (!isMuted && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(botResponse);
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha') || v.lang.startsWith('en'));
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
        window.speechSynthesis.speak(utterance);
      }
    }, 1200);
  };

  const toggleMic = () => {
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please use Chrome, Safari, or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.error("Failed to start speech recognition", err);
      }
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    localStorage.setItem('aura_coach_muted', JSON.stringify(nextMuted));
    if (nextMuted) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-[500px] border border-aura-border bg-aura-panel rounded-2xl overflow-hidden glass-gradient">
      
      {/* Bot Header */}
      <div className="flex items-center justify-between p-4 border-b border-aura-border bg-teal-950/20">
        <div className="flex items-center gap-3">
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

        {/* TTS Mute Toggle */}
        <button
          onClick={toggleMute}
          className={`p-2 rounded-lg transition-all duration-300 no-lift flex items-center gap-1 text-[10px] font-bold ${
            !isMuted 
              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 shadow-glow-primary' 
              : 'bg-black/45 text-aura-muted border border-white/5 hover:text-white'
          }`}
          title={isMuted ? "Enable Voice Assistant Output" : "Mute Voice Assistant Output"}
        >
          {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} className={isSpeaking ? "animate-pulse" : ""} />}
          <span>{isMuted ? "Voice: Off" : "Voice: On"}</span>
        </button>
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
              className="px-2.5 py-1 text-[10px] bg-aura-panel hover:bg-aura-primary/10 border border-aura-border hover:border-aura-primary-light text-aura-text hover:text-aura-primary-light rounded-full transition-all duration-200 no-lift"
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
        className="p-3 border-t border-aura-border bg-teal-950/10 flex gap-2 items-center"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputVal);
        }}
      >
        {/* Speak Dictation Mic Button */}
        <button
          type="button"
          onClick={toggleMic}
          className={`p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center shrink-0 ${
            isListening 
              ? 'bg-red-600 text-white animate-pulse shadow-glow-red' 
              : 'bg-black/45 hover:bg-black/60 border border-aura-border text-cyan-400 hover:text-cyan-300'
          }`}
          title={isListening ? "Listening... click to cancel" : "Talk to Coach (Speech Input)"}
          disabled={isTyping}
        >
          {isListening ? <MicOff size={13} /> : <Mic size={13} />}
        </button>

        {/* Input Area / Soundwave Overlay */}
        {isListening ? (
          <div className="flex-grow flex items-center gap-2 px-3 py-2 bg-red-950/10 border border-red-500/20 rounded-xl text-[11px] text-red-400">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            <span className="font-mono tracking-wider font-semibold">Listening... speak</span>
            <div className="flex gap-0.5 items-end ml-auto h-3">
              <span className="w-0.5 h-2 bg-red-400 animate-soundwave-1" />
              <span className="w-0.5 h-3 bg-red-500 animate-soundwave-2 animate-delay-100" />
              <span className="w-0.5 h-1.5 bg-red-400 animate-soundwave-3 animate-delay-200" />
              <span className="w-0.5 h-3 bg-red-500 animate-soundwave-4 animate-delay-300" />
            </div>
          </div>
        ) : (
          <input
            type="text"
            className="flex-1 px-3 py-2 text-xs bg-aura-panel border border-aura-border focus:border-teal-500 rounded-xl text-aura-text focus:outline-none transition"
            placeholder="Ask about skin, ingredients, or routines..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={isTyping}
          />
        )}

        <button
          type="submit"
          className="p-2 bg-teal-600 hover:bg-teal-500 disabled:bg-aura-muted text-white rounded-xl flex items-center justify-center transition-all duration-200 shadow-glow-primary"
          disabled={isTyping || !inputVal.trim() || isListening}
        >
          <Send size={13} />
        </button>
      </form>

    </div>
  );
}
