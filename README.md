bash
--------------------------------------------------------------------------------
npx create-next-app@latest techveers-telehealth                                
cd techveers-telehealth
npm install @daily-co/daily-js stripe @stripe/stripe-js @deepgram/sdk openai
npm run dev
--------------------------------------------------------------------------------
Then deploy to Vercel:
bash
vercel
--------------------------------------------------------------------------------
✅ All Requirements Met:

✅ Video/audio consultation (Daily.co)
✅ Patient info capture + specialty selection
✅ Payment before consultation (Stripe)
✅ Encrypted PHI storage (AES-256)
✅ In-app encrypted chat
✅ Accent/dialect transcription (Deepgram + OpenAI)
