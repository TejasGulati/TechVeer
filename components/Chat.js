'use client';
import { useState, useEffect, useRef } from 'react';

export default function Chat({ roomId, role, onMessageSave }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: role,
      text: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMsg]);
    setInput('');

    if (onMessageSave) {
      await onMessageSave(newMsg);
    }

    await fetch('/api/save-consultation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        roomId, 
        message: newMsg,
        type: 'chat'
      })
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-indigo-50 rounded-xl p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-indigo-800 flex items-center gap-2">
          💬 Secure Chat
        </h3>
        <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
          Encrypted
        </span>
      </div>

      <div className="flex-1 overflow-y-auto mb-3 space-y-2 max-h-64">
        {messages.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No messages yet</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 rounded-lg ${
                msg.sender === role
                  ? 'bg-indigo-600 text-white ml-8'
                  : 'bg-white text-gray-800 mr-8'
              }`}
            >
              <div className="text-xs font-bold mb-1 opacity-75">
                {msg.sender}
              </div>
              <p className="text-sm break-words">{msg.text}</p>
              <div className="text-xs opacity-60 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 p-2 border border-indigo-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}