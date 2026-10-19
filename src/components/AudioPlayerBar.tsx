import React, { useState } from 'react';
import { AudioPlaybackState, Ayah } from '../types/quran';
import { RECITERS_LIST } from '../data/recitersData';
import { SURAH_LIST } from '../data/surahData';
import { audioManager } from '../services/audioService';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Volume2,
  Gauge,
  User,
  Loader2,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface AudioPlayerBarProps {
  audioState: AudioPlaybackState;
  currentAyahs: Ayah[];
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({ audioState, currentAyahs }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const currentAyah = currentAyahs.find(a => a.number === audioState.currentAyahNumber);
  const currentSurah = currentAyah ? SURAH_LIST.find(s => s.number === currentAyah.surahNumber) : null;
  const currentReciter = RECITERS_LIST.find(r => r.id === audioState.reciterId) || RECITERS_LIST[0];

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    audioManager.seek(pos);
  };

  const repeatOptions: Array<AudioPlaybackState['repeatMode']> = ['once', 'twice', 'thrice', 'five', 'infinite'];
  const repeatLabels: Record<AudioPlaybackState['repeatMode'], string> = {
    once: '1x',
    twice: '2x',
    thrice: '3x',
    five: '5x',
    infinite: '∞ Loop'
  };

  const cycleRepeat = () => {
    const curIdx = repeatOptions.indexOf(audioState.repeatMode);
    const nextIdx = (curIdx + 1) % repeatOptions.length;
    audioManager.setRepeatMode(repeatOptions[nextIdx]);
  };

  const speeds = [0.75, 1.0, 1.25];
  const cycleSpeed = () => {
    const curIdx = speeds.indexOf(audioState.playbackSpeed);
    const nextIdx = (curIdx + 1) % speeds.length;
    audioManager.setPlaybackSpeed(speeds[nextIdx]);
  };

  return (
    <aside aria-label="Audio player" className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-950/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 shadow-lg">
      {/* Interactive Progress Bar */}
      <div
        onClick={handleSeek}
        className="w-full h-1.5 bg-stone-100 dark:bg-stone-900 cursor-pointer group relative"
      >
        <div
          className="h-full bg-emerald-600 dark:bg-emerald-500 transition-all duration-100"
          style={{ width: `${(audioState.progress * 100).toFixed(1)}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-emerald-700 dark:bg-emerald-400 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `${(audioState.progress * 100).toFixed(1)}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3 flex flex-col gap-2">
        {/* Main Player Row */}
        <div className="flex items-center justify-between gap-4">
          {/* Left: Ayah info & Surah metadata */}
          <div className="flex items-center gap-3 min-w-0 flex-1 sm:flex-initial sm:w-72">
            <div className="w-10 h-10 rounded-lg bg-emerald-800 dark:bg-emerald-900 text-white flex items-center justify-center font-arabic text-lg font-bold shrink-0">
              {currentSurah ? currentSurah.number : '۝'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">
                  {currentSurah ? currentSurah.englishName : 'Select Ayah'}
                </span>
                {currentAyah && (
                  <span className="text-xs text-stone-400 font-mono">
                    [{currentAyah.surahNumber}:{currentAyah.numberInSurah}]
                  </span>
                )}
              </div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400 truncate flex items-center gap-1.5">
                <span className="truncate">{currentReciter.name}</span>
                {currentReciter.recommendedForTajweed && (
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                    · Tajweed
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Center: Playback Controls */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Previous Ayah */}
            <button
              onClick={() => audioManager.previousAyah()}
              className="p-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-full transition-colors"
              title="Previous Ayah"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={() => audioManager.togglePlayPause()}
              className="w-10 h-10 rounded-full bg-emerald-800 dark:bg-emerald-600 text-white hover:bg-emerald-900 dark:hover:bg-emerald-500 flex items-center justify-center shadow-md transition-transform active:scale-95"
              title={audioState.isPlaying ? 'Pause' : 'Play'}
            >
              {audioState.isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : audioState.isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            {/* Next Ayah */}
            <button
              onClick={() => audioManager.nextAyah()}
              className="p-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-full transition-colors"
              title="Next Ayah"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Timestamps on Desktop */}
            <div className="hidden md:flex items-center text-[11px] text-stone-500 font-mono ml-2">
              <span>{formatTime(audioState.currentTime)}</span>
              <span className="mx-1">/</span>
              <span>{formatTime(audioState.duration)}</span>
            </div>
          </div>

          {/* Right: Reciter & Practice Controls */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            {/* Tajweed Repeat / Loop Button */}
            <button
              onClick={cycleRepeat}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                audioState.repeatMode !== 'once'
                  ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900'
              }`}
              title="Repeat Ayah for Tajweed practice"
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>{repeatLabels[audioState.repeatMode]}</span>
              {audioState.currentRepeatCount > 0 && (
                <span className="text-[10px] text-amber-700 dark:text-amber-300 font-mono">
                  ({audioState.currentRepeatCount + 1})
                </span>
              )}
            </button>

            {/* Playback Speed */}
            <button
              onClick={cycleSpeed}
              className="px-2.5 py-1 text-xs font-mono font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-md transition-colors flex items-center gap-1"
              title="Change recitation speed (0.75x recommended for Tajweed learning)"
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>{audioState.playbackSpeed}x</span>
            </button>

            {/* Reciter Selector */}
            <select
              value={audioState.reciterId}
              onChange={(e) => audioManager.setReciter(e.target.value)}
              className="text-xs py-1 px-2.5 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md text-stone-800 dark:text-stone-200 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 max-w-[180px] truncate"
            >
              {RECITERS_LIST.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.style})
                </option>
              ))}
            </select>
          </div>

          {/* Mobile Drawer Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="sm:hidden p-1.5 text-stone-500 hover:text-stone-900 rounded-lg"
          >
            {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Expanded Drawer */}
        {isExpanded && (
          <div className="sm:hidden pt-2 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            {/* Reciter Dropdown Mobile */}
            <div className="w-full">
              <label className="text-[11px] text-stone-500 block mb-1">قاری / Reciter:</label>
              <select
                value={audioState.reciterId}
                onChange={(e) => audioManager.setReciter(e.target.value)}
                className="w-full text-xs py-1.5 px-2 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded text-stone-800 dark:text-stone-200"
              >
                {RECITERS_LIST.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.style})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between w-full pt-1">
              {/* Repeat Button Mobile */}
              <button
                onClick={cycleRepeat}
                className="flex items-center gap-1.5 px-3 py-1 bg-stone-100 dark:bg-stone-900 rounded text-stone-700 dark:text-stone-300"
              >
                <Repeat className="w-3.5 h-3.5" />
                <span>Repeat: {repeatLabels[audioState.repeatMode]}</span>
              </button>

              {/* Speed Mobile */}
              <button
                onClick={cycleSpeed}
                className="flex items-center gap-1.5 px-3 py-1 bg-stone-100 dark:bg-stone-900 rounded text-stone-700 dark:text-stone-300 font-mono"
              >
                <Gauge className="w-3.5 h-3.5" />
                <span>{audioState.playbackSpeed}x Speed</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
