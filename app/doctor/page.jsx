'use client';

import React, { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {
  Activity,
  CloudUpload,
  FileText,
  Heart,
  Users,
  TrendingUp
} from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DoctorPortal() {
  const router = useRouter();
  const [roomId, setRoomId] = useState('');
  const [monthlyTarget, setMonthlyTarget] = useState(120);
  const [monthlyRecords] = useState([8, 10, 7, 12, 9, 11, 13, 10, 12, 14, 9, 11]);
  const [newPatients, setNewPatients] = useState([
    { id: 'N-001', name: 'Anita Sharma', age: 28, specialty: 'Dermatology', time: '2m ago', symptoms: 'Rash & itching', accepted: null },
    { id: 'N-002', name: 'Rakesh Patel', age: 52, specialty: 'Cardiology', time: '10m ago', symptoms: 'Chest discomfort', accepted: null }
  ]);
  const [pastPatients, setPastPatients] = useState([
    { id: 'P-101', name: 'Sunil Verma', date: '2025-09-12', payment: 'Paid', reportUrl: null },
    { id: 'P-102', name: 'Nisha Rao', date: '2025-09-06', payment: 'Pending', reportUrl: null }
  ]);
  const [uploadingFor, setUploadingFor] = useState(null);
  const fileInputRefs = useRef({});

  const handleJoin = () => {
    if (!roomId) return alert('Please enter Room ID');
    router.push(`/consultation/${roomId}?role=doctor`);
  };

  const handleAccept = (id) => {
    setNewPatients((p) => p.map((x) => (x.id === id ? { ...x, accepted: true } : x)));
  };

  const handleReject = (id) => {
    setNewPatients((p) => p.map((x) => (x.id === id ? { ...x, accepted: false } : x)));
  };

  const handleUploadClick = (id) => fileInputRefs.current[id]?.click();

  const handleFileChange = (e, id) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFor(id);
    setTimeout(() => {
      const url = URL.createObjectURL(file);
      setPastPatients((prev) =>
        prev.map((p) => (p.id === id ? { ...p, reportUrl: url } : p))
      );
      setUploadingFor(null);
    }, 1200);
  };

  const chartData = useMemo(
    () => ({
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Patients',
          data: monthlyRecords,
          backgroundColor: 'rgba(20,184,166,0.8)',
          borderRadius: 6
        },
        {
          label: 'Target',
          data: new Array(12).fill(monthlyTarget),
          backgroundColor: 'rgba(56,189,248,0.3)',
          borderRadius: 6
        }
      ]
    }),
    [monthlyRecords, monthlyTarget]
  );

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'bottom' }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: '#e0f2fe' } },
      x: { grid: { display: false } }
    }
  };

  const statCard = (icon, title, value, color) => (
    <motion.div
      whileHover={{ scale: 1.04 }}
      className={`flex items-center gap-4 bg-gradient-to-br from-${color}-50 to-white border border-${color}-200 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all`}
    >
      <div className={`p-3 rounded-xl bg-${color}-100 text-${color}-700`}>{icon}</div>
      <div>
        <h4 className="text-gray-600 text-sm">{title}</h4>
        <p className={`text-2xl font-bold text-${color}-700`}>{value}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 p-8 overflow-hidden">
      {/* Floating lights for depth */}
      <motion.div
        animate={{ y: [0, -40, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-10 left-20 w-64 h-64 bg-cyan-200/40 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 40, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-10 right-20 w-80 h-80 bg-emerald-200/50 rounded-full blur-3xl"
      />

      <div className="max-w-7xl mx-auto relative z-10 space-y-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <h1 className="text-4xl font-extrabold text-teal-700 flex items-center gap-2 drop-shadow-sm">
            <Heart className="w-8 h-8 text-teal-600" /> Doctor Dashboard
          </h1>
          <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md shadow-lg p-3 rounded-2xl border border-teal-100">
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter Room ID"
              className="px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-400"
            />
            <button
              onClick={handleJoin}
              className="bg-gradient-to-r from-teal-600 to-cyan-500 text-white px-4 py-2 rounded-xl hover:shadow-lg transition"
            >
              Join
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statCard(<Users className="w-6 h-6" />, 'Total Patients', monthlyRecords.reduce((a, b) => a + b, 0), 'teal')}
          {statCard(<Activity className="w-6 h-6" />, 'Open Requests', newPatients.filter(n => n.accepted === null).length, 'cyan')}
          {statCard(<TrendingUp className="w-6 h-6" />, 'Accepted Today', newPatients.filter(n => n.accepted === true).length, 'emerald')}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chart Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-cyan-50 to-white rounded-3xl p-6 shadow-xl border border-cyan-100"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold text-cyan-800 flex items-center gap-2">
                <Activity className="w-5 h-5" /> Monthly Patients
              </h2>
              <input
                type="number"
                value={monthlyTarget}
                onChange={(e) => setMonthlyTarget(e.target.value)}
                className="border px-2 py-1 rounded-md text-sm w-20"
              />
            </div>
            <div className="h-48">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </motion.div>

          {/* New Patients */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-teal-50 to-white rounded-3xl p-6 shadow-xl border border-teal-100"
          >
            <h2 className="text-lg font-bold text-teal-800 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" /> New Patients
            </h2>
            <AnimatePresence>
              {newPatients.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-4 rounded-2xl mb-3 bg-white border shadow-sm hover:shadow-md transition ${p.accepted === true ? 'opacity-70' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-teal-700">{p.name}</p>
                      <p className="text-sm text-gray-600">{p.age} • {p.specialty}</p>
                      <p className="text-xs text-gray-500 mt-1">{p.time}</p>
                      <p className="text-sm mt-2 text-gray-700">{p.symptoms}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleAccept(p.id)}
                        disabled={p.accepted === true}
                        className={`px-3 py-1 text-sm rounded-md text-white ${p.accepted === true ? 'bg-emerald-400' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(p.id)}
                        disabled={p.accepted === false}
                        className={`px-3 py-1 text-sm rounded-md ${p.accepted === false ? 'bg-red-200 text-red-700' : 'bg-white border hover:bg-gray-50'}`}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Past Patients */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-emerald-50 to-white rounded-3xl p-6 shadow-xl border border-emerald-100"
          >
            <h2 className="text-lg font-bold text-emerald-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" /> Past Patients
            </h2>
            {pastPatients.map((p) => (
              <div
                key={p.id}
                className="p-4 mb-3 bg-white rounded-2xl border flex justify-between items-center shadow-sm hover:shadow-md transition"
              >
                <div>
                  <p className="font-semibold text-emerald-700">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      p.payment === 'Paid'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {p.payment}
                  </span>
                  <input
                    ref={(el) => (fileInputRefs.current[p.id] = el)}
                    onChange={(e) => handleFileChange(e, p.id)}
                    type="file"
                    className="hidden"
                  />
                  <button
                    onClick={() => handleUploadClick(p.id)}
                    className="px-3 py-1 bg-white border rounded-lg text-sm flex items-center gap-2"
                  >
                    {uploadingFor === p.id ? (
                      <CloudUpload className="w-4 h-4 animate-bounce" />
                    ) : (
                      <CloudUpload className="w-4 h-4" />
                    )}
                    Upload
                  </button>
                  {p.reportUrl && (
                    <a
                      href={p.reportUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700"
                    >
                      View
                    </a>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
