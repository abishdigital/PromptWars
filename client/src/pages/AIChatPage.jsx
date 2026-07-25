import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import VoiceInput from '../components/Voice/VoiceInput';
import AudioPlayer from '../components/Voice/AudioPlayer';
import { Bot, Send, Trash2, Sparkles, Heart } from 'lucide-react';

const PRESET_PROMPTS = [
  "I'm feeling a sudden craving right now.",
  "I need some words of encouragement today.",
  "How can I manage stress without resorting to bad habits?",
  "What is urge surfing and how do I practice it?",
];

const AIChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchChatHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const fetchChatHistory = async () => {
    try {
      const res = await api.get('/ai/history?sessionType=coach');
      if (res.data.success) {
        setMessages(res.data.messages || []);
      }
    } catch (err) {
      console.error('Failed to fetch history:', err.message);
    }
  };

  const handleSend = async (textToSend) => {
    const prompt = textToSend || input;
    if (!prompt.trim() || loading) return;

    const userMsg = { role: 'user', text: prompt, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', { prompt, sessionType: 'coach' });
      if (res.data.success) {
        const aiMsg = { role: 'model', text: res.data.reply, timestamp: new Date() };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (err) {
      const errorMsg = {
        role: 'model',
        text: 'I am here with you. It looks like a connection glitch occurred, but remember: take a deep breath, ground yourself, and take things one step at a time.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      await api.delete('/ai/history?sessionType=coach');
      setMessages([]);
    } catch (err) {
      console.error('Failed to clear history:', err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col h-[82vh]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Gemini AI Recovery Coach
            </h1>
            <p className="text-xs text-slate-400">Empathetic, judgment-free support 24/7</p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors border border-slate-700"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Preset Prompts Chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {PRESET_PROMPTS.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(preset)}
            className="px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-brand-600/30 text-slate-300 hover:text-brand-300 border border-slate-700/60 text-xs transition-colors"
          >
            <Sparkles className="w-3 h-3 inline mr-1 text-brand-400" />
            {preset}
          </button>
        ))}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-4">
            <div className="p-4 rounded-full bg-slate-800/50 border border-slate-700">
              <Heart className="w-10 h-10 text-brand-400" />
            </div>
            <h3 className="text-lg font-bold text-white">How can I support you today?</h3>
            <p className="text-xs text-slate-400 max-w-md">
              Feel free to type or use the microphone to talk about cravings, stress, or your daily recovery progress.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-lg ${
                  msg.role === 'user'
                    ? 'bg-brand-600 text-white rounded-br-none'
                    : 'glass-card border border-slate-700 text-slate-100 rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                {msg.role === 'model' && (
                  <div className="mt-3 pt-2 border-t border-slate-700/50 flex items-center justify-between">
                    <AudioPlayer text={msg.text} />
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="flex items-start">
            <div className="glass-card rounded-2xl p-4 text-xs text-slate-400 flex items-center gap-2 border border-slate-700">
              <Sparkles className="w-4 h-4 text-brand-400 animate-spin" />
              <span>Recovery Coach is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="pt-4 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <VoiceInput onTranscript={(text) => setInput((prev) => (prev ? `${prev} ${text}` : text))} />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message or click microphone..."
            className="flex-1 px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 text-sm"
          />
          <Button type="submit" disabled={loading || !input.trim()} className="px-4 py-3">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AIChatPage;
