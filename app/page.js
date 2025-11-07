'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Stethoscope, User, Shield, Sparkles, Mic, Brain, Languages, Send, Cpu, Zap, HeartPulse, Globe2 } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [selectedLang, setSelectedLang] = useState('Hindi');
  const [outputText, setOutputText] = useState('');

  const handleTranslate = () => {
    if (!inputText.trim()) return alert('Please enter your prescription text');
    setTimeout(() => {
      setOutputText(`🩺 Prescription translated to ${selectedLang}:\n\n"${inputText}" (AI translation simulated)`);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-200 to-purple-200 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl w-full bg-white/40 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/30"
      >
        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-6xl font-extrabold text-center text-indigo-700 mb-4 drop-shadow-md"
        >
          TechVeers Telehealth
        </motion.h1>

        <p className="text-center text-gray-700 text-lg mb-10">
          Empowering Healthcare with{' '}
          <span className="text-indigo-600 font-semibold">AI-driven</span> Consultations Anywhere 🌍
        </p>

        {/* Portal Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          <Link href="/patient">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="relative bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-10 rounded-2xl cursor-pointer shadow-xl overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-30 transition-all duration-500"></div>
              <User className="w-10 h-10 mb-3" />
              <h2 className="text-3xl font-bold mb-2">Patient Portal</h2>
              <p className="text-white/90">Book your consultation with top specialists</p>
              <span className="absolute right-6 bottom-6 text-sm italic text-white/80">Get Started →</span>
            </motion.div>
          </Link>

          <Link href="/doctor">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="relative bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-10 rounded-2xl cursor-pointer shadow-xl overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-30 transition-all duration-500"></div>
              <Stethoscope className="w-10 h-10 mb-3" />
              <h2 className="text-3xl font-bold mb-2">Doctor Portal</h2>
              <p className="text-white/90">Manage appointments and connect with patients</p>
              <span className="absolute right-6 bottom-6 text-sm italic text-white/80">Login →</span>
            </motion.div>
          </Link>
        </div>

        {/* 🌐 AI Prescription Language Converter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-12 p-8 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 rounded-3xl border border-indigo-200 shadow-lg"
        >
          <h3 className="font-bold text-indigo-800 text-2xl mb-4 flex items-center gap-2">
            <Languages className="w-6 h-6 text-indigo-600" /> AI Prescription Language Converter
          </h3>

          <p className="text-gray-700 mb-6">
            Convert your prescriptions instantly into any preferred language using AI for multilingual patients. 🌎
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <textarea
              placeholder="🩺 Paste your prescription text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-40 p-4 rounded-xl border border-indigo-200 bg-white/70 outline-none focus:ring-4 focus:ring-indigo-300"
            />
            <div className="flex flex-col gap-4">
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="p-3 border rounded-xl bg-white/80 focus:ring-4 focus:ring-indigo-200"
              >
                {['Hindi', 'Spanish', 'French', 'German', 'Tamil', 'Bengali', 'Arabic'].map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleTranslate}
                className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" /> Convert Prescription
              </motion.button>

              {outputText && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-4 rounded-xl bg-white border border-indigo-200 shadow-sm text-gray-800 whitespace-pre-wrap"
                >
                  {outputText}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* 💡 Why TechVeers Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-14 bg-gradient-to-br from-white/60 to-indigo-100 backdrop-blur-xl border border-white/40 p-10 rounded-3xl shadow-xl relative overflow-hidden"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-indigo-300 via-purple-300 to-transparent opacity-30 rounded-full blur-3xl"
          ></motion.div>

          <h2 className="text-4xl font-extrabold text-center text-indigo-800 mb-8 drop-shadow-md">
            Why Choose <span className="text-blue-600">TechVeers Telehealth</span>?
          </h2>

          <div className="grid md:grid-cols-2 gap-8 relative z-10">
            {[
              {
                icon: <Cpu className="w-8 h-8 text-indigo-600" />,
                title: 'AI-Powered Efficiency',
                desc: 'Smart algorithms that assist in diagnosis, prescriptions, and patient follow-ups with unmatched accuracy.',
              },
              {
                icon: <HeartPulse className="w-8 h-8 text-pink-500" />,
                title: 'Personalized Care',
                desc: 'Every patient receives unique recommendations using AI-driven health analytics and smart reminders.',
              },
              {
                icon: <Globe2 className="w-8 h-8 text-blue-500" />,
                title: 'Global Accessibility',
                desc: 'Connect instantly with specialists from anywhere, anytime — healthcare without borders.',
              },
              {
                icon: <Zap className="w-8 h-8 text-yellow-500" />,
                title: 'Lightning-Fast Consultations',
                desc: 'No waiting rooms, no delays. Get connected to verified doctors within minutes.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="p-6 bg-white/70 rounded-2xl border border-indigo-100 shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="mb-3">{feature.icon}</div>
                <h4 className="text-xl font-bold text-indigo-700 mb-2">{feature.title}</h4>
                <p className="text-gray-700">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Novel Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-10 p-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl border border-indigo-200 shadow-inner"
        >
          <h3 className="font-bold text-indigo-800 text-xl mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" /> Novel Features
          </h3>
          <ul className="space-y-2 text-indigo-800 text-md">
            <li className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-blue-500" /> Real-time accent normalization for clearer calls
            </li>
            <li className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" /> AI-powered health insights extraction
            </li>
            <li className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" /> End-to-end encrypted PHI data security
            </li>
            <li className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-teal-500" /> Live medical transcription with key-term highlighting
            </li>
          </ul>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-10">
          © {new Date().getFullYear()} <span className="font-semibold text-indigo-600">TechVeers</span>. All Rights Reserved.
        </p>
      </motion.div>
    </div>
  );
}
