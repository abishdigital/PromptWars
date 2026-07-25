import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { createSpeechRecognition, isSpeechRecognitionSupported } from '../../services/speechService';

const VoiceInput = ({ onTranscript, className = '' }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const supported = isSpeechRecognitionSupported();

  useEffect(() => {
    if (!supported) return;

    const rec = createSpeechRecognition({
      onResult: (text) => {
        onTranscript(text);
      },
      onError: () => {
        setIsListening(false);
      },
      onEnd: () => {
        setIsListening(false);
      },
    });

    setRecognition(rec);
  }, [supported]);

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      try {
        recognition.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start recognition:', err);
      }
    }
  };

  if (!supported) {
    return (
      <button
        type="button"
        disabled
        title="Speech recognition is not supported in this browser"
        className="p-2.5 rounded-xl bg-slate-800/40 text-slate-500 border border-slate-700/50 cursor-not-allowed"
      >
        <MicOff className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`relative p-2.5 rounded-xl transition-all duration-200 border ${
        isListening
          ? 'bg-rose-600/30 text-rose-400 border-rose-500/50 animate-pulse'
          : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
      } ${className}`}
      title={isListening ? 'Stop listening' : 'Speak input using microphone'}
    >
      <Mic className="w-5 h-5" />
      {isListening && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full animate-ping" />
      )}
    </button>
  );
};

export default VoiceInput;
