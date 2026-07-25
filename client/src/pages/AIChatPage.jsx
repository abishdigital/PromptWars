import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import api from '../services/api';
import Button from '../components/UI/Button';
import VoiceInput from '../components/Voice/VoiceInput';
import AudioPlayer from '../components/Voice/AudioPlayer';
import { Bot, Send, Trash2, Sparkles, Heart, RotateCcw, AlertTriangle } from 'lucide-react';

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
  const [error, setError] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
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
      // Error fetching history handled silently
    }
  };

  const handleSend = async (textToSend) => {
    const prompt = textToSend || input;
    if (!prompt.trim() || loading) return;

    setError('');
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
      setError('Connection glitch encountered. Click retry to try sending your message again.');
      const fallbackAiMsg = {
        role: 'model',
        text: "I am here with you. It looks like a connection glitch occurred, but remember: **take a deep breath, ground yourself, and take things one step at a time**.\n\n* **Grounding Tip**: Focus on 3 things you can see right now.\n* **Support**: Reaching out is a sign of strength.",
        timestamp: new Date(),
        isErrorFallback: true,
      };
      setMessages((prev) => [...prev, fallbackAiMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMsg) {
      handleSend(lastUserMsg.text);
    }
  };

  const handleClearHistory = async () => {
    try {
      await api.delete('/ai/history?sessionType=coach');
      setMessages([]);
      setShowClearConfirm(false);
    } catch (err) {
      setError('Failed to clear history. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col h-[85vh]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-500 border border-indigo-500/30">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Gemini AI Recovery Coach
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Empathetic, judgment-free support 24/7
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <div className="relative">
            {showClearConfirm ? (
              <div className="flex items-center gap-2 bg-rose-50 dark:bg-rose-950/40 p-1.5 rounded-xl border border-rose-300 dark:border-rose-800">
                <span className="text-xs text-rose-600 dark:text-rose-300 font-semibold px-1">
                  Clear all history?
                </span>
                <button
                  onClick={handleClearHistory}
                  className="px-2 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-500"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200 dark:border-slate-700"
                title="Clear Chat History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Preset Prompts Chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {PRESET_PROMPTS.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(preset)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-brand-50 dark:hover:bg-brand-900/30 text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-300 border border-slate-200 dark:border-slate-700 text-xs font-medium transition-colors"
          >
            <Sparkles className="w-3 h-3 inline mr-1 text-brand-500" />
            {preset}
          </button>
        ))}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 dark:text-slate-400 space-y-4">
            <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <Heart className="w-10 h-10 text-brand-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              How can I support you today?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
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
                className={`max-w-[88%] md:max-w-[82%] rounded-2xl p-4 text-sm leading-relaxed shadow-md transition-colors ${
                  msg.role === 'user'
                    ? 'bg-brand-600 text-white rounded-br-none font-medium'
                    : 'glass-card border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 rounded-bl-none'
                }`}
              >
                {msg.role === 'user' ? (
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                ) : (
                  <div className="prose dark:prose-invert max-w-none text-sm space-y-2">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                )}

                {msg.role === 'model' && (
                  <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                    <AudioPlayer text={msg.text} />
                    {msg.isErrorFallback && (
                      <button
                        onClick={handleRetry}
                        className="inline-flex items-center gap-1 text-xs text-rose-500 hover:underline font-semibold"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Retry</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="flex items-start">
            <div className="glass-card rounded-2xl p-4 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2 border border-slate-200 dark:border-slate-700">
              <Sparkles className="w-4 h-4 text-brand-500 animate-spin" />
              <span>Recovery Coach is reflecting...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="mb-2 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-between text-xs text-rose-700 dark:text-rose-300">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span>{error}</span>
          </div>
          <button
            onClick={handleRetry}
            className="px-2 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-500 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Input Bar */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
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
            className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 text-sm shadow-sm transition-colors"
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
