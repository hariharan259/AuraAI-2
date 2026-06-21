import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAura } from '../../context/AuraContext';
import { Mic, MicOff, Volume2, VolumeX, X, HelpCircle, CornerDownLeft } from 'lucide-react';

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export default function VoiceCopilot() {
  const navigate = useNavigate();
  const { state } = useAura();
  const result = state.analysisResult;

  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [reply, setReply] = useState('Hello! I am your Aura Voice Copilot. Speak a navigation command or ask about your skin health.');
  const [showHelp, setShowHelp] = useState(false);

  const recognitionRef = useRef<any>(null);

  // Voice command suggestions
  const SUGGESTIONS = [
    { label: 'Go to Dashboard', cmd: 'go to dashboard' },
    { label: 'Open Skin Lab', cmd: 'go to skin lab' },
    { label: 'Open Hair Lab', cmd: 'go to hair lab' },
    { label: 'Show My Report', cmd: 'explain my report' },
    { label: 'View Products', cmd: 'recommend products' },
    { label: 'Book Dermatologist', cmd: 'book doctor' },
    { label: 'Start Presenter Mode', cmd: 'start demo' }
  ];

  // Initialize Speech Recognition
  useEffect(() => {
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
        setTranscript('Listening...');
        window.speechSynthesis?.cancel();
        setIsSpeaking(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onerror = (e: any) => {
        console.error("Speech recognition error", e);
        setIsListening(false);
        setTranscript('Error capturing voice.');
      };

      rec.onresult = (e: any) => {
        const resultText = e.results[0][0].transcript;
        if (resultText) {
          setTranscript(resultText);
          handleVoiceCommand(resultText);
        }
      };

      recognitionRef.current = rec;
    }

    return () => {
      window.speechSynthesis?.cancel();
    };
  }, [result]); // Re-bind if results update so we speak latest values

  // Speak response text aloud
  const speakText = (text: string) => {
    if (isMuted || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    // Pick a premium voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha') || v.lang.startsWith('en'));
    if (preferredVoice) utterance.voice = preferredVoice;

    window.speechSynthesis.speak(utterance);
  };

  // Process Speech commands
  const handleVoiceCommand = (cmdText: string) => {
    const text = cmdText.toLowerCase().trim();
    
    // Command 1: Go to dashboard
    if (text.includes('dashboard') || text.includes('overview') || text.includes('home')) {
      setReply('Opening your Executive Dashboard.');
      speakText('Opening your Executive Dashboard.');
      navigate('/dashboard');
      setTimeout(() => setIsOpen(false), 1500);
      return;
    }

    // Command 2: Open skin health lab
    if (text.includes('skin lab') || text.includes('skin health') || text.includes('diagnostics')) {
      setReply('Opening your Skin Health Diagnostics Lab.');
      speakText('Opening your Skin Health Diagnostics Lab.');
      navigate('/skin-lab');
      setTimeout(() => setIsOpen(false), 1500);
      return;
    }

    // Command 3: Open hair intelligence lab
    if (text.includes('hair lab') || text.includes('hair health') || text.includes('hair intelligence')) {
      setReply('Opening your Hair Intelligence Lab.');
      speakText('Opening your Hair Intelligence Lab.');
      navigate('/hair-lab');
      setTimeout(() => setIsOpen(false), 1500);
      return;
    }

    // Command 4: Show Report / Explain report
    if (text.includes('report') || text.includes('dermatology report') || text.includes('pdf')) {
      setReply('Opening your Clinical Dermatology Report.');
      speakText('Opening your Clinical Dermatology Report.');
      navigate('/report');
      setTimeout(() => setIsOpen(false), 1500);
      return;
    }

    // Command 5: Open beauty twin
    if (text.includes('beauty twin') || text.includes('digital twin') || text.includes('twin')) {
      setReply('Opening your AI Beauty Twin simulator.');
      speakText('Opening your AI Beauty Twin simulator.');
      navigate('/beauty-twin');
      setTimeout(() => setIsOpen(false), 1500);
      return;
    }

    // Command 6: Recommend products / formulas
    if (text.includes('product') || text.includes('recommend') || text.includes('formulas') || text.includes('serum')) {
      setReply('Opening your Product Recommendation Engine.');
      speakText('Opening your Product Recommendation Engine.');
      navigate('/products');
      setTimeout(() => setIsOpen(false), 1500);
      return;
    }

    // Command 7: Book doctor / contact specialist
    if (text.includes('book') || text.includes('doctor') || text.includes('specialist') || text.includes('consult')) {
      setReply('Opening Specialist Consultation Hub.');
      speakText('Opening Specialist Consultation Hub.');
      navigate('/consultation');
      setTimeout(() => setIsOpen(false), 1500);
      return;
    }

    // Command 8: Start presenter mode / demo
    if (text.includes('demo') || text.includes('presenter') || text.includes('walkthrough') || text.includes('arena')) {
      setReply('Launching Live Presentation Arena walkthrough.');
      speakText('Launching Live Presentation Arena walkthrough.');
      navigate('/demo');
      setTimeout(() => setIsOpen(false), 1500);
      return;
    }

    // Command 9: Admin dashboard
    if (text.includes('admin') || text.includes('revenue') || text.includes('analytics') || text.includes('investor')) {
      setReply('Opening Admin & Revenue Analytics Dashboard.');
      speakText('Opening Admin & Revenue Analytics Dashboard.');
      navigate('/admin');
      setTimeout(() => setIsOpen(false), 1500);
      return;
    }

    // Command 10: Ask about Skin Score
    if (text.includes('score') || text.includes('health') || text.includes('how is my skin')) {
      if (result) {
        const scoreText = `Your overall Skin Health Score is ${result.beautyScore}. Hydration is at ${result.skinHealth.hydrationScore ?? 64} percent, and sebum control is moderate.`;
        setReply(scoreText);
        speakText(scoreText);
      } else {
        const noScan = 'You have not completed a skin diagnostics scan yet. Try saying "go to skin lab" to run an analysis.';
        setReply(noScan);
        speakText(noScan);
      }
      return;
    }

    // Fallback: Command not matched
    const defaultReply = `I recognized: "${cmdText}". Try saying one of the direct commands listed in the help guidelines.`;
    setReply(defaultReply);
    speakText("Sorry, I didn't recognize that navigation command. Try saying go to dashboard or book doctor.");
  };

  // Toggle voice recognition
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      // Unmute text to speech on user interaction if muted
      if (isMuted) {
        setIsMuted(false);
      }
      recognitionRef.current?.start();
    }
  };

  return (
    <>
      {/* Floating Micro-Button */}
      <div className="fixed bottom-24 lg:bottom-8 right-6 z-50">
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            // Toggle TTS mute when opening so speech synthesis works
            if (!isOpen && isMuted) setIsMuted(false);
          }}
          className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all duration-300 relative shadow-2xl ${
            isOpen 
              ? 'bg-purple-600 border-purple-400 text-white rotate-90 scale-105 shadow-glow-primary' 
              : 'bg-slate-900/90 border-purple-500/30 text-purple-400 hover:text-white hover:border-purple-400 backdrop-blur-xl'
          }`}
          title="Aura AI Voice Copilot"
        >
          {isOpen ? <X size={20} /> : <Mic size={22} className="animate-pulse" />}
          {isListening && (
            <span className="absolute inset-0 rounded-full border border-purple-400 animate-ping opacity-60" />
          )}
        </button>
      </div>

      {/* Glassmorphic Panel Overlay */}
      {isOpen && (
        <div className="fixed bottom-40 lg:bottom-24 right-6 w-80 z-50 rounded-2xl border border-white/10 bg-slate-950/90 backdrop-blur-xl p-5 shadow-2xl animate-scaleIn select-none">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse shadow-glow-primary" />
              <div>
                <h4 className="text-xs font-bold text-white tracking-wide">Aura Voice Copilot</h4>
                <span className="text-[8px] text-aura-muted uppercase tracking-wider font-bold">Global Voice Agent</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className={`p-1.5 rounded-lg border transition ${isMuted ? 'border-rose-500/30 text-rose-400 bg-rose-500/10' : 'border-white/5 hover:border-white/20 text-white'}`}
                title={isMuted ? "Unmute Assistant Speech" : "Mute Assistant Speech"}
              >
                {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} className={isSpeaking ? 'animate-pulse' : ''} />}
              </button>
              <button 
                onClick={() => setShowHelp(!showHelp)}
                className={`p-1.5 rounded-lg border transition ${showHelp ? 'border-purple-500/30 text-purple-400 bg-purple-500/10' : 'border-white/5 hover:border-white/20 text-white'}`}
                title="Voice Commands Guide"
              >
                <HelpCircle size={13} />
              </button>
            </div>
          </div>

          {/* Help Overlay or Assistant Body */}
          {showHelp ? (
            <div className="space-y-3 h-52 overflow-y-auto">
              <h5 className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">Voice Navigation Guide</h5>
              <div className="space-y-1.5 text-[10px] text-aura-muted font-mono leading-relaxed">
                <p>Click the microphone and speak one of these commands clearly:</p>
                <div className="space-y-1 pt-1.5">
                  {SUGGESTIONS.map(s => (
                    <button 
                      key={s.cmd}
                      onClick={() => handleVoiceCommand(s.cmd)}
                      className="w-full text-left p-1.5 rounded border border-white/5 hover:border-purple-500/35 hover:text-white transition flex justify-between items-center group bg-black/25"
                    >
                      <span>{s.label}</span>
                      <CornerDownLeft size={10} className="opacity-40 group-hover:opacity-100 text-purple-400" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Interaction Logs */}
              <div className="space-y-2.5 min-h-[120px] flex flex-col justify-between">
                {/* User Speech Transcription */}
                <div className="p-2.5 rounded-xl bg-black/45 border border-white/5 text-[11px] font-mono leading-relaxed">
                  <span className="text-purple-400 block text-[9px] uppercase font-bold mb-0.5">Your Voice:</span>
                  <p className="text-white italic">{transcript || 'Click mic below and speak...'}</p>
                </div>

                {/* Copilot reply */}
                <div className="p-2.5 rounded-xl bg-purple-950/10 border border-purple-500/10 text-[11px] font-mono leading-relaxed">
                  <span className="text-cyan-400 block text-[9px] uppercase font-bold mb-0.5">Aura Copilot:</span>
                  <p className="text-white">{reply}</p>
                </div>
              </div>

              {/* Soundwaves indicator */}
              <div className="h-10 flex items-center justify-center gap-1.5 border-t border-white/5 pt-3">
                {isListening ? (
                  <>
                    <span className="w-1.5 h-6 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <span className="w-1.5 h-8 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                    <span className="w-1.5 h-10 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
                    <span className="w-1.5 h-8 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.7s' }} />
                    <span className="w-1.5 h-6 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.9s' }} />
                  </>
                ) : (
                  <span className="text-[10px] text-aura-muted font-bold tracking-widest uppercase">Copilot Offline</span>
                )}
              </div>

              {/* Push to talk microphone trigger */}
              <button 
                onClick={toggleListening}
                className={`w-full py-2.5 rounded-xl border font-bold text-xs transition flex justify-center items-center gap-2 no-lift ${
                  isListening 
                    ? 'bg-rose-600 hover:bg-rose-500 border-rose-500 text-white animate-pulse' 
                    : 'bg-purple-600 hover:bg-purple-500 border-purple-500 text-white shadow-glow-primary'
                }`}
              >
                {isListening ? <><MicOff size={14} /> Stop Listening</> : <><Mic size={14} /> Push To Talk</>}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
