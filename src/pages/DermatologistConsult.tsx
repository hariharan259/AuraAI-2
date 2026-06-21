import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAura } from '../context/AuraContext';
import { 
  User, Calendar, MessageSquare, Video, ShieldAlert, Sparkles, 
  Award, Star, Clock, Check, ArrowRight, VideoOff, Mic, MicOff, 
  PhoneOff, X, Compass, CheckCircle2, ChevronRight, MessageCircle, AlertCircle,
  FileText, Download, Printer, UserCheck, Stethoscope
} from 'lucide-react';

interface Specialist {
  id: number;
  name: string;
  title: string;
  type: 'Dermatologist' | 'Trichologist' | 'Formulation Scientist' | 'Wellness Coach';
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
  },
  {
    id: 4,
    name: 'Dr. Leila Thorne, MD',
    title: 'Cosmetic Dermatologist & Acne Specialist',
    type: 'Dermatologist',
    rating: 4.9,
    reviews: 184,
    experience: 10,
    specialties: ['Cystic Acne', 'Scar Resurfacing', 'Post-Inflammatory Hyperpigmentation'],
    nextSlot: 'Today, 5:15 PM',
    fee: 55,
    avatar: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=300&q=80',
    bio: 'Renowned expert in laser therapies and severe acne treatment cascades. Focuses on combining clinical prescriptions with protective daily barriers.'
  },
  {
    id: 5,
    name: 'Dr. Rajan Patel, MD',
    title: 'Hair Loss & Transplant Surgeon',
    type: 'Trichologist',
    rating: 4.7,
    reviews: 110,
    experience: 14,
    specialties: ['Androgenetic Alopecia', 'Platelet-Rich Plasma (PRP)', 'Minoxidil Synergies'],
    nextSlot: 'Tomorrow, 2:00 PM',
    fee: 65,
    avatar: 'https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&w=300&q=80',
    bio: 'Double board-certified hair restoration surgeon. Focuses on medical therapies for early receding hair lines and follicular micro-grafts.'
  },
  {
    id: 6,
    name: 'Chloe Duprat, PhD',
    title: 'Scalp Microbiome Researcher',
    type: 'Trichologist',
    rating: 4.8,
    reviews: 73,
    experience: 8,
    specialties: ['Seborrheic Dermatitis', 'Dandruff Cascades', 'pH Scalp Buffers'],
    nextSlot: 'June 24, 9:00 AM',
    fee: 40,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    bio: 'Microbiologist studying sebum-fungal interactions. Formulates scalp serums that rebalance yeast counts and strengthen hair root shafts.'
  }
];

interface Prescription {
  cleanser: string;
  serum: string;
  frequency: string;
  notes: string;
  doctor: string;
  date: string;
}

