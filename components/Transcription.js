'use client';
import { useState, useEffect, useRef } from 'react';

export default function Transcription({ audioTrack, roomId }) {
  const [transcript, setTranscript] = useState([]);
  const [insights, setInsights] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const transcriptEndRef = useRef(null);

  useEffect(() => {
    if (audioTrack) {
      startTranscription();
    }
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, [audioTrack]);

  const startTranscription = async () => {
    if (!audioTrack) return;

    try {
      const stream = new MediaStream([audioTrack]);
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);

      mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          await processAudio(event.data);
        }
      };

      mediaRecorder.start();
      
      setInterval(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
          mediaRecorder.start();
        }
      }, 5000);

    } catch (error) {
      console.error('Transcription error:', error);
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('roomId', roomId);

    try {
      const res = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      
      if (data.text) {
        setTranscript(prev => [...prev, {
          text: data.text,
          timestamp: new Date().toISOString()
        }]);
      }

      if (data.insights && data.insights.length > 0) {
        setInsights(prev => [...prev, ...data.insights]);
      }

      transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Processing error:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-teal-50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-teal-800 flex items-center gap-2">
            📝 Live Transcription
          </h3>
          {isRecording && (
            <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full animate-pulse flex items-center gap-1">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              REC
            </span>
          )}
        </div>

        <div className="h-48 overflow-y-auto space-y-2 bg-white rounded-lg p-3">
          {transcript.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              {isRecording ? 'Listening...' : 'Waiting for audio'}
            </p>
          ) : (
            transcript.map((item, i) => (
              <div key={i} className="text-sm text-gray-700 border-b border-teal-100 pb-2">
                <p className="leading-relaxed">{item.text}</p>
                <span className="text-xs text-gray-400">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
          <div ref={transcriptEndRef} />
        </div>
      </div>

      <div className="bg-green-50 rounded-xl p-4">
        <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
          🤖 AI Health Insights
          <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
            Real-time
          </span>
        </h3>
        
        <div className="h-40 overflow-y-auto space-y-2">
          {insights.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              AI is analyzing the conversation...
            </p>
          ) : (
            insights.map((insight, i) => (
              <div
                key={i}
                className="text-xs bg-white p-3 rounded-lg border border-green-200 shadow-sm"
              >
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span className="flex-1 text-gray-700">{insight}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}