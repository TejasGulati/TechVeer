'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Stethoscope, User, Shield, Sparkles, Mic, Brain } from 'lucide-react';

export default function Home() {
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
          Empowering Healthcare with <span className="text-indigo-600 font-semibold">AI-driven</span> Consultations Anywhere 🌍
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

        {/* Novel Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
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