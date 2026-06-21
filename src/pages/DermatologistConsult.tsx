import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAura } from '../context/AuraContext';
import { 
  User, Calendar, MessageSquare, Video, ShieldAlert, Sparkles, 
  Award, Star, Clock, Check, ArrowRight, VideoOff, Mic, MicOff, 
  PhoneOff, X, Compass, CheckCircle2, ChevronRight, MessageCircle, AlertCircle
} from 'lucide-react';

interface Specialist {
  id: number;
  name: string;
  title: string;
  type: 'Dermatologist' | 'Trichologist' | 'Formulation Scientist';
  rating: number;
  reviews: number;
  experience: number;
  specialties: string[];
  nextSlot: string;
  fee: number;
  avatar: string;
  bio: string;
}

const SPECIALISTS: Specialist[] = [
  {
    id: 1,
    name: 'Dr. Evelyn Vance, MD',
    title: 'Board-Certified Dermatologist',
    type: 'Dermatologist',
    rating: 4.9,
    reviews: 142,
    experience: 12,
    specialties: ['Hormonal Acne', 'Vascular Redness', 'Barrier Repair', 'Anti-Aging'],
    nextSlot: 'Today, 3:30 PM',
    fee: 50,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80',
    bio: 'Former chief resident of dermatology at Stanford Medical Center. Specializes in custom topical protocols for inflammatory conditions and barrier rejuvenation.'
  },
  {
    id: 2,
    name: 'Dr. Marcus Vance',
    title: 'Clinical Trichologist',
    type: 'Trichologist',
    rating: 4.8,
    reviews: 98,
    experience: 9,
    specialties: ['Follicular Density', 'Scalp Microbiome', 'Alopecia Prevention'],
    nextSlot: 'Tomorrow, 10:00 AM',
    fee: 45,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
    bio: 'Pioneered cellular scalp health mapping. Dedicated to identifying biological causes of hair thinning and optimizing follicular environments.'
  },
  {
    id: 3,
    name: 'Sarah Lin, MS',
    title: 'Senior Skincare Formulation Chemist',
    type: 'Formulation Scientist',
    rating: 4.9,
    reviews: 215,
    experience: 7,
    specialties: ['Active Ingredient Conflicts', 'Viscosity Layering', 'Clean Cosmetics'],
    nextSlot: 'June 23, 11:30 AM',
    fee: 35,
    avatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&w=300&q=80',
    bio: 'Formulation advisor for multiple global dermo-cosmetic brands. Specializes in auditing custom serums and resolving chemistry clashes in personal routines.'
  }
];

