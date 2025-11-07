import './globals.css'

export const metadata = {
  title: 'TechVeers Telehealth',
  description: 'AI-Powered Healthcare Consultations',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}