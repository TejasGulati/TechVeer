'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Stethoscope,
  Search,
  PhoneCall,
  CalendarDays,
  User,
  FileText,
  MessageCircle,
  Send,
  X,
  Video,
  Mic,
  Radio,
} from 'lucide-react';
import Image from 'next/image';

export default function PatientPortal() {
  // --- Base states & refs
  const [isRegistered, setIsRegistered] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [formData, setFormData] = useState({
    name: 'Kshitiz Singh',
    age: '',
    email: '',
    phone: '',
    specialty: '',
    symptoms: '',
    gender: '',
    address: '',
  });

  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([{ sender: 'ai', text: '👋 Hello! I’m Dr. AI. Please describe your symptoms.' }]);
  const [inputMessage, setInputMessage] = useState('');
  const chatEndRef = useRef(null);

  // Dashboard states
  const [leftTab, setLeftTab] = useState('menu'); // menu | profile | appointments | book | reports | prescriptions | billing | support
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [videoCallOpen, setVideoCallOpen] = useState(false);
  const [videoParticipants, setVideoParticipants] = useState(['You', 'Dr. Assistant']);
  const [videoMuted, setVideoMuted] = useState(false);
  const [videoCameraOff, setVideoCameraOff] = useState(false);

  // sample doctors
  const doctors = [
    { id: 'd1', name: 'Dr. A. Mehta', dept: 'Cardiology', price: '₹800', city: 'Delhi', img: '/doctor1.jpg' },
    { id: 'd2', name: 'Dr. R. Gupta', dept: 'Dermatology', price: '₹600', city: 'Mumbai', img: '/doctor2.jpg' },
    { id: 'd3', name: 'Dr. K. Sharma', dept: 'Neurology', price: '₹1000', city: 'Pune', img: '/doctor3.jpg' },
    { id: 'd4', name: 'Dr. S. Verma', dept: 'Pediatrics', price: '₹600', city: 'Bengaluru', img: '/doctor4.jpg' },
  ];

  const awardedDoctors = [
    { id: 'a1', name: 'Dr. Priya Nanda', dept: 'Pediatrics', award: 'Best Pediatrician 2023', img: '/doctor5.jpg' },
    { id: 'a2', name: 'Dr. Raj Malhotra', dept: 'Orthopedic', award: 'Top Surgeon 2022', img: '/doctor6.jpg' },
    { id: 'a3', name: 'Dr. Reena Shah', dept: 'Dermatology', award: 'Skin Expert 2023', img: '/doctor7.jpg' },
  ];

  // demo stateful data (simple state version)
  const [appointments, setAppointments] = useState([
    { id: 1, doctor: 'Dr. K. Sharma', dept: 'Neurology', date: '2024-10-14', mode: 'Video', notes: 'Migraine follow-up' },
  ]);
  const [reports, setReports] = useState([
    { id: 1, title: 'Blood Report - Oct 2024', doctor: 'Dr. Mehta', date: '2024-10-14', fee: 400, file: null },
    { id: 2, title: 'X-Ray - Knee', doctor: 'Dr. Verma', date: '2024-08-21', fee: 600, file: null },
  ]);
  const [prescriptions, setPrescriptions] = useState([
    { id: 1, by: 'Dr. K. Sharma', date: '2024-10-14', summary: 'Paracetamol 500mg — 1 tab TDS', details: 'Take for 5 days' },
  ]);
  const [bills, setBills] = useState([
    { id: 1, title: 'Consultation - Dr. K Sharma', amount: 1000, due: '2024-11-02', paid: false },
  ]);
  const [supportMessages, setSupportMessages] = useState([]);

  // booking form local state
  const [bookingData, setBookingData] = useState({
    name: '',
    phone: '',
    email: '',
    doctorId: '',
    symptoms: '',
    mode: 'Video',
    date: '',
  });

  // --- OTP handlers
  const handleSendOTP = () => {
    if (!formData.email || !formData.phone) return alert('Please fill email and phone first.');
    setOtpSent(true);
    setTimeout(() => alert('Demo OTP sent: 1234'), 300);
  };

  const handleVerifyOTP = () => {
    if (otp === '1234') {
      setIsRegistered(true);
    } else alert('❌ Invalid OTP');
  };

  // --- Chat
  const sendMessage = () => {
    if (!inputMessage.trim()) return;
    const newMsg = { sender: 'user', text: inputMessage };
    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: 'ai', text: `AI: Thanks — I see "${newMsg.text}". You can book a consultation for more.` }]);
    }, 700);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- Video call mock controls
  const openVideoCall = (doctor) => {
    setSelectedDoctor(doctor || null);
    setVideoMuted(false);
    setVideoCameraOff(false);
    setVideoParticipants(['You', doctor ? doctor.name : 'Dr. Assistant']);
    setVideoCallOpen(true);
  };

  const hangupCall = () => {
    setVideoCallOpen(false);
  };

  // --- Profile save (simple local save)
  const handleSaveProfile = (e) => {
    e?.preventDefault();
    alert('Profile saved ✅');
  };

  // --- Reports open (mock)
  const openReport = (r) => {
    alert(`Opening report: ${r.title} (${r.date}) — mock viewer\nDoctor: ${r.doctor} • Fee: ₹${r.fee}`);
  };

  // --- Doctor booking (mock) -> from center or Book tab
  const bookDoctor = (doc) => {
    // open booking with prefilled doctor
    setBookingData({
      ...bookingData,
      doctorId: doc?.id || '',
      name: formData.name || '',
      phone: formData.phone || '',
      email: formData.email || '',
      symptoms: '',
      mode: 'Video',
      date: '',
    });
    setLeftTab('book');
  };

  const submitBooking = (e) => {
    e?.preventDefault();
    // small validation
    if (!bookingData.name || !bookingData.phone || !bookingData.doctorId) return alert('Please fill name, phone and select doctor.');
    const doc = doctors.find((d) => d.id === bookingData.doctorId);
    const newAppt = {
      id: Date.now(),
      doctor: doc ? doc.name : 'Selected Doctor',
      dept: doc ? doc.dept : bookingData.dept || 'General',
      date: bookingData.date || new Date().toISOString().slice(0, 10),
      notes: bookingData.symptoms || '—',
      mode: bookingData.mode,
    };
    setAppointments((s) => [newAppt, ...s]);
    // add bill
    const price = doc ? parseInt(doc.price.replace(/\D/g, '')) : 500;
    setBills((s) => [{ id: Date.now(), title: `Consultation - ${newAppt.doctor}`, amount: price, due: newAppt.date, paid: false }, ...s]);
    // clear booking form and show confirmation
    setBookingData({ name: '', phone: '', email: '', doctorId: '', symptoms: '', mode: 'Video', date: '' });
    setLeftTab('appointments');
    alert('✅ Appointment booked (mock).');
  };

  // --- Prescriptions view (mock)
  const viewPrescription = (p) => {
    alert(`Prescription by ${p.by} on ${p.date}\n\n${p.summary}\n\n${p.details || ''}`);
  };

  // --- Billing pay (mock)
  const payBill = (billId) => {
    setBills((s) => s.map((b) => (b.id === billId ? { ...b, paid: true } : b)));
    alert('Mock payment processed ✅');
  };

  // --- Support
  const sendSupport = (msg, contact) => {
    setSupportMessages((s) => [...s, { id: Date.now(), msg, contact, date: new Date().toISOString() }]);
    alert('Support message sent to Kshitiz Singh (mock).');
  };

  // --- Fix right sidebar overflow by constraining height + internal overflow
  // Already addressed in markup below (h-[70vh] + overflow-auto)

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-[#4F46E5] via-[#3B82F6] to-[#06B6D4] overflow-hidden">
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.12),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.08),transparent_40%)] blur-3xl opacity-60"
        animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      <div className="relative z-10 w-full max-w-7xl p-6">
        {/* LOGIN */}
        {!isRegistered ? (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-indigo-100">
            <Lock className="w-10 h-10 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-indigo-700 text-center mb-2">Patient Login</h2>
            <p className="text-center text-gray-600 mb-6">Login securely using OTP verification</p>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-4 focus:ring-indigo-300 outline-none"
              />
              <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-4 focus:ring-indigo-300 outline-none"
              />
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-4 focus:ring-indigo-300 outline-none"
              />

              {!otpSent ? (
                <motion.button whileHover={{ scale: 1.03 }} onClick={handleSendOTP} className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-3 rounded-xl font-semibold shadow-md">
                  Send OTP
                </motion.button>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Enter OTP (try 1234)"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-4 focus:ring-indigo-300 outline-none"
                  />
                  <motion.button whileHover={{ scale: 1.03 }} onClick={handleVerifyOTP} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold shadow-md">
                    Verify & Continue
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        ) : (
          // DASHBOARD
          <div className="grid grid-cols-12 gap-6">
            {/* LEFT SIDEBAR */}
            <motion.aside initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="col-span-12 md:col-span-2 bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20">
              <h3 className="text-white font-semibold mb-4">Patient</h3>

              <div className="space-y-3">
                <button onClick={() => setLeftTab('profile')} className={`flex items-center gap-3 w-full text-left p-3 rounded-lg hover:bg-white/10 transition text-white`}> <User className="w-4 h-4" /> <span className="font-medium">My Details</span></button>
                <button onClick={() => setLeftTab('appointments')} className="flex items-center gap-3 w-full text-left p-3 rounded-lg hover:bg-white/10 transition text-white"><CalendarDays className="w-4 h-4" /> <span className="font-medium">Previous Appointments</span></button>
                <button onClick={() => setLeftTab('book')} className="flex items-center gap-3 w-full text-left p-3 rounded-lg hover:bg-white/10 transition text-white"><Stethoscope className="w-4 h-4" /> <span className="font-medium">Book Appointment</span></button>
                <button onClick={() => setLeftTab('reports')} className="flex items-center gap-3 w-full text-left p-3 rounded-lg hover:bg-white/10 transition text-white"><FileText className="w-4 h-4" /> <span className="font-medium">Reports</span></button>
                <button onClick={() => setLeftTab('prescriptions')} className="flex items-center gap-3 w-full text-left p-3 rounded-lg hover:bg-white/10 transition text-white"><FileText className="w-4 h-4" /> <span className="font-medium">Prescriptions</span></button>
                <button onClick={() => setLeftTab('billing')} className="flex items-center gap-3 w-full text-left p-3 rounded-lg hover:bg-white/10 transition text-white"><Radio className="w-4 h-4" /> <span className="font-medium">Billing</span></button>
                <button onClick={() => setLeftTab('support')} className="flex items-center gap-3 w-full text-left p-3 rounded-lg hover:bg-white/10 transition text-white"><MessageCircle className="w-4 h-4" /> <span className="font-medium">Support</span></button>
              </div>
            </motion.aside>

            {/* CENTER content */}
            <main className="col-span-12 md:col-span-7 bg-white/80 backdrop-blur-xl rounded-3xl p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-indigo-700">Welcome back 👋</h1>
                  <p className="text-gray-700">Find and book top specialists — or start a video consult with one click.</p>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setLeftTab('profile')} className="px-4 py-2 rounded-md bg-white/90 border">My Profile</button>
                  <button onClick={() => setLeftTab('reports')} className="px-4 py-2 rounded-md bg-white/90 border">My Reports</button>
                </div>
              </div>

              {/* RENDER BY LEFT TAB */}
              {/* TAB: profile */}
              {leftTab === 'profile' && (
                <div>
                  <h3 className="text-lg font-semibold text-indigo-700 mb-4">My Details</h3>
                  <form onSubmit={handleSaveProfile} className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input placeholder="Full name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="p-3 rounded-lg border" />
                      <input placeholder="Age" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} className="p-3 rounded-lg border" />
                      <input placeholder="Gender" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="p-3 rounded-lg border" />
                      <input placeholder="Blood group" value={formData.bloodGroup} onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })} className="p-3 rounded-lg border" />
                    </div>
                    <input placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="p-3 rounded-lg border w-full" />
                    <input placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="p-3 rounded-lg border w-full" />
                    <textarea placeholder="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="p-3 rounded-lg border w-full" />
                    <div className="flex gap-2">
                      <button type="submit" className="px-4 py-2 rounded bg-gradient-to-r from-indigo-600 to-blue-500 text-white">Save</button>
                      <button type="button" onClick={() => setLeftTab('menu')} className="px-4 py-2 rounded border">Back</button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB: appointments */}
              {leftTab === 'appointments' && (
                <div>
                  <h3 className="text-lg font-semibold text-indigo-700 mb-4">Previous Appointments</h3>
                  <div className="space-y-3">
                    {appointments.length === 0 && <div className="p-4 bg-white/50 rounded">No previous appointments</div>}
                    {appointments.map((a) => (
                      <motion.div key={a.id} whileHover={{ scale: 1.01 }} className="p-4 bg-white rounded-lg shadow flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-indigo-700">{a.doctor} • {a.dept}</div>
                          <div className="text-sm text-gray-600">{a.date} • Mode: {a.mode}</div>
                          <div className="text-sm mt-2">{a.notes}</div>
                        </div>
                        <div className="text-right">
                          <button onClick={() => alert(`Viewing details for ${a.doctor} (mock)\n\nNotes: ${a.notes}`)} className="px-3 py-2 rounded border">View</button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: book */}
              {leftTab === 'book' && (
                <div>
                  <h3 className="text-lg font-semibold text-indigo-700 mb-4">Book Appointment</h3>
                  <form onSubmit={submitBooking} className="space-y-3 bg-white/50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input placeholder="Your name" value={bookingData.name} onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })} className="p-2 rounded border" />
                      <input placeholder="Phone" value={bookingData.phone} onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })} className="p-2 rounded border" />
                      <input placeholder="Email" value={bookingData.email} onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })} className="p-2 rounded border" />
                      <select value={bookingData.doctorId} onChange={(e) => setBookingData({ ...bookingData, doctorId: e.target.value })} className="p-2 rounded border">
                        <option value="">Select Doctor</option>
                        {doctors.map((d) => <option key={d.id} value={d.id}>{d.name} — {d.dept}</option>)}
                      </select>
                    </div>

                    <textarea placeholder="Describe your problem / symptoms" value={bookingData.symptoms} onChange={(e) => setBookingData({ ...bookingData, symptoms: e.target.value })} className="p-2 rounded border w-full" />

                    <div className="flex gap-2 items-center">
                      <label className="text-sm mr-2">Mode</label>
                      <select value={bookingData.mode} onChange={(e) => setBookingData({ ...bookingData, mode: e.target.value })} className="p-2 rounded border">
                        <option>Video</option>
                        <option>Voice</option>
                        <option>Chat</option>
                      </select>

                      <input type="date" value={bookingData.date} onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })} className="p-2 rounded border ml-4" />
                    </div>

                    <div className="flex gap-2">
                      <button type="submit" className="px-4 py-2 rounded bg-gradient-to-r from-indigo-600 to-blue-500 text-white">Book</button>
                      <button type="button" onClick={() => setLeftTab('menu')} className="px-3 py-2 rounded border">Cancel</button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB: reports */}
              {leftTab === 'reports' && (
                <div>
                  <h3 className="text-lg font-semibold text-indigo-700 mb-4">My Reports</h3>
                  <div className="space-y-3">
                    {reports.map((r) => (
                      <div key={r.id} className="p-3 bg-white rounded flex justify-between items-center">
                        <div>
                          <div className="font-medium">{r.title}</div>
                          <div className="text-xs text-gray-600">{r.doctor} • {r.date}</div>
                        </div>
                        <div className="flex gap-2 items-center">
                          <div className="font-semibold">₹{r.fee}</div>
                          <button onClick={() => openReport(r)} className="px-3 py-1 rounded bg-indigo-600 text-white">View</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: prescriptions */}
              {leftTab === 'prescriptions' && (
                <div>
                  <h3 className="text-lg font-semibold text-indigo-700 mb-4">Prescriptions</h3>
                  <div className="space-y-3">
                    {prescriptions.map((p) => (
                      <div key={p.id} className="p-3 bg-white rounded flex justify-between">
                        <div>
                          <div className="font-semibold">{p.by} • {p.date}</div>
                          <div className="text-sm text-gray-600">{p.summary}</div>
                        </div>
                        <div>
                          <button onClick={() => viewPrescription(p)} className="px-3 py-1 rounded bg-indigo-600 text-white">View</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: billing */}
              {leftTab === 'billing' && (
                <div>
                  <h3 className="text-lg font-semibold text-indigo-700 mb-4">Billing</h3>
                  <div className="space-y-3">
                    {bills.map((b) => (
                      <div key={b.id} className="p-3 bg-white rounded flex justify-between items-center">
                        <div>
                          <div className="font-medium">{b.title}</div>
                          <div className="text-xs text-gray-600">Due: {b.due}</div>
                        </div>
                        <div className="flex gap-2 items-center">
                          <div className="font-semibold">₹{b.amount}</div>
                          {!b.paid ? <button onClick={() => payBill(b.id)} className="px-3 py-1 rounded bg-gradient-to-r from-indigo-600 to-blue-500 text-white">Pay</button> : <div className="text-green-600 font-semibold">Paid</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: support */}
              {leftTab === 'support' && (
                <div>
                  <h3 className="text-lg font-semibold text-indigo-700 mb-4">Support</h3>
                  <SupportForm onSend={sendSupport} />
                </div>
              )}

              {/* default center when leftTab is 'menu' */}
              {leftTab === 'menu' && (
                <>
                  {/* Search */}
                  <div className="flex items-center gap-3 mb-6">
                    <input placeholder="Search doctor or specialty (e.g. Cardiology, Dermatology)" className="flex-1 p-3 rounded-lg border" />
                    <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 text-white flex items-center gap-2"><Search /> Search</button>
                  </div>

                  {/* Quick doctor cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {doctors.map((doc, idx) => (
                      <motion.div key={idx} whileHover={{ scale: 1.02 }} className="p-4 bg-white rounded-xl shadow border flex gap-4 items-center cursor-pointer">
                        <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
                          <Image src={doc.img} alt={doc.name} width={64} height={64} className="object-cover" />
                        </div>

                        <div className="flex-1">
                          <div className="font-semibold text-indigo-700">{doc.name}</div>
                          <div className="text-sm text-gray-600">{doc.dept} • {doc.city}</div>
                          <div className="text-sm font-medium mt-1">{doc.price}</div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <button onClick={() => { setSelectedDoctor(doc); }} className="px-3 py-2 rounded-md bg-indigo-50 text-indigo-700">Details</button>
                          <button onClick={() => openVideoCall(doc)} className="px-3 py-2 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center gap-2"><Video className="w-4 h-4" /> Call</button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Extended info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-indigo-700">All details & info</h3>
                    <p className="text-gray-700">
                      See doctor experience, patient reviews, availability, and clinic addresses. Click a doctor's card to view booking options, call assistant, or open a video session.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="p-4 bg-white rounded-lg shadow">Insurance accepted • Teleconsults available</div>
                      <div className="p-4 bg-white rounded-lg shadow">Average wait time • 10-15 mins</div>
                      <div className="p-4 bg-white rounded-lg shadow">Languages: English, Hindi</div>
                    </div>
                  </div>
                </>
              )}
            </main>

            {/* RIGHT sidebar - FIXED height + internal scroll to prevent overflow */}
            <aside className="col-span-12 md:col-span-3">
              <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 h-[70vh] overflow-auto sticky top-6">
                <h3 className="text-white font-semibold mb-4">🏅 Awarded Doctors</h3>

                <motion.div animate={{ y: ['0%', '-100%'] }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }} className="space-y-4">
                  {awardedDoctors.concat(awardedDoctors).map((doc, i) => (
                    <div key={i} className="flex gap-3 items-center bg-white/5 p-3 rounded-lg text-white">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                        <Image src={doc.img} alt={doc.name} width={48} height={48} className="object-cover" />
                      </div>
                      <div>
                        <div className="font-semibold">{doc.name}</div>
                        <div className="text-xs">{doc.dept}</div>
                        <div className="text-xs text-indigo-200">{doc.award}</div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </aside>
          </div>
        )}
      </div>

      {/* Floating Chat Button */}
      <motion.button whileHover={{ scale: 1.08 }} onClick={() => setShowChat(true)} className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-4 rounded-full shadow-xl">
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {showChat && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} className="fixed bottom-20 right-6 w-80 sm:w-96 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-indigo-100 flex flex-col overflow-hidden z-50">
            <div className="flex justify-between items-center bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-4 py-3">
              <p className="font-semibold flex items-center gap-2"><Stethoscope className="w-4 h-4" /> Dr. AI Assistant</p>
              <button onClick={() => setShowChat(false)}><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 max-h-96 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`p-3 rounded-xl max-w-[80%] ${m.sender === 'ai' ? 'bg-indigo-100 text-gray-800 self-start' : 'bg-indigo-600 text-white self-end ml-auto'}`}>
                  {m.text}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="flex p-3 border-t border-gray-200">
              <input value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Type your symptoms..." className="flex-1 p-2 rounded-lg border border-gray-300 outline-none" />
              <button onClick={sendMessage} className="ml-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-2 rounded-lg"><Send className="w-4 h-4" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Doctor detail modal */}
      <AnimatePresence>
        {selectedDoctor && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <motion.div initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 10 }} className="bg-white rounded-3xl p-6 w-[540px] shadow-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-indigo-700">{selectedDoctor.name}</h2>
                  <div className="text-sm text-gray-600">{selectedDoctor.dept} • {selectedDoctor.city}</div>
                </div>
                <button onClick={() => setSelectedDoctor(null)}><X className="w-6 h-6" /></button>
              </div>

              <p className="text-gray-700 mt-4">Consultation Fee: <span className="font-semibold">{selectedDoctor.price}</span></p>

              <div className="flex gap-3 mt-6">
                <button onClick={() => bookDoctor(selectedDoctor)} className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 text-white">Book Appointment</button>
                <button onClick={() => openVideoCall(selectedDoctor)} className="px-4 py-2 rounded-md bg-indigo-100 text-indigo-700 flex items-center gap-2"><Video className="w-4 h-4" /> Call Assistant</button>
                <button onClick={() => setSelectedDoctor(null)} className="px-4 py-2 rounded-md border">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video call mock */}
      <AnimatePresence>
        {videoCallOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-60 flex items-center justify-center bg-black/50">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-[90%] max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
                <div className="flex items-center gap-3">
                  <Video className="w-5 h-5" />
                  <div>
                    <div className="font-semibold">Video Consultation</div>
                    <div className="text-xs opacity-80">{selectedDoctor ? selectedDoctor.name : 'Dr. Assistant'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setVideoMuted((s) => !s)} className={`p-2 rounded-md ${videoMuted ? 'bg-white/20' : 'bg-white/10'}`}><Mic className="w-4 h-4" /></button>
                  <button onClick={() => setVideoCameraOff((s) => !s)} className={`p-2 rounded-md ${videoCameraOff ? 'bg-white/20' : 'bg-white/10'}`}><Stethoscope className="w-4 h-4" /></button>
                  <button onClick={hangupCall} className="ml-2 px-3 py-2 rounded-md bg-red-500">Hang Up</button>
                </div>
              </div>

              <div className="p-4 grid grid-cols-3 gap-4">
                {/* Big "video" area */}
                <div className="col-span-2 bg-black rounded-lg h-80 flex items-center justify-center text-white">
                  {!videoCameraOff ? (
                    <div className="text-center">
                      <div className="text-sm opacity-70">Live Video Feed (mock)</div>
                      <div className="text-lg font-semibold mt-2">{selectedDoctor ? selectedDoctor.name : 'Dr. Assistant'}</div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-300">Camera turned off</div>
                  )}
                </div>

                {/* Right column: participants & quick actions */}
                <div className="flex flex-col gap-3">
                  <div className="bg-white rounded-lg p-3 shadow">
                    <div className="font-semibold mb-2">Participants</div>
                    <ul className="space-y-2 text-sm">
                      {videoParticipants.map((p, i) => (
                        <li key={i} className="flex items-center justify-between">
                          <span>{p}</span>
                          <span className="text-xs text-gray-500">{p === 'You' ? (videoMuted ? 'muted' : 'unmuted') : 'online'}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-3 shadow flex-1">
                    <div className="font-semibold mb-2">Quick Notes</div>
                    <textarea placeholder="Take notes during consultation..." className="w-full h-32 p-2 border rounded-md outline-none" />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Support subcomponent */
function SupportForm({ onSend }) {
  const [msg, setMsg] = useState('');
  const [contact, setContact] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!msg) return alert('Please write an issue.');
        onSend(msg, contact);
        setMsg('');
        setContact('');
      }}
      className="space-y-3"
    >
      <textarea value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Describe the issue..." className="w-full p-3 rounded border" />
      <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Your contact (email/phone)" className="w-full p-3 rounded border" />
      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 rounded bg-gradient-to-r from-indigo-600 to-blue-500 text-white">Send to Kshitiz</button>
      </div>
    </form>
  );
}