export default function DermatologistConsult() {
  const navigate = useNavigate();
  const { state } = useAura();
  const result = state.analysisResult;
  const profile = state.profile;

  const [activeTab, setActiveTab] = useState<'marketplace' | 'messages' | 'appointments'>('marketplace');
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [shareTelemetry, setShareTelemetry] = useState(true);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [appointmentReason, setAppointmentReason] = useState('Acne & Blemish Management');
  const [bookedAppointments, setBookedAppointments] = useState<any[]>([]);

  // Telehealth video simulator state
  const [telehealthActive, setTelehealthActive] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [simStep, setSimStep] = useState(0); // 0: call connecting, 1: ongoing, 2: ended
  const [doctorSpeakingText, setDoctorSpeakingText] = useState('Connecting secure telehealth video feed...');

  // Mock messages state
  const [chatSpecialist, setChatSpecialist] = useState<Specialist | null>(SPECIALISTS[0]);
  const [messages, setMessages] = useState<any>({
    1: [
      { sender: 'specialist', text: 'Hello Sarah! I reviewed your latest AuraAI diagnostic report. Your hydration index of 64% is slightly low, which might be exacerbating your T-zone oiliness. Let\'s adjust your morning hyaluronic layering.', time: 'Yesterday' }
    ],
    2: [
      { sender: 'specialist', text: 'Hi! Let\'s discuss your scalp scan results. I noticed the root congestion score is moderate. Are you currently using any sulfate-based shampoos?', time: '2 days ago' }
    ],
    3: [
      { sender: 'specialist', text: 'Welcome! I can help you review your compound formulations. Let\'s check if your Retinol cream has any conflict with the Vitamin C active in your routine.', time: '3 days ago' }
    ]
  });
  const [inputText, setInputText] = useState('');

  // Handle mock message submit
  const handleSendMessage = () => {
    if (!chatSpecialist || !inputText.trim()) return;
    const specId = chatSpecialist.id;
    const userMsg = { sender: 'user', text: inputText, time: 'Just now' };
    
    setMessages((prev: any) => ({
      ...prev,
      [specId]: [...(prev[specId] || []), userMsg]
    }));
    setInputText('');

    // Simulate reply after 1.5s
    setTimeout(() => {
      let replyText = "Thank you for sharing that. I will look over your details and get back to you shortly.";
      if (specId === 1) {
        replyText = "That makes sense. In that case, I recommend introducing the Niacinamide formula slowly, twice a week, and monitoring for any skin barrier flushing.";
      } else if (specId === 2) {
        replyText = "Yes, switching to a pH-balanced salicylic acid scalp cleanser should help dissolve that buildup without triggering rebound sebum production.";
      } else if (specId === 3) {
        replyText = "Avoid layering them directly. Use your Vitamin C strictly in the morning to fight UV stressors, and apply Retinol in your evening cycle.";
      }
      
      const replyMsg = { sender: 'specialist', text: replyText, time: 'Just now' };
      setMessages((prev: any) => ({
        ...prev,
        [specId]: [...(prev[specId] || []), replyMsg]
      }));
    }, 1500);
  };

  // Launch Simulated Video Call
  const startTelehealthSimulation = () => {
    setTelehealthActive(true);
    setSimStep(0);
    setDoctorSpeakingText('Establishing connection to secure medical server...');
    
    // Step-by-step mock call progress
    setTimeout(() => {
      setSimStep(1);
      setDoctorSpeakingText(`Hello ${profile?.name || 'Sarah'}! I am Dr. Evelyn Vance. I've got your AuraAI diagnostic profile and Skin Twin mapping open on my side. Let's review the results.`);
    }, 3000);
  };

  // Step through doctor's consultation dialogue
  const handleNextCallDialogue = () => {
    if (simStep === 1) {
      setDoctorSpeakingText(`Looking at your Skin Twin, your hydration barrier needs calibration. I am prescribing a clinical-grade 2% Hyaluronic acid with Panthenol. I will write this into your Aura Product Engine.`);
    }
  };

  const endTelehealthCall = () => {
    setSimStep(2);
    setDoctorSpeakingText('Secure medical session terminated. Thank you for using AuraAI telehealth.');
    setTimeout(() => {
      setTelehealthActive(false);
      setActiveTab('marketplace');
    }, 2500);
  };

  // Handle Book appointment form submission
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSpecialist || !appointmentDate || !appointmentTime) return;

    const newAppointment = {
      id: Date.now(),
      specialist: selectedSpecialist,
      date: appointmentDate,
      time: appointmentTime,
      reason: appointmentReason,
      telemetryShared: shareTelemetry && !!result
    };

    setBookedAppointments(prev => [...prev, newAppointment]);
    setBookingSuccess(true);

    setTimeout(() => {
      setBookingSuccess(false);
      setBookingModalOpen(false);
      setActiveTab('appointments');
      setSelectedSpecialist(null);
      setAppointmentDate('');
      setAppointmentTime('');
    }, 2000);
  };

  return (
    <div className="page-content animate-fadeIn p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 border border-purple-500/30 text-purple-400 mb-3">
            <Sparkles size={12} /> Expert Network
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 font-display">Specialist Consultation</h1>
          <p className="text-sm text-aura-muted">Connect your advanced AuraAI diagnostics directly with certified dermatologists, trichologists, and chemists.</p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-black/45 p-1 rounded-xl border border-white/5 gap-1">
          <button 
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 no-lift ${activeTab === 'marketplace' ? 'bg-purple-600 text-white shadow-glow-primary' : 'text-aura-muted hover:text-white'}`}
            onClick={() => setActiveTab('marketplace')}
          >
            <Compass size={14} className="inline mr-1.5" /> Find Specialists
          </button>
          <button 
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 relative no-lift ${activeTab === 'messages' ? 'bg-purple-600 text-white shadow-glow-primary' : 'text-aura-muted hover:text-white'}`}
            onClick={() => setActiveTab('messages')}
          >
            <MessageSquare size={14} className="inline mr-1.5" /> Messages
            <span className="absolute top-1 right-1 w-2 h-2 bg-purple-400 rounded-full animate-ping" />
          </button>
          <button 
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 no-lift ${activeTab === 'appointments' ? 'bg-purple-600 text-white shadow-glow-primary' : 'text-aura-muted hover:text-white'}`}
            onClick={() => setActiveTab('appointments')}
          >
            <Calendar size={14} className="inline mr-1.5" /> Appointments ({bookedAppointments.length})
          </button>
        </div>
      </div>

      {/* Main Container */}
      {activeTab === 'marketplace' && (
        <div className="space-y-8">
          {/* Diagnostic status banner */}
          <div className="p-4 rounded-2xl border border-white/5 bg-glass-bg flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                <Award size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  {result ? 'Telemetry Integration Active' : 'No Diagnostic Scan Attached'}
                </h3>
                <p className="text-xs text-aura-muted">
                  {result 
                    ? `Sharing Skin Health Index (${result.beautyScore}) and Digital Twin telemetry automatically.` 
                    : 'Analyze your skin to share real-time diagnostics during booking.'
                  }
                </p>
              </div>
            </div>
            {!result && (
              <button 
                onClick={() => navigate('/profile')}
                className="btn btn-primary btn-sm flex items-center gap-1.5 font-bold"
              >
                <Sparkles size={13} /> Run Skin Scan
              </button>
            )}
          </div>

          {/* Grid of Specialists */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SPECIALISTS.map(spec => (
              <div 
                key={spec.id} 
                className="rounded-2xl border border-aura-border bg-aura-panel hover:border-purple-500/40 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
                style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(20px)' }}
              >
                {/* Visual Glow Header */}
                <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-purple-500 to-indigo-500" />
                
                {/* Doctor Bio Details */}
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={spec.avatar} 
                      alt={spec.name} 
                      className="w-14 h-14 rounded-xl object-cover border border-white/10"
                    />
                    <div>
                      <h3 className="font-bold text-white text-base group-hover:text-purple-300 transition-colors">{spec.name}</h3>
                      <p className="text-[11px] text-purple-400 font-semibold">{spec.title}</p>
                      <div className="flex items-center gap-1.5 mt-1 text-[11px] text-amber-400 font-bold">
                        <Star size={12} fill="currentColor" /> {spec.rating} <span className="text-aura-muted font-normal">({spec.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-aura-muted leading-relaxed mb-4 line-clamp-3">{spec.bio}</p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {spec.specialties.map(tag => (
                      <span key={tag} className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-white/5 text-aura-text border border-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-1.5 pt-3 border-t border-white/5 text-xs text-aura-muted">
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1.5"><Clock size={12} /> Next Slot:</span>
                      <strong className="text-white">{spec.nextSlot}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1.5"><Award size={12} /> Experience:</span>
                      <strong className="text-white">{spec.experience} Years</strong>
                    </div>
                  </div>
                </div>

                {/* Card Button Panel */}
                <div className="p-4 bg-black/25 border-t border-white/5 flex gap-2">
                  <button 
                    onClick={() => {
                      setSelectedSpecialist(spec);
                      setBookingModalOpen(true);
                    }}
                    className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-glow-primary no-lift"
                  >
                    Book Session
                  </button>
                  <button 
                    onClick={() => {
                      setChatSpecialist(spec);
                      setActiveTab('messages');
                    }}
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/5 transition-all no-lift"
                    title="Send Private Message"
                  >
                    <MessageSquare size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Virtual Visit Callout Box */}
          <div className="p-6 rounded-2xl border border-purple-500/25 bg-gradient-to-r from-purple-950/20 to-indigo-950/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400">Need Immediate Advice?</span>
              <h2 className="text-xl font-bold text-white font-display">Simulated Live Video Consultation</h2>
              <p className="text-xs text-aura-muted max-w-xl">
                Experience a simulated telehealth session with Dr. Vance. The consultation leverages your digital skin twin and telemetry to walk you through a professional analysis in real-time.
              </p>
            </div>
            <button 
              onClick={startTelehealthSimulation}
              className="px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl flex items-center gap-2 transition shadow-glow-primary text-sm no-lift"
            >
              <Video size={16} /> Start Virtual Consultation
            </button>
          </div>
        </div>
      )}

      {/* Messages Center */}
      {activeTab === 'messages' && chatSpecialist && (
        <div className="grid grid-cols-1 lg:grid-cols-12 border border-white/5 rounded-2xl overflow-hidden bg-glass-bg min-h-[500px]">
          {/* Left panel: Contacts */}
          <div className="lg:col-span-4 border-r border-white/5 bg-black/20">
            <div className="p-4 border-b border-white/5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-aura-muted">Specialists Chat</h3>
            </div>
            <div className="divide-y divide-white/5">
              {SPECIALISTS.map(spec => (
                <button
                  key={spec.id}
                  onClick={() => setChatSpecialist(spec)}
                  className={`w-full p-4 flex items-center gap-3 text-left transition-colors ${chatSpecialist.id === spec.id ? 'bg-purple-950/15 text-white' : 'hover:bg-white/5 text-aura-muted'}`}
                >
                  <img src={spec.avatar} alt={spec.name} className="w-10 h-10 rounded-lg object-cover border border-white/5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className="text-xs font-bold truncate text-white">{spec.name}</h4>
                      <span className="text-[9px] text-aura-muted">Active</span>
                    </div>
                    <p className="text-[10px] text-purple-400 font-medium truncate">{spec.title}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right panel: Active Chat */}
          <div className="lg:col-span-8 flex flex-col justify-between bg-black/10">
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-black/20 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img src={chatSpecialist.avatar} alt={chatSpecialist.name} className="w-10 h-10 rounded-lg object-cover border border-white/5" />
                <div>
                  <h4 className="text-xs font-bold text-white">{chatSpecialist.name}</h4>
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Secure Connection
                  </span>
                </div>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[350px]">
              {(messages[chatSpecialist.id] || []).map((msg: any, idx: number) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-md rounded-2xl p-3.5 text-xs leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-purple-600 text-white rounded-br-none' 
                      : 'bg-glass-bg-strong border border-white/5 text-aura-text rounded-bl-none'
                  }`}>
                    {msg.text}
                    <span className="block text-[8px] text-white/50 text-right mt-1.5">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <div className="p-4 border-t border-white/5 bg-black/20">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex gap-2"
              >
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Write secure message to ${chatSpecialist.name}...`}
                  className="flex-1 bg-black/45 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-aura-muted focus:border-purple-500 focus:outline-none transition"
                />
                <button 
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition shadow-glow-primary no-lift"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Bookings & Appointments */}
      {activeTab === 'appointments' && (
        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-aura-muted">Scheduled Appointments</h3>
          
          {bookedAppointments.length === 0 ? (
            <div className="p-12 rounded-2xl border border-dashed border-white/10 text-center py-20 bg-glass-bg">
              <Calendar size={40} className="text-purple-400 mx-auto mb-3 animate-pulse" />
              <h4 className="text-base font-bold text-white mb-1">No Appointments Scheduled</h4>
              <p className="text-xs text-aura-muted max-w-xs mx-auto mb-6">
                Connect with specialists to plan your skincare routines, resolve compound active conflicts, or execute scalp health reviews.
              </p>
              <button 
                onClick={() => setActiveTab('marketplace')}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition"
              >
                Book First Consultation
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookedAppointments.map(app => (
                <div key={app.id} className="p-6 rounded-2xl border border-white/5 bg-glass-bg flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-4 right-4 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[9px] uppercase tracking-wide">
                    Confirmed
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <img src={app.specialist.avatar} alt={app.specialist.name} className="w-12 h-12 rounded-lg object-cover border border-white/10" />
                      <div>
                        <h4 className="text-sm font-bold text-white">{app.specialist.name}</h4>
                        <p className="text-[10px] text-purple-400 font-semibold">{app.specialist.title}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-aura-muted pt-3 border-t border-white/5">
                      <div className="flex justify-between">
                        <span>Session Date & Time:</span>
                        <strong className="text-white">{app.date} at {app.time}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Consultation Reason:</span>
                        <strong className="text-white">{app.reason}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Aura Diagnostic Shared:</span>
                        <strong className={app.telemetryShared ? "text-emerald-400" : "text-amber-500"}>
                          {app.telemetryShared ? 'Attached (Auto-Sync)' : 'Not Shared'}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex gap-2">
                    <button 
                      onClick={() => {
                        setChatSpecialist(app.specialist);
                        setActiveTab('messages');
                      }}
                      className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-white text-xs font-bold transition"
                    >
                      Private Chat
                    </button>
                    <button 
                      onClick={startTelehealthSimulation}
                      className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-glow-primary"
                    >
                      Enter Call
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Booking Form Dialog Modal */}
      {bookingModalOpen && selectedSpecialist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl border border-aura-border bg-aura-panel p-6 shadow-2xl glass-gradient animate-scaleIn">
            {/* Close button */}
            <button 
              className="absolute top-4 right-4 p-1.5 rounded-lg border border-white/5 hover:border-white/20 text-aura-muted hover:text-white transition"
              onClick={() => setBookingModalOpen(false)}
            >
              <X size={14} />
            </button>

            {bookingSuccess ? (
              <div className="text-center py-8">
                <CheckCircle2 size={48} className="text-emerald-400 mx-auto mb-4 animate-bounce" />
                <h3 className="text-lg font-bold text-white mb-1">Appointment Scheduled!</h3>
                <p className="text-xs text-aura-muted">Writing session details to secure health ledger...</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white mb-1">Book Consultation</h3>
                  <p className="text-xs text-aura-muted">Schedule your secure telehealth session with <strong>{selectedSpecialist.name}</strong></p>
                </div>

                <div className="p-3.5 rounded-xl border border-white/5 bg-black/25 flex items-center gap-3">
                  <img src={selectedSpecialist.avatar} alt={selectedSpecialist.name} className="w-10 h-10 rounded-lg object-cover border border-white/5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{selectedSpecialist.name}</h4>
                    <span className="text-[10px] text-purple-400 font-semibold">{selectedSpecialist.title}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-aura-muted">Select Date</label>
                    <input 
                      type="date" 
                      required
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full bg-black/45 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-aura-muted">Select Time</label>
                    <input 
                      type="time" 
                      required
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      className="w-full bg-black/45 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-aura-muted">Primary Diagnostic Concern</label>
                  <select 
                    value={appointmentReason}
                    onChange={(e) => setAppointmentReason(e.target.value)}
                    className="w-full bg-black/45 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="Acne & Blemish Management">Acne & Blemish Management</option>
                    <option value="Viscosity Layering & Formula Audit">Viscosity Layering & Formula Audit</option>
                    <option value="Barrier Rejuvenation">Barrier Rejuvenation</option>
                    <option value="Follicular Hair Density">Follicular Hair Density</option>
                    <option value="Biological Age Optimization">Biological Age Optimization</option>
                  </select>
                </div>

                {/* Telemetry share checkbox */}
                {result && (
                  <div className="p-3 rounded-xl border border-purple-500/20 bg-purple-950/15 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-purple-400" />
                      <div>
                        <strong className="text-white block text-[11px]">Share Telemetry Data</strong>
                        <span className="text-[9px] text-aura-muted">Score: {result.beautyScore} | Skin: {profile?.skinType}</span>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={shareTelemetry}
                      onChange={(e) => setShareTelemetry(e.target.checked)}
                      className="rounded border-white/10 text-purple-600 focus:ring-purple-500 bg-black/45"
                    />
                  </div>
                )}

                <div className="flex justify-between items-center pt-2">
                  <div className="text-xs">
                    <span className="text-aura-muted block text-[10px]">Session Fee</span>
                    <strong className="text-white text-sm">${selectedSpecialist.fee}</strong>
                  </div>
                  <button 
                    type="submit"
                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition shadow-glow-primary no-lift"
                  >
                    Confirm Appointment
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Telehealth Video Call Session Simulator Overlay */}
      {telehealthActive && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-lg animate-fadeIn text-white">
          {/* Header */}
          <div className="p-4 border-b border-white/10 bg-black/40 flex justify-between items-center px-8">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <div>
                <h3 className="font-bold text-sm tracking-wide">SECURE TELEHEALTH VIDEO SESSION #TV-9082</h3>
                <p className="text-[10px] text-purple-400 font-semibold font-mono">HIPAA COMPLIANT · END-TO-END ENCRYPTED</p>
              </div>
            </div>
            
            <button 
              onClick={endTelehealthCall}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition no-lift"
            >
              Terminate Session
            </button>
          </div>

          {/* Video Session Area */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 p-6 gap-6 overflow-hidden">
            {/* Left: Video Feeds */}
            <div className="lg:col-span-8 flex flex-col gap-4 relative justify-between">
              
              {/* Doctor Main Video Stream */}
              <div className="flex-1 rounded-2xl border border-white/10 bg-slate-900 overflow-hidden relative flex flex-col items-center justify-center p-6">
                
                {/* Doctor Face/Background simulator */}
                {simStep === 0 ? (
                  <div className="text-center space-y-3">
                    <Clock size={36} className="text-purple-400 mx-auto animate-spin" />
                    <p className="text-xs text-purple-300 font-mono">Establishing connection to secure medical server...</p>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-between text-center">
                    {/* Top status */}
                    <div className="w-full flex justify-between text-[10px] text-white/50 font-mono">
                      <span>FPS: 60 | RTT: 24ms | Loss: 0%</span>
                      <span className="text-emerald-400">● LIVE FEED</span>
                    </div>

                    {/* Doctor visual wrapper */}
                    <div className="relative">
                      <div className="w-40 h-40 rounded-full border-2 border-purple-500/50 overflow-hidden relative shadow-glow-primary">
                        <img 
                          src={SPECIALISTS[0].avatar} 
                          alt="Doctor" 
                          className="w-full h-full object-cover"
                        />
                        {/* Audio wave indicator */}
                        <div className="absolute inset-0 bg-purple-500/10 animate-pulse flex items-center justify-center" />
                      </div>
                      {/* Sweeping scan line */}
                      <div className="absolute inset-x-0 h-0.5 bg-purple-400 top-1/2 animate-bounce" />
                    </div>

                    {/* Doctor Subtitles */}
                    <div className="p-4 rounded-xl bg-black/60 border border-white/5 max-w-xl">
                      <strong className="text-purple-400 text-xs block mb-1">Dr. Evelyn Vance:</strong>
                      <p className="text-xs text-white/95 leading-relaxed font-mono">{doctorSpeakingText}</p>
                    </div>

                    {/* Navigation inside call dialogues */}
                    {simStep === 1 && doctorSpeakingText.startsWith('Hello') && (
                      <button 
                        onClick={handleNextCallDialogue}
                        className="btn btn-primary btn-sm flex items-center gap-1.5 font-bold"
                      >
                        Ask for Formulation Review <ChevronRight size={13} />
                      </button>
                    )}
                  </div>
                )}

                {/* Picture in picture (User webcam scan) */}
                <div className="absolute bottom-4 right-4 w-36 h-44 rounded-xl border border-white/20 bg-slate-950 overflow-hidden flex flex-col justify-between p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] font-mono text-cyan-400">PATIENT CAMERA</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  </div>
                  
                  {/* Face Mesh Simulation */}
                  <div className="flex-1 flex flex-col justify-center items-center relative">
                    <User size={24} className="text-cyan-400/40 animate-pulse" />
                    <div className="absolute inset-0 border border-dashed border-cyan-500/25 rounded-lg flex items-center justify-center">
                      <span className="text-[7px] text-cyan-400/60 font-mono tracking-widest uppercase">MESH LOCK</span>
                    </div>
                  </div>

                  <span className="text-[7px] font-mono text-white/50 text-center">Telemetry Sync 98%</span>
                </div>

              </div>
            </div>

            {/* Right: Skin Telemetry Diagnostic Dashboard */}
            <div className="lg:col-span-4 rounded-2xl border border-white/10 bg-slate-900/50 p-5 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                  <ShieldAlert size={16} className="text-purple-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">Live Telemetry Panel</h4>
                </div>

                {result ? (
                  <div className="space-y-4">
                    {/* General Score */}
                    <div className="p-3.5 rounded-xl bg-purple-950/15 border border-purple-500/20 text-center">
                      <span className="text-[10px] text-aura-muted uppercase tracking-wider font-bold block mb-1">Active Skin Health Score</span>
                      <strong className="text-3xl font-black text-white">{result.beautyScore}</strong>
                      <span className="text-[9px] text-purple-400 block mt-1">Calculated via Dermatologist Agent</span>
                    </div>

                    {/* Metrics list */}
                    <div className="space-y-2">
                      <span className="text-[9px] text-aura-muted uppercase tracking-wider font-bold block">Biomarker Assessment</span>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs p-2 rounded bg-white/5 border border-white/5">
                          <span>Hydration Level:</span>
                          <strong className="text-cyan-400">{result.skinHealth.measurements.dryness < 30 ? '88% (Optimal)' : `${100 - result.skinHealth.measurements.dryness}% (Low)`}</strong>
                        </div>
                        <div className="flex justify-between text-xs p-2 rounded bg-white/5 border border-white/5">
                          <span>Redness Index:</span>
                          <strong className="text-rose-400">{result.skinHealth.measurements.redness}% (Moderate)</strong>
                        </div>
                        <div className="flex justify-between text-xs p-2 rounded bg-white/5 border border-white/5">
                          <span>Aging Risk Score:</span>
                          <strong className="text-purple-400">{result.skinHealth.agingRiskScore}%</strong>
                        </div>
                      </div>
                    </div>

                    {/* Product layered suggestions */}
                    <div className="space-y-2 pt-2">
                      <span className="text-[9px] text-aura-muted uppercase tracking-wider font-bold block">Active Prescribed Layering</span>
                      <div className="space-y-1 text-[11px] text-white/90">
                        {result.products.slice(0, 2).map((p, i) => (
                          <div key={i} className="flex gap-2 items-start border-l-2 border-purple-500 pl-2 py-0.5">
                            <div>
                              <strong>{p.name}</strong>
                              <span className="block text-[9px] text-white/50">{p.reason}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 text-xs text-aura-muted space-y-2">
                    <AlertCircle size={20} className="mx-auto text-amber-500" />
                    <p>No active scan profile loaded.</p>
                    <p className="text-[10px]">The telehealth simulator is running in general consultation mode.</p>
                  </div>
                )}
              </div>

              {/* Call Control panel */}
              <div className="pt-4 border-t border-white/5 space-y-3">
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={() => setAudioMuted(!audioMuted)}
                    className={`p-2.5 rounded-full border transition ${audioMuted ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                  >
                    {audioMuted ? <MicOff size={16} /> : <Mic size={16} />}
                  </button>
                  <button 
                    onClick={() => setVideoMuted(!videoMuted)}
                    className={`p-2.5 rounded-full border transition ${videoMuted ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                  >
                    {videoMuted ? <VideoOff size={16} /> : <Video size={16} />}
                  </button>
                  <button 
                    onClick={endTelehealthCall}
                    className="p-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white transition"
                    title="End Call Session"
                  >
                    <PhoneOff size={16} />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
