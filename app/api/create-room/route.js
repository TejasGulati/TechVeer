import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    
    const response = await fetch('https://api.daily.co/v1/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DAILY_API_KEY}`
      },
      body: JSON.stringify({
        privacy: 'private',
        properties: {
          enable_screenshare: true,
          enable_chat: true,
          enable_recording: 'cloud',
          max_participants: 2
        }
      })
    });

    const room = await response.json();
    
    const roomId = room.name;
    
    return NextResponse.json({ 
      roomId,
      url: room.url,
      patientInfo: data
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}