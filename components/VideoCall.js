'use client';
import { useEffect, useRef } from 'react';
import DailyIframe from '@daily-co/daily-js';

export default function VideoCall({ roomUrl, onTrackStarted }) {
  const videoRef = useRef(null);
  const callRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current || !roomUrl) return;

    const callFrame = DailyIframe.createFrame(videoRef.current, {
      showLeaveButton: true,
      showFullscreenButton: true,
      iframeStyle: {
        width: '100%',
        height: '100%',
        border: '0',
        borderRadius: '12px'
      }
    });

    callFrame.join({ url: roomUrl });
    callRef.current = callFrame;

    callFrame.on('joined-meeting', () => {
      console.log('Joined meeting');
    });

    callFrame.on('track-started', (event) => {
      if (onTrackStarted) {
        onTrackStarted(event);
      }
    });

    callFrame.on('participant-joined', (event) => {
      console.log('Participant joined:', event.participant);
    });

    callFrame.on('error', (error) => {
      console.error('Daily.co error:', error);
    });

    return () => {
      if (callRef.current) {
        callRef.current.destroy();
      }
    };
  }, [roomUrl, onTrackStarted]);

  return (
    <div className="w-full h-full bg-black rounded-xl overflow-hidden">
      <div ref={videoRef} className="w-full h-full"></div>
    </div>
  );
}