import React, { useState } from 'react';
import { Volume2, Square } from 'lucide-react';
import { speakText, stopSpeech, isSpeechSynthesisSupported } from '../../services/speechService';

const AudioPlayer = ({ text, className = '' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const supported = isSpeechSynthesisSupported();

  const handleToggle = () => {
    if (!supported || !text) return;

    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      speakText(text, () => {
        setIsPlaying(false);
      });
    }
  };

  if (!supported || !text) return null;

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors border ${
        isPlaying
          ? 'bg-brand-500/20 text-brand-300 border-brand-500/40 animate-pulse'
          : 'bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border-slate-700/60'
      } ${className}`}
      title={isPlaying ? 'Stop audio playback' : 'Listen to AI response'}
    >
      {isPlaying ? (
        <>
          <Square className="w-3.5 h-3.5 text-rose-400" />
          <span>Stop Voice</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-brand-400" />
          <span>Listen</span>
        </>
      )}
    </button>
  );
};

export default AudioPlayer;