export default function DermatologistConsult() {
  const navigate = useNavigate();
  const { state } = useAura();
  const result = state.analysisResult;
  const profile = state.profile;

  const [activeTab, setActiveTab] = useState<'marketplace' | 'messages' | 'appointments' | 'prescriptions'>('marketplace');
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [shareTelemetry, setShareTelemetry] = useState(true);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('Video Call');
  const [appointmentReason, setAppointmentReason] = useState('Acne & Blemish Management');
  const [bookedAppointments, setBookedAppointments] = useState<any[]>([]);

  // Telehealth video simulator state
  const [telehealthActive, setTelehealthActive] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [simStep, setSimStep] = useState(0); // 0: connecting, 1: ongoing, 2: ended
  const [doctorSpeakingText, setDoctorSpeakingText] = useState('Connecting secure telehealth video feed...');

  // Doctor Dashboard Portal Simulator State
  const [isDoctorMode, setIsDoctorMode] = useState(false);
  const [prescriptionForm, setPrescriptionForm] = useState({
    cleanser: '2% Salicylic Acid Gel Cleanser',
    serum: '10% Niacinamide + 1% Zinc PCA Serum',
    frequency: 'Apply once daily at night. Follow with oil-free moisturizer.',
    notes: 'Avoid layering directly with Vitamin C or AHA peeling solutions to prevent skin barrier flushing. Monitor dryness index over 14 days.'
  });

  const [activePrescription, setActivePrescription] = useState<Prescription | null>(() => {
    const saved = localStorage.getItem('aura_prescription');
    return saved ? JSON.parse(saved) : {
      cleanser: 'Gentle Hydrating Cleanser with Centella',
      serum: '2% Hyaluronic Acid + Panthenol active barrier complex',
      frequency: 'Apply morning and night on damp skin.',
      notes: 'Initial clinical assessment indicates minor epidermal moisture loss. Share progress logs weekly.',
      doctor: 'Dr. Evelyn Vance, MD',
      date: 'June 20, 2026'
    };
  });

  // Mock messages state
  const [chatSpecialist, setChatSpecialist] = useState<Specialist | null>(SPECIALISTS[0]);
  const [messages, setMessages] = useState<any>({
    1: [
      { sender: 'specialist', text: 'Hello! I reviewed your latest AuraAI diagnostic report. Your hydration index is slightly low. Let\'s adjust your hyaluronic layering.', time: 'Yesterday' }
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
        replyText = "Yes, switching to a pH-balanced salicylic scalp cleanser should help dissolve that buildup without triggering dandruff.";
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
      type: appointmentType,
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

  // Doctor Dashboard: Issue Prescription
  const handleIssuePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    const newPresc: Prescription = {
      cleanser: prescriptionForm.cleanser,
      serum: prescriptionForm.serum,
      frequency: prescriptionForm.frequency,
      notes: prescriptionForm.notes,
      doctor: 'Dr. Evelyn Vance, MD',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    };

    setActivePrescription(newPresc);
    localStorage.setItem('aura_prescription', JSON.stringify(newPresc));
    alert('Clinical Prescription issued and synced to Patient Ledger successfully!');
    setIsDoctorMode(false);
    setActiveTab('prescriptions');
  };

  return (
    <div className="page-content animate-fadeIn p-6 max-w-6xl mx-auto">
      
      {/* Portal Mode Switcher */}
      <div className="flex justify-between items-center mb-6 p-3 rounded-2xl border border-purple-500/20 bg-purple-950/10">
        <div className="flex items-center gap-2">
          <Stethoscope size={18} className="text-purple-400" />
          <span className="text-xs text-white">
            Currently in <strong className="text-purple-400">{isDoctorMode ? 'Doctor Portal Mode' : 'Patient Portal Mode'}</strong>
          </span>
        </div>
        <button
          onClick={() => setIsDoctorMode(!isDoctorMode)}
          className="px-3.5 py-1.5 bg-purple-600/25 hover:bg-purple-600/40 text-purple-300 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-purple-500/30 no-lift"
        >
          <UserCheck size={14} />
          {isDoctorMode ? 'Switch to Patient Mode' : 'Switch to Doctor Dashboard'}
        </button>
      </div>

      {isDoctorMode ? (
        /* ================= DOCTOR PORTAL DASHBOARD SIMULATOR ================= */
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-white/5 bg-glass-bg">
            <h2 className="text-xl font-bold text-white mb-2 font-display">Dermatologist Portal Simulator</h2>
            <p className="text-xs text-aura-muted">Simulate clinical consultations, review patient skin twin diagnostic telemetry, and write prescriptions.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Patient Telemetry Review */}
            <div className="lg:col-span-6 space-y-6">
              <div className="p-5 rounded-2xl border border-white/5 bg-black/20 space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <User size={14} className="text-purple-400" /> Patient Active Profile
                  </h3>
                  <span className="text-[10px] text-emerald-400 font-mono">Connected</span>
                </div>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span>Patient Name:</span> <strong className="text-white">{profile?.name || 'Sarah Jenkins'}</strong></div>
                  <div className="flex justify-between"><span>Skin Type Profile:</span> <strong className="text-white capitalize">{profile?.skinType || 'Oily'}</strong></div>
                  <div className="flex justify-between"><span>Chronological Age:</span> <strong className="text-white">{profile?.age || 24} Years</strong></div>
                  {result && (
                    <>
                      <div className="flex justify-between"><span>AI Skin Health Index:</span> <strong className="text-purple-400 font-black">{result.beautyScore} / 100</strong></div>
                      <div className="flex justify-between"><span>Epidermal Hydration:</span> <strong className="text-cyan-400">{result.skinHealth.hydrationScore}%</strong></div>
                      <div className="flex justify-between"><span>UV Damage Score:</span> <strong className="text-amber-400">{result.skinHealth.uvDamageScore}%</strong></div>
                    </>
                  )}
                </div>
              </div>

              {/* 90-Day progress chart simulation */}
              <div className="p-5 rounded-2xl border border-white/5 bg-black/20">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Patient 90-Day Trajectory</h3>
                <div className="h-40 flex items-end justify-between gap-1 pt-4">
                  {[62, 65, 68, 70, 75, 78, 80, 84, 88].map((val, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5">
                      <div className="w-full bg-purple-500/25 border border-purple-500/30 rounded-t-sm" style={{ height: `${val * 1.2}px` }} />
                      <span className="text-[8px] text-aura-muted font-mono">D-{idx * 10}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Digital Prescription Writer Pad */}
            <div className="lg:col-span-6 p-6 rounded-2xl border border-purple-500/20 bg-purple-950/5">
              <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                <FileText size={16} className="text-purple-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Clinical Prescription Writer</h3>
              </div>

              <form onSubmit={handleIssuePrescription} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-aura-muted">Prescribed Cleanser active</label>
                  <input 
                    type="text" 
                    value={prescriptionForm.cleanser}
                    onChange={(e) => setPrescriptionForm({ ...prescriptionForm, cleanser: e.target.value })}
                    className="w-full bg-black/45 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-aura-muted">Prescribed Serum compound</label>
                  <input 
                    type="text" 
                    value={prescriptionForm.serum}
                    onChange={(e) => setPrescriptionForm({ ...prescriptionForm, serum: e.target.value })}
                    className="w-full bg-black/45 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-aura-muted">Application Frequency</label>
                  <input 
                    type="text" 
                    value={prescriptionForm.frequency}
                    onChange={(e) => setPrescriptionForm({ ...prescriptionForm, frequency: e.target.value })}
                    className="w-full bg-black/45 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-aura-muted">Special Clinical Directions</label>
                  <textarea 
                    rows={3}
                    value={prescriptionForm.notes}
                    onChange={(e) => setPrescriptionForm({ ...prescriptionForm, notes: e.target.value })}
                    className="w-full bg-black/45 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none resize-none"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition shadow-glow-primary no-lift"
                >
                  Sign and Issue Clinical Prescription
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        /* ================= PATIENT PORTAL PAGE ================= */
        <div className="space-y-8">
          {/* Header tabs for Patient */}
          <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-aura-muted">Patient Consult Portal</h3>
            
            {activeTab === 'marketplace' && (
              <button 
                onClick={() => setActiveTab('prescriptions')}
                className="px-3.5 py-1.5 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 hover:text-white border border-purple-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5 no-lift"
              >
                <FileText size={14} /> View Active Prescription
              </button>
            )}
            {activeTab === 'prescriptions' && (
              <button 
                onClick={() => setActiveTab('marketplace')}
                className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-xs font-bold transition flex items-center gap-1.5 no-lift"
              >
                <Compass size={14} /> Back to Marketplace
              </button>
            )}
          </div>

          {activeTab === 'marketplace' && (
            <div className="space-y-8">
              {/* Telehealth status banner */}
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
                    <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-purple-500 to-indigo-500" />
                    
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

              {/* Telehealth Video Visit Callout */}
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
              {/* Left Panel: Contacts */}
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

              {/* Right Panel: Chat dialogue */}
              <div className="lg:col-span-8 flex flex-col justify-between bg-black/10">
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
                      className="flex-1 bg-black/45 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-purple-500 focus:outline-none transition"
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

          {/* Booked Appointments */}
          {activeTab === 'appointments' && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-aura-muted">Scheduled Appointments</h3>
              
              {bookedAppointments.length === 0 ? (
                <div className="p-12 rounded-2xl border border-dashed border-white/10 text-center py-20 bg-glass-bg">
                  <Calendar size={40} className="text-purple-400 mx-auto mb-3 animate-pulse" />
                  <h4 className="text-base font-bold text-white mb-1">No Appointments Scheduled</h4>
                  <p className="text-xs text-aura-muted max-w-xs mx-auto mb-6">
                    Connect with specialists to plan your skincare routines, resolve active compound conflicts, or execute scalp health reviews.
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
                            <span>Consultation Type:</span>
                            <strong className="text-white">{app.type}</strong>
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

          {/* Active Prescriptions Panel */}
          {activeTab === 'prescriptions' && (
            <div className="max-w-2xl mx-auto space-y-6">
              {activePrescription ? (
                <div className="p-8 rounded-2xl border-2 border-purple-500/25 bg-slate-950/80 backdrop-blur-xl relative space-y-6 overflow-hidden">
                  {/* Decorative Rx watermark background */}
                  <div className="absolute top-6 right-6 text-9xl font-serif text-purple-500/5 select-none pointer-events-none">Rx</div>
                  
                  {/* Clinic Header */}
                  <div className="border-b border-white/10 pb-4 flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-bold text-white font-display">AuraAI Clinical Telehealth Registry</h2>
                      <p className="text-[10px] text-purple-400 font-mono tracking-wider">SECURE DIGITAL PRESCRIPTION CAS-9082</p>
                    </div>
                    <span className="text-[10px] font-mono text-aura-muted">{activePrescription.date}</span>
                  </div>

                  {/* Patient Info */}
                  <div className="grid grid-cols-2 gap-4 text-xs bg-white/5 p-4 rounded-xl border border-white/5">
                    <div>
                      <span className="text-[9px] text-aura-muted uppercase tracking-wider block">Patient</span>
                      <strong className="text-white">{profile?.name || 'Sarah Jenkins'}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-aura-muted uppercase tracking-wider block">Prescribed By</span>
                      <strong className="text-white">{activePrescription.doctor}</strong>
                    </div>
                  </div>

                  {/* Prescribed compounds */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-[9px] text-purple-400 uppercase tracking-wider block font-bold">1. Recommended Daily Cleanser</span>
                      <p className="text-xs text-white/90 font-mono bg-black/45 p-3 rounded-lg border border-white/5">{activePrescription.cleanser}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] text-purple-400 uppercase tracking-wider block font-bold">2. Prescribed Active Serum Compound</span>
                      <p className="text-xs text-white/90 font-mono bg-black/45 p-3 rounded-lg border border-white/5">{activePrescription.serum}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] text-purple-400 uppercase tracking-wider block font-bold">3. Layering Dosage & Cycle Frequency</span>
                      <p className="text-xs text-white/90 font-mono bg-black/45 p-3 rounded-lg border border-white/5">{activePrescription.frequency}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] text-purple-400 uppercase tracking-wider block font-bold">4. Special Directions & Chemistry Warnings</span>
                      <p className="text-xs text-aura-muted bg-black/45 p-3 rounded-lg border border-white/5 leading-relaxed">{activePrescription.notes}</p>
                    </div>
                  </div>

                  {/* Footer & Signature */}
                  <div className="border-t border-white/10 pt-4 flex justify-between items-center text-xs">
                    <div className="text-[10px] text-aura-muted leading-tight">
                      <span>Verification Hash:</span>
                      <span className="block font-mono text-[9px] text-purple-400">SHA-256: d83f8a...22ac9e</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[9px] text-aura-muted uppercase tracking-wider block">Digital Signature</span>
                      <span className="font-serif italic text-purple-400 text-sm">{activePrescription.doctor}</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => window.print()}
                      className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-white text-xs font-bold transition flex items-center justify-center gap-2"
                    >
                      <Printer size={13} /> Print Document
                    </button>
                    <button 
                      onClick={() => alert('PDF file prepared. Downloading clinical prescription receipt...')}
                      className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-glow-primary"
                    >
                      <Download size={13} /> Download PDF
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-12 rounded-2xl border border-dashed border-white/10 text-center py-20 bg-glass-bg">
                  <AlertCircle size={40} className="text-purple-400 mx-auto mb-3 animate-pulse" />
                  <h4 className="text-base font-bold text-white mb-1">No Prescriptions Registered</h4>
                  <p className="text-xs text-aura-muted max-w-xs mx-auto">
                    Toggle to "Doctor Portal" to simulate clinical evaluations and issue digital prescriptions.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Appointment booking form modal */}
      {bookingModalOpen && selectedSpecialist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md rounded-2xl border border-aura-border bg-aura-panel p-6 shadow-2xl glass-gradient animate-scaleIn">
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

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-aura-muted">Appointment Type</label>
                    <select
                      value={appointmentType}
                      onChange={(e) => setAppointmentType(e.target.value)}
                      className="w-full bg-black/45 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                    >
                      <option value="Video Call">Video Call</option>
                      <option value="Audio Call">Audio Call</option>
                      <option value="Secure Chat">Secure Chat</option>
                      <option value="Physical Clinic">Physical Clinic</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-aura-muted">Primary Concern</label>
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
                </div>

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

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 p-6 gap-6 overflow-hidden">
            <div className="lg:col-span-8 flex flex-col gap-4 relative justify-between">
              <div className="flex-1 rounded-2xl border border-white/10 bg-slate-900 overflow-hidden relative flex flex-col items-center justify-center p-6">
                
                {simStep === 0 ? (
                  <div className="text-center space-y-3">
                    <Clock size={36} className="text-purple-400 mx-auto animate-spin" />
                    <p className="text-xs text-purple-300 font-mono">Establishing connection to secure medical server...</p>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-between text-center">
                    <div className="w-full flex justify-between text-[10px] text-white/50 font-mono">
                      <span>FPS: 60 | RTT: 24ms | Loss: 0%</span>
                      <span className="text-emerald-400">● LIVE FEED</span>
                    </div>

                    <div className="relative">
                      <div className="w-40 h-40 rounded-full border-2 border-purple-500/50 overflow-hidden relative shadow-glow-primary">
                        <img 
                          src={SPECIALISTS[0].avatar} 
                          alt="Doctor" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-purple-500/10 animate-pulse flex items-center justify-center" />
                      </div>
                      <div className="absolute inset-x-0 h-0.5 bg-purple-400 top-1/2 animate-bounce" />
                    </div>

                    <div className="p-4 rounded-xl bg-black/60 border border-white/5 max-w-xl">
                      <strong className="text-purple-400 text-xs block mb-1">Dr. Evelyn Vance:</strong>
                      <p className="text-xs text-white/95 leading-relaxed font-mono">{doctorSpeakingText}</p>
                    </div>

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

                <div className="absolute bottom-4 right-4 w-36 h-44 rounded-xl border border-white/20 bg-slate-950 overflow-hidden flex flex-col justify-between p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] font-mono text-cyan-400">PATIENT CAMERA</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  </div>
                  
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

            <div className="lg:col-span-4 rounded-2xl border border-white/10 bg-slate-900/50 p-5 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                  <ShieldAlert size={16} className="text-purple-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">Live Telemetry Panel</h4>
                </div>

                {result ? (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-purple-950/15 border border-purple-500/20 text-center">
                      <span className="text-[10px] text-aura-muted uppercase tracking-wider font-bold block mb-1">Active Skin Health Score</span>
                      <strong className="text-3xl font-black text-white">{result.beautyScore}</strong>
                      <span className="text-[9px] text-purple-400 block mt-1">Calculated via Dermatologist Agent</span>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[9px] text-aura-muted uppercase tracking-wider font-bold block">Biomarker Assessment</span>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs p-2 rounded bg-white/5 border border-white/5">
                          <span>Hydration Level:</span>
                          <strong className="text-cyan-400">{result.skinHealth.hydrationScore}% (Optimal)</strong>
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
