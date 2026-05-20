import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { BrainCircuit, Send, Sparkles, User, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function AIAssistantPage() {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: "Hello! I'm your Groq-powered AI Teaching Assistant. I can analyze classroom data, summarize sessions, identify struggling students, and generate quizzes. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/ai/chat', { message: userMsg.content });
      setMessages(prev => [...prev, { role: 'ai', content: response.data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', content: "Error connecting to AI backend. Please check if the server is running." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[85vh] flex flex-col animate-in fade-in duration-500">

      <div className="mb-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-ai-purple/20 flex items-center justify-center border border-ai-purple/30">
          <BrainCircuit className="w-6 h-6 text-ai-purple" />
        </div>
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            AI Assistant <Sparkles className="w-5 h-5 text-ai-cyan" />
          </h2>
          <p className="text-slate-400">Powered by Groq & LLaMA 3</p>
        </div>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden p-0 border border-white/5 shadow-2xl relative">

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center mt-1 ${msg.role === 'user' ? 'bg-ai-blue/20 text-ai-blue' : 'bg-ai-purple/20 text-ai-purple'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4"/> : <BrainCircuit className="w-4 h-4"/>}
                </div>

                {/* Bubble */}
                <div className={`rounded-2xl px-5 py-3.5 shadow-lg ${
                  msg.role === 'user'
                    ? 'bg-ai-blue text-white rounded-tr-none'
                    : 'glass bg-slate-800/80 text-slate-200 border-white/10 rounded-tl-none'
                }`}>
                  {/* Using whitespace-pre-wrap to respect newlines from LLM */}
                  <div className="prose prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </div>
                </div>

              </div>
            </motion.div>
          ))}

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-ai-purple/20 text-ai-purple flex shrink-0 items-center justify-center mt-1">
                  <Loader2 className="w-4 h-4 animate-spin"/>
                </div>
                <div className="glass bg-slate-800/80 rounded-2xl rounded-tl-none px-5 py-4 border border-white/10 flex items-center gap-1.5">
                   <div className="w-2 h-2 rounded-full bg-ai-cyan/60 animate-bounce" />
                   <div className="w-2 h-2 rounded-full bg-ai-cyan/60 animate-bounce" style={{animationDelay: '0.15s'}} />
                   <div className="w-2 h-2 rounded-full bg-ai-cyan/60 animate-bounce" style={{animationDelay: '0.3s'}} />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={endOfMessagesRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-900/80 backdrop-blur-xl border-t border-white/5">
          <div className="relative flex items-center">
            <Input
              type="text"
              className="pr-14 py-6 rounded-xl bg-slate-950 border-white/10 shadow-inner text-base"
              placeholder="Ask me to summarize the session or identify struggling students..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <Button
              size="icon"
              variant="neon"
              className="absolute right-2 h-10 w-10 rounded-lg"
              onClick={handleSend}
              disabled={loading || !input.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-2 mt-3 px-1 overflow-x-auto pb-1 scrollbar-hide">
             {["Summarize today's class", "Who is struggling?", "Generate a quick quiz"].map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => setInput(suggestion)}
                  className="text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 whitespace-nowrap transition-colors"
                >
                  {suggestion}
                </button>
             ))}
          </div>
        </div>

      </Card>
    </div>
  );
}
