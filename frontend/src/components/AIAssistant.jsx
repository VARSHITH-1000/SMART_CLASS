import React, { useState } from 'react';
import { Card, Button } from './ui';

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hello! I'm your Groq-powered AI Teaching Assistant. How can I help you analyze your class today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.content })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', content: "Error connecting to AI backend." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[80vh] flex flex-col">
      <div className="mb-6">
        <h2 className="text-3xl font-bold">AI Teaching Assistant</h2>
        <p className="text-slate-400 mt-2">Powered by Groq Llama-3 (Mock)</p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden p-0 border border-emerald-500/20">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl px-5 py-3 ${msg.role === 'user' ? 'bg-emerald-500 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'}`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 text-slate-400 border border-slate-700 rounded-2xl rounded-bl-none px-5 py-3 flex gap-2 items-center">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-900 border-t border-slate-800 flex gap-4 items-center">
          <input
            type="text"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
            placeholder="Ask me to summarize the session, generate a quiz, or identify struggling students..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <Button variant="primary" onClick={handleSend} disabled={loading || !input.trim()}>
            Send ↗
          </Button>
        </div>
      </Card>
    </div>
  );
}
