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
  TrendingUp,
  Video,
  Phone,
  Calendar,
  Clock,
  Stethoscope,
  CheckCircle,
  Mail,
} from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DoctorPortal() {
  const router = useRouter();

  // 🔐 LOGIN STATES
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [formData, setFormData] = useState({ email: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleSendOTP = () => {
    if (!formData.email || !formData.phone) {
      alert('Please enter both email and phone number.');
      return;
    }
    setOtpSent(true);
    setTimeout(() => alert('Demo OTP sent: 1234'), 600);
  };

  const handleVerifyOTP = () => {
    if (otp === '1234') {
      setLoading(true);
      setTimeout(() => {
        setIsLoggedIn(true);
        setLoading(false);
      }, 800);
    } else {
      alert('❌ Invalid OTP');
    }
  };

  // 📊 DASHBOARD STATES
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
  const [nextSchedule] = useState([
    { id: 'S-001', name: 'Rahul Mehra', time: '10:00 AM', type: 'Video', issue: 'Migraine headache' },
    { id: 'S-002', name: 'Anjali Singh', time: '10:45 AM', type: 'Audio', issue: 'Fatigue & nausea' },
    { id: 'S-003', name: 'Vikas Yadav', time: '11:30 AM', type: 'Chat', issue: 'Cough & fever' },
  ]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [prescText, setPrescText] = useState('');
  const [prescPatient, setPrescPatient] = useState('');
  const [availability, setAvailability] = useState({
    Monday: { morning: true, afternoon: false, evening: true },
    Tuesday: { morning: false, afternoon: true, evening: true },
    Wednesday: { morning: true, afternoon: true, evening: false },
    Thursday: { morning: false, afternoon: false, evening: true },
    Friday: { morning: true, afternoon: false, evening: false },
  });

  const fileInputRefs = useRef({});

  const handleJoin = () => {
    if (!roomId) return alert('Please enter Room ID');
    router.push(`/consultation/${roomId}?role=doctor`);
  };

  const handleAccept = (id) =>
    setNewPatients((p) => p.map((x) => (x.id === id ? { ...x, accepted: true } : x)));

  const handleReject = (id) =>
    setNewPatients((p) => p.map((x) => (x.id === id ? { ...x, accepted: false } : x)));

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

  const handleScheduleJoin = (s) => alert(`Joining ${s.type} consultation with ${s.name}`);

  const handlePrescriptionSubmit = () => {
    if (!prescPatient || !prescText.trim())
      return alert('Select a patient and write a prescription.');
    setPrescriptions((p) => [...p, { id: Date.now(), patient: prescPatient, text: prescText }]);
    setPrescText('');
    setPrescPatient('');
    alert('Prescription added ✅');
  };

  const toggleAvailability = (day, slot) => {
    setAvailability((a) => ({
      ...a,
      [day]: { ...a[day], [slot]: !a[day][slot] },
    }));
  };

  const chartData = useMemo(
    () => ({
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Patients',
          data: monthlyRecords,
          backgroundColor: 'rgba(20,184,166,0.8)',
          borderRadius: 6,
        },
        {
          label: 'Target',
          data: new Array(12).fill(monthlyTarget),
          backgroundColor: 'rgba(56,189,248,0.3)',
          borderRadius: 6,
        },
      ],
    }),
    [monthlyRecords, monthlyTarget]
  );

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: true, position: 'bottom' } },
    scales: { y: { beginAtZero: true }, x: { grid: { display: false } } },
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
    <AnimatePresence>
      {!isLoggedIn ? (
        // 🔐 LOGIN SCREEN
        <motion.div
          key="login"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-400 via-teal-400 to-green-400 overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.3),transparent_50%),radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.2),transparent_50%)] blur-3xl"
            animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-emerald-100"
          >
            <div className="text-center mb-6">
              <Stethoscope className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
              <h1 className="text-3xl font-bold text-emerald-700">Doctor Login</h1>
              <p className="text-gray-600">Access your TechVeer Dashboard</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 p-3 rounded-lg border border-gray-300 focus:ring-4 focus:ring-emerald-300 outline-none"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  className="w-full pl-10 p-3 rounded-lg border border-gray-300 focus:ring-4 focus:ring-emerald-300 outline-none"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              {!otpSent ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSendOTP}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-xl transition"
                >
                  Send OTP
                </motion.button>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Enter OTP (try 1234)"
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-4 focus:ring-emerald-300 outline-none"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleVerifyOTP}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-xl transition disabled:opacity-70"
                  >
                    {loading ? 'Logging in...' : 'Verify & Continue'}
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : (
        // 💼 FULL DASHBOARD
        <motion.div
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 p-8 overflow-hidden"
        >
          <div className="max-w-7xl mx-auto space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
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
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {statCard(<Users className="w-6 h-6" />, 'Total Patients', monthlyRecords.reduce((a, b) => a + b, 0), 'teal')}
              {statCard(<Activity className="w-6 h-6" />, 'Open Requests', newPatients.filter((n) => n.accepted === null).length, 'cyan')}
              {statCard(<TrendingUp className="w-6 h-6" />, 'Accepted Today', newPatients.filter((n) => n.accepted === true).length, 'emerald')}
            </div>

            {/* Chart + Patients */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Chart */}
              <div className="bg-gradient-to-br from-cyan-50 to-white rounded-3xl p-6 shadow-xl border border-cyan-100">
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
              </div>

              {/* New Patients */}
              <div className="bg-gradient-to-br from-teal-50 to-white rounded-3xl p-6 shadow-xl border border-teal-100">
                <h2 className="text-lg font-bold text-teal-800 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" /> New Patients
                </h2>
                {newPatients.map((p) => (
                  <div key={p.id} className="p-4 rounded-2xl mb-3 bg-white border shadow-sm hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-teal-700">{p.name}</p>
                        <p className="text-sm text-gray-600">{p.age} • {p.specialty}</p>
                        <p className="text-xs text-gray-500 mt-1">{p.time}</p>
                        <p className="text-sm mt-2 text-gray-700">{p.symptoms}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button onClick={() => handleAccept(p.id)} disabled={p.accepted === true} className="px-3 py-1 text-sm rounded-md text-white bg-emerald-600 hover:bg-emerald-700">
                          Accept
                        </button>
                        <button onClick={() => handleReject(p.id)} disabled={p.accepted === false} className="px-3 py-1 text-sm rounded-md bg-white border hover:bg-gray-50">
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Past Patients */}
              <div className="bg-gradient-to-br from-emerald-50 to-white rounded-3xl p-6 shadow-xl border border-emerald-100">
                <h2 className="text-lg font-bold text-emerald-800 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Past Patients
                </h2>
                {pastPatients.map((p) => (
                  <div key={p.id} className="p-4 mb-3 bg-white rounded-2xl border flex justify-between items-center shadow-sm hover:shadow-md transition">
                    <div>
                      <p className="font-semibold text-emerald-700">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${p.payment === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-800'}`}>
                        {p.payment}
                      </span>
                      <input ref={(el) => (fileInputRefs.current[p.id] = el)} onChange={(e) => handleFileChange(e, p.id)} type="file" className="hidden" />
                      <button onClick={() => handleUploadClick(p.id)} className="px-3 py-1 bg-white border rounded-lg text-sm flex items-center gap-2">
                        {uploadingFor === p.id ? <CloudUpload className="w-4 h-4 animate-bounce" /> : <CloudUpload className="w-4 h-4" />}
                        Upload
                      </button>
                      {p.reportUrl && (
                        <a href={p.reportUrl} target="_blank" rel="noreferrer" className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700">
                          View
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Schedule */}
            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-3xl shadow-xl border border-blue-100">
              <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" /> Next Schedule
              </h2>
              <div className="space-y-3">
                {nextSchedule.map((s) => (
                  <div key={s.id} className="p-4 bg-white rounded-2xl flex justify-between items-center shadow-sm border">
                    <div>
                      <div className="font-semibold text-blue-700">{s.name}</div>
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        <Clock className="w-4 h-4" /> {s.time} • {s.issue}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {s.type === 'Chat' ? (
                        <button onClick={() => handleScheduleJoin(s)} className="px-3 py-1 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700 flex items-center gap-1">
                          <Stethoscope className="w-4 h-4" /> Chat
                        </button>
                      ) : (
                        <button onClick={() => handleScheduleJoin(s)} className="px-3 py-1 rounded-md bg-gradient-to-r from-teal-600 to-cyan-500 text-white text-sm flex items-center gap-1">
                          {s.type === 'Video' ? <Video className="w-4 h-4" /> : <Phone className="w-4 h-4" />} {s.type}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prescriptions */}
            <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-3xl shadow-xl border border-emerald-100">
              <h2 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" /> Add Prescription (Chat Consults)
              </h2>
              <div className="flex flex-col md:flex-row gap-3 mb-3">
                <select value={prescPatient} onChange={(e) => setPrescPatient(e.target.value)} className="border p-3 rounded-lg flex-1">
                  <option value="">Select patient</option>
                  {nextSchedule.filter((n) => n.type === 'Chat').map((n) => (
                    <option key={n.id}>{n.name}</option>
                  ))}
                </select>
                <textarea placeholder="Write prescription..." value={prescText} onChange={(e) => setPrescText(e.target.value)} className="border p-3 rounded-lg flex-1" />
                <button onClick={handlePrescriptionSubmit} className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-5 py-3 rounded-xl hover:shadow-lg">
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {prescriptions.map((p) => (
                  <div key={p.id} className="p-3 bg-white rounded-xl border flex justify-between items-center">
                    <div>
                      <div className="font-medium text-emerald-700">{p.patient}</div>
                      <div className="text-sm text-gray-600">{p.text}</div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  </div>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-3xl shadow-xl border border-indigo-100 mb-10">
              <h2 className="text-xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" /> Set Availability
              </h2>
              <div className="space-y-3">
                {Object.entries(availability).map(([day, slots]) => (
                  <div key={day} className="flex items-center justify-between bg-white rounded-xl p-3 border shadow-sm">
                    <span className="font-semibold text-gray-800 w-32">{day}</span>
                    <div className="flex gap-3">
                      {Object.entries(slots).map(([slot, active]) => (
                        <button
                          key={slot}
                          onClick={() => toggleAvailability(day, slot)}
                          className={`px-3 py-1 rounded-md text-sm ${active ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-right">
                <button onClick={() => alert('Availability saved ✅')} className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-xl hover:shadow-md">
                  Save
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
