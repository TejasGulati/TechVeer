'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import DailyIframe from '@daily-co/daily-js';

export default function ConsultationRoom() {
  const params = useParams();
  const searchParams = useSearchParams();
  const role = searchParams.get('role');
  
  const [callFrame, setCallFrame] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [transcript, setTranscript] = useState([]);
  const [insights, setInsights] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

  const videoRef = useRef(null);
  const intervalRef = useRef(null);

  // Initialize Daily.co call frame
  useEffect(() => {
    if (!videoRef.current || callFrame) return;

    const call = DailyIframe.createFrame(videoRef.current, {
      showLeaveButton: true,
      iframeStyle: {
        width: '100%',
        height: '600px',
        border: '0',
        borderRadius: '12px',
      },
    });

    // ✅ Fixed URL
    call.join({ url: `https://your-daily-domain.daily.co/${params.roomId}` });
    setCallFrame(call);

    call.on('track-started', async (event) => {
      if (event.track.kind === 'audio') {
        startTranscription(event.track);
      }
    });

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      call.destroy();
    };
  }, [params.roomId]);

  // Handle audio transcription
  const startTranscription = async (audioTrack) => {
    setIsRecording(true);
    const mediaRecorder = new MediaRecorder(new MediaStream([audioTrack]));

    mediaRecorder.ondataavailable = async (event) => {
      const audioBlob = event.data;
      const formData = new FormData();
      formData.append('audio', audioBlob);

      try {
        const res = await fetch('/api/transcribe', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        setTranscript((prev) => [...prev, data.text]);
        setInsights((prev) => [...prev, ...data.insights]);
      } catch (error) {
        console.error('Transcription error:', error);
      }
    };

    mediaRecorder.start();
    intervalRef.current = setInterval(() => {
      if (mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        mediaRecorder.start();
      }
    }, 5000);
  };

  // Handle chat message
  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMsg = { sender: role, text: input, timestamp: Date.now() };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');

    await fetch('/api/save-consultation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId: params.roomId, message: newMsg }),
    });
  };

  // End consultation and save data
  const endConsultation = async () => {
    await fetch('/api/save-consultation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomId: params.roomId,
        transcript,
        insights,
        messages,
        endTime: Date.now(),
      }),
    });

    if (callFrame) callFrame.leave();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-indigo-600">Consultation Room</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Room: {params.roomId}</span>
              <span className="text-sm font-medium text-teal-600">Role: {role}</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div ref={videoRef} className="bg-black rounded-xl overflow-hidden"></div>

              <button
                onClick={endConsultation}
                className="w-full bg-red-600 text-white p-3 rounded-lg font-bold hover:bg-red-700"
              >
                End Consultation
              </button>
            </div>

            <div className="space-y-4">
              {/* Chat Box */}
              <div className="bg-indigo-50 rounded-xl p-4">
                <h3 className="font-bold text-indigo-800 mb-2 flex items-center gap-2">
                  💬 Chat
                  <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">Encrypted</span>
                </h3>
                <div className="h-48 overflow-y-auto mb-2 space-y-2">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded ${msg.sender === role ? 'bg-indigo-200' : 'bg-gray-200'}`}
                    >
                      <span className="text-xs font-bold">{msg.sender}:</span>
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1 p-2 border rounded-lg text-sm"
                    placeholder="Type message..."
                  />
                  <button
                    onClick={sendMessage}
                    className="bg-indigo-600 text-white px-4 rounded-lg hover:bg-indigo-700"
                  >
                    Send
                  </button>
                </div>
              </div>

              {/* Live Transcription */}
              <div className="bg-teal-50 rounded-xl p-4">
                <h3 className="font-bold text-teal-800 mb-2 flex items-center gap-2">
                  📝 Live Transcription
                  {isRecording && (
                    <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full animate-pulse">
                      REC
                    </span>
                  )}
                </h3>
                <div className="h-48 overflow-y-auto space-y-1">
                  {transcript.map((text, i) => (
                    <p key={i} className="text-sm text-gray-700 border-b border-teal-200 pb-1">
                      {text}
                    </p>
                  ))}
                </div>
              </div>

              {/* AI Insights */}
              <div className="bg-green-50 rounded-xl p-4">
                <h3 className="font-bold text-green-800 mb-2">🤖 AI Health Insights</h3>
                <div className="h-32 overflow-y-auto space-y-1">
                  {insights.map((insight, i) => (
                    <div key={i} className="text-xs bg-white p-2 rounded border border-green-200">
                      {insight}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
