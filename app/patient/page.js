'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Stethoscope, MessageCircle, Send, X, Lock, HeartPulse } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function PatientPortal() {
  const router = useRouter();

  const [isRegistered, setIsRegistered] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    phone: '',
    specialty: '',
    symptoms: ''
  });
  const [loading, setLoading] = useState(false);
  const [showDoctors, setShowDoctors] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: '👋 Hello! I’m Dr. AI. Please describe your symptoms.' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const chatEndRef = useRef(null);

  const specialties = ['Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 'General Medicine'];

  const dummyDoctors = [
    { name: 'Dr. A. Mehta', department: 'Cardiology', fees: '₹800', clinic: 'City Heart Care, Delhi' },
    { name: 'Dr. R. Gupta', department: 'Dermatology', fees: '₹500', clinic: 'Skin Glow Clinic, Mumbai' },
    { name: 'Dr. K. Sharma', department: 'Neurology', fees: '₹1000', clinic: 'Brain Health Center, Pune' },
    { name: 'Dr. S. Verma', department: 'Pediatrics', fees: '₹600', clinic: 'Little Stars Clinic, Bangalore' },
    { name: 'Dr. T. Iyer', department: 'General Medicine', fees: '₹400', clinic: 'Medico Life, Chennai' }
  ];

  const handleSendOTP = () => {
    if (!formData.email || !formData.phone) return alert('Please fill email and phone first.');
    setOtpSent(true);
    setTimeout(() => alert('Demo OTP sent: 1234'), 300);
  };

  const handleVerifyOTP = () => {
    if (otp === '1234') {
      setIsRegistered(true);
      alert('✅ Login successful!');
    } else alert('❌ Invalid OTP');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const paymentRes = await fetch('/api/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 5000, ...formData })
    });
    const { sessionId } = await paymentRes.json();
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (!error) {
      const roomRes = await fetch('/api/create-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const { roomId } = await roomRes.json();
      router.push(`/consultation/${roomId}?role=patient`);
    }
    setLoading(false);
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;
    const newMsg = { sender: 'user', text: inputMessage };
    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');
    setTimeout(() => {
      const reply = {
        sender: 'ai',
        text: `Hmm... "${newMsg.text}" sounds important. You may want to consult a ${
          formData.specialty || 'General Physician'
        }.`
      };
      setMessages((prev) => [...prev, reply]);
    }, 800);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filteredDoctors = formData.specialty
    ? dummyDoctors.filter((doc) => doc.department === formData.specialty)
    : dummyDoctors;

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-indigo-50 via-blue-100 to-white flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Floating animated orbs */}
      <motion.div
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-10 left-16 w-56 h-56 bg-indigo-200/40 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 40, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-10 right-20 w-72 h-72 bg-blue-200/40 rounded-full blur-3xl"
      />

      <div className="max-w-2xl w-full relative z-10">
        {/* OTP login */}
        {!isRegistered ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-indigo-100"
          >
            <Lock className="w-10 h-10 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-indigo-700 text-center mb-2">Patient Login</h2>
            <p className="text-center text-gray-600 mb-6">Login securely using OTP verification</p>

            <div className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-4 focus:ring-indigo-300 outline-none"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <input
                type="tel"
                placeholder="Enter your phone number"
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-4 focus:ring-indigo-300 outline-none"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              {!otpSent ? (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  onClick={handleSendOTP}
                  className="w-full justify-center bg-blue-400 text-black py-3 rounded-xl font-semibold shadow-md hover:shadow-lg"
                >
                  Send OTP
                </motion.button>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Enter OTP (try 1234)"
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-4 focus:ring-indigo-300 outline-none"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    onClick={handleVerifyOTP}
                    className="w-full bg-blue-400 justify-center text-black py-3 rounded-xl font-semibold shadow-md hover:shadow-lg"
                  >
                    Verify & Continue
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        ) : (
          // Consultation Form
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-indigo-100"
          >
            <h1 className="text-4xl font-extrabold text-indigo-700 mb-6 flex items-center gap-2">
              <Stethoscope className="w-8 h-8 text-indigo-600" /> Patient Portal
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-gray-700">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full p-3 mt-1 rounded-lg border border-gray-300 focus:ring-4 focus:ring-indigo-300 outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Age</label>
                  <input
                    type="number"
                    required
                    className="w-full p-3 mt-1 rounded-lg border border-gray-300 focus:ring-4 focus:ring-indigo-300 outline-none"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Phone</label>
                  <input
                    type="tel"
                    required
                    className="w-full p-3 mt-1 rounded-lg border border-gray-300 focus:ring-4 focus:ring-indigo-300 outline-none"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  className="w-full p-3 mt-1 rounded-lg border border-gray-300 focus:ring-4 focus:ring-indigo-300 outline-none"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">Specialty</label>
                <select
                  required
                  className="w-full p-3 mt-1 rounded-lg border border-gray-300 focus:ring-4 focus:ring-indigo-300 outline-none"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                >
                  <option value="">Select Specialty</option>
                  {specialties.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">Symptoms</label>
                <textarea
                  rows="4"
                  required
                  className="w-full p-3 mt-1 rounded-lg border border-gray-300 focus:ring-4 focus:ring-indigo-300 outline-none"
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                />
              </div>

              <div className="flex justify-between items-center bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
                <p className="text-sm text-indigo-700">Consultation Fee: ₹500</p>
                <button
                  type="button"
                  onClick={() => setShowDoctors(!showDoctors)}
                  className="flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-800 transition"
                >
                  <Search className="w-4 h-4" /> Search Doctors
                </button>
              </div>

              <AnimatePresence>
                {showDoctors && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 bg-white border border-gray-200 rounded-xl shadow-md p-4 space-y-3"
                  >
                    {filteredDoctors.map((doc, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50 hover:shadow-lg transition-all"
                      >
                        <p className="font-semibold text-indigo-800">{doc.name}</p>
                        <p className="text-sm text-gray-600">{doc.department}</p>
                        <p className="text-sm text-gray-600">{doc.clinic}</p>
                        <p className="text-sm font-medium text-indigo-700">{doc.fees}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.03 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:bg-gray-400"
              >
                {loading ? 'Processing...' : 'Proceed to Payment'}
              </motion.button>
            </form>
          </motion.div>
        )}
      </div>

      {/* Floating Chat */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        onClick={() => setShowChat(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-20 right-6 w-80 sm:w-96 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-indigo-100 flex flex-col overflow-hidden"
          >
            <div className="flex justify-between items-center bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-4 py-3">
              <p className="font-semibold flex items-center gap-1">
                <HeartPulse className="w-4 h-4" /> Dr. AI Assistant
              </p>
              <button onClick={() => setShowChat(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 max-h-96 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl max-w-[80%] ${
                    msg.sender === 'ai'
                      ? 'bg-indigo-100 text-gray-800 self-start'
                      : 'bg-indigo-600 text-white self-end ml-auto'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="flex p-3 border-t border-gray-200">
              <input
                type="text"
                placeholder="Type your symptoms..."
                className="flex-1 p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="ml-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-2 rounded-lg hover:shadow-lg"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
