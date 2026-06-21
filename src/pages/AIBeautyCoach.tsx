import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAura } from '../context/AuraContext';
import { MessageSquare, Send, MessageCircle, Sparkles, User, Brain, Volume2, VolumeX, Mic, MicOff } from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export default function AIBeautyCoach() {
  const navigate = useNavigate();
  const { state } = useAura();
  const result = state.analysisResult;

  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'ai', text: 'Hello! I am your AI Beauty Intelligence Coach. Ask me anything about your current skin metrics, formulation safety, or routine improvements.' }
  ]);
  const [input, setInput] = useState('');
  
  // Voice Assistant State
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('aura_coach_muted');
    return saved ? JSON.parse(saved) : true; // Muted by default to comply with browser auto-play guidelines
  });
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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
          setInput(resultText);
          // Automatically send voice input after a small delay for user feedback
          setTimeout(() => {
            handleSend(resultText);
          }, 600);
        }
      };

      recognitionRef.current = rec;
    }

    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  // Auto-scroll messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (textToSend = input) => {
    if (!textToSend.trim()) return;

    const newMsgs = [...messages, { sender: 'user' as const, text: textToSend }];
    setMessages(newMsgs);
    setInput('');

    // Cancel active speaking when user submits a new text
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);

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
      
      setMessages(prev => [...prev, { sender: 'ai' as const, text: reply }]);

      // Speak reply if not muted
      if (!isMuted && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(reply);
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
    }, 1000);
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
          
          {/* Chat Window Header */}
          <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-300">Active Consultation</span>
            </div>
            
            {/* TTS Mute Toggle */}
            <button
              onClick={toggleMute}
              className={`p-2 rounded-xl transition-all duration-300 no-lift flex items-center gap-1.5 text-xs font-bold ${
                !isMuted 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-glow-primary' 
                  : 'bg-black/45 text-aura-muted border border-white/5 hover:text-white'
              }`}
              title={isMuted ? "Enable Voice Assistant Output" : "Mute Voice Assistant Output"}
            >
              {isMuted ? (
                <>
                  <VolumeX size={14} /> Voice Out: Off
                </>
              ) : (
                <>
                  <Volume2 size={14} className={isSpeaking ? "animate-pulse text-cyan-400" : ""} /> Voice Out: On
                </>
              )}
            </button>
          </div>

          {/* Chat Messages */}
          <div ref={scrollRef} className="flex-1 flex flex-col gap-4 overflow-y-auto max-h-[320px] mb-4 pr-2">
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
                  className="px-3 py-1.5 bg-black/45 border border-white/5 hover:border-cyan-500/40 hover:bg-cyan-950/10 text-white/80 hover:text-white text-[10px] rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-100 no-lift"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="flex gap-2 items-center">
              
              {/* Speak Dictation Mic Button */}
              <button
                type="button"
                onClick={toggleMic}
                className={`p-3 rounded-xl transition-all duration-300 flex items-center justify-center shrink-0 ${
                  isListening 
                    ? 'bg-red-600 text-white animate-pulse shadow-glow-red' 
                    : 'bg-black/45 hover:bg-black/60 border border-aura-border text-cyan-400 hover:text-cyan-300'
                }`}
                title={isListening ? "Listening... click to cancel" : "Talk to Coach (Speech Input)"}
              >
                {isListening ? <MicOff size={14} /> : <Mic size={14} />}
              </button>

              {/* Input Area / Soundwave Overlay */}
              {isListening ? (
                <div className="flex-grow flex items-center gap-3 px-4 py-3 bg-red-950/10 border border-red-500/20 rounded-xl text-xs text-red-400">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span className="font-mono tracking-wider font-semibold">Listening... speak your question</span>
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
                  placeholder="Ask about active compounds, routines, UV indices..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 px-4 py-3 bg-black/45 border border-aura-border rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500/50"
                />
              )}
              
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
