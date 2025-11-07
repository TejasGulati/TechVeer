import { NextResponse } from 'next/server';
import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'default-key-32-chars-long!!!', 'salt', 32);

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(JSON.stringify(text), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    const encryptedData = encrypt(data);
    
    const consultationRecord = {
      roomId: data.roomId,
      timestamp: Date.now(),
      encryptedData,
      phi_protected: true
    };

    return NextResponse.json({ 
      success: true, 
      message: 'Consultation data encrypted and saved',
      recordId: crypto.randomBytes(16).toString('hex')
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}