import { NextResponse } from 'next/server';
import { createClient } from '@deepgram/sdk';
import OpenAI from 'openai';

const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request) {
  try {
    const formData = await request.formData();
    const audioBlob = formData.get('audio');
    const buffer = Buffer.from(await audioBlob.arrayBuffer());

    const { result } = await deepgram.listen.prerecorded.transcribeFile(buffer, {
      model: 'nova-2',
      smart_format: true,
      punctuate: true,
      diarize: true
    });

    const transcript = result.results.channels[0].alternatives[0].transcript;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a medical AI assistant. Extract key health insights, symptoms, and medical terms from the conversation. Return 2-3 brief insights only.'
        },
        {
          role: 'user',
          content: transcript
        }
      ],
      max_tokens: 150
    });

    const insights = completion.choices[0].message.content.split('\n').filter(i => i.trim());

    return NextResponse.json({ 
      text: transcript,
      insights,
      normalized: true
    });
  } catch (error) {
    return NextResponse.json({ 
      text: 'Transcription in progress...',
      insights: [],
      error: error.message 
    }, { status: 200 });
  }
}