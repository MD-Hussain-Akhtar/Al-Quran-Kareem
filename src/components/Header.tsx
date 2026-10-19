import React from 'react';
import { Sparkles, Bookmark, Award, BookOpen, Volume2, BookMarked } from 'lucide-react';

interface HeaderProps {
  currentTab: 'paras' | 'surahs' | 'reader' | 'mushaf';
  onSelectTab: (tab: 'paras' | 'surahs' | 'reader' | 'mushaf') => void;
  onOpenTajweedGuide: () => void;
  onOpenKhatamTracker: () => void;
  onOpenBookmarks: () => void;
  bookmarkCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenTajweedGuide,
  onOpenKhatamTracker,
  onOpenBookmarks,
  bookmarkCount
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-stone-950/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 lg:gap-8">
        {/* Zone 1: App Icon & Brand Wordmark */}
        <button
          onClick={() => onSelectTab('paras')}
          className="text-left flex items-center gap-3 shrink-0 hover:opacity-95 transition-opacity group"
        >
          {/* App Icon */}
          <div className="relative">
            <img
              src="/assets/aistudio/Gemini_Generated_Image_j8biewj8biewj8bi_ae784cb6.png"
              alt="Al-Quran Kareem App Icon"
              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-700/60 shadow-xs ring-2 ring-emerald-500/20 group-hover:scale-105 transition-transform"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-600 border-2 border-white dark:border-stone-950 rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-arabic text-lg text-emerald-800 dark:text-emerald-400 font-bold leading-none">
                القرآن الكريم
              </span>
              <span className="text-stone-900 dark:text-stone-100 font-sans-ui text-sm font-bold tracking-tight">
                Al-Quran Kareem
              </span>
            </div>
            <span className="text-[11px] text-emerald-800 dark:text-emerald-400 font-medium tracking-tight block">
              Created by Hussain Akhter
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-5 text-xs font-medium text-stone-600 dark:text-stone-400">
          <button
            onClick={() => onSelectTab('paras')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-stone-900 dark:hover:text-stone-100 ${
              currentTab === 'paras'
                ? 'text-emerald-800 dark:text-emerald-400 font-semibold border-b-2 border-emerald-800 dark:border-emerald-400 py-1'
                : 'hover:text-stone-900'
            }`}
          >
            30 Paras
          </button>

          {/* New Silent "Read Quran" Mode Link */}
          <button
            onClick={() => onSelectTab('mushaf')}
            className={`whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 ${
              currentTab === 'mushaf'
                ? 'text-emerald-800 dark:text-emerald-400 font-semibold border-b-2 border-emerald-800 dark:border-emerald-400 py-1'
                : 'hover:text-stone-900'
            }`}
            title="Read 30 Paras without listening / audio"
          >
            <BookMarked className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            <span>Read Quran (صرف تلاوت)</span>
          </button>

          <button
            onClick={() => onSelectTab('reader')}
            className={`whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 ${
              currentTab === 'reader'
                ? 'text-emerald-800 dark:text-emerald-400 font-semibold border-b-2 border-emerald-800 dark:border-emerald-400 py-1'
                : 'hover:text-stone-900'
            }`}
            title="Listen with Tajweed Audio Recitation"
          >
            <Volume2 className="w-3.5 h-3.5 text-stone-500" />
            <span>Audio Tilawat (سنیں)</span>
          </button>

          <button
            onClick={() => onSelectTab('surahs')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-stone-900 dark:hover:text-stone-100 ${
              currentTab === 'surahs'
                ? 'text-emerald-800 dark:text-emerald-400 font-semibold border-b-2 border-emerald-800 dark:border-emerald-400 py-1'
                : 'hover:text-stone-900'
            }`}
          >
            Surahs
          </button>

          <button
            onClick={onOpenTajweedGuide}
            className="whitespace-nowrap shrink-0 transition-colors hover:text-emerald-800 dark:hover:text-emerald-400 flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tajweed Rules</span>
          </button>

          <button
            onClick={onOpenKhatamTracker}
            className="whitespace-nowrap shrink-0 transition-colors hover:text-emerald-800 dark:hover:text-emerald-400 flex items-center gap-1"
          >
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>Khatam Tracker</span>
          </button>

          <button
            onClick={onOpenBookmarks}
            className="whitespace-nowrap shrink-0 transition-colors hover:text-emerald-800 dark:hover:text-emerald-400 flex items-center gap-1"
          >
            <Bookmark className="w-3.5 h-3.5 text-stone-500" />
            <span>Saved</span>
            {bookmarkCount > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-full">
                {bookmarkCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Side Creator Tag & Primary Action */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Side Creator Badge */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/60 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-stone-600 dark:text-stone-400 text-[11px]">Created by:</span>
            <span className="font-semibold text-emerald-900 dark:text-emerald-300 text-[11px]">Hussain Akhter</span>
          </div>

          {/* Primary Quick Button: Read Quran without audio */}
          <button
            onClick={() => onSelectTab('mushaf')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs flex items-center gap-1.5 ${
              currentTab === 'mushaf'
                ? 'bg-emerald-900 text-white dark:bg-emerald-600'
                : 'bg-emerald-800 hover:bg-emerald-900 text-white dark:bg-emerald-700'
            }`}
            title="Read 30 Paras without audio"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Read Quran (صرف پڑھیں)</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around py-2 px-2 border-t border-stone-200 dark:border-stone-850 bg-stone-50 dark:bg-stone-950 text-xs">
        <button
          onClick={() => onSelectTab('paras')}
          className={`px-2 py-1 rounded text-[11px] ${
            currentTab === 'paras'
              ? 'font-semibold text-emerald-800 dark:text-emerald-400'
              : 'text-stone-600 dark:text-stone-400'
          }`}
        >
          30 Paras
        </button>
        <button
          onClick={() => onSelectTab('mushaf')}
          className={`px-2 py-1 rounded text-[11px] flex items-center gap-1 ${
            currentTab === 'mushaf'
              ? 'font-semibold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50'
              : 'text-emerald-700 dark:text-emerald-400 font-medium'
          }`}
        >
          <BookMarked className="w-3 h-3" />
          <span>Read Quran</span>
        </button>
        <button
          onClick={() => onSelectTab('reader')}
          className={`px-2 py-1 rounded text-[11px] flex items-center gap-1 ${
            currentTab === 'reader'
              ? 'font-semibold text-emerald-800 dark:text-emerald-400'
              : 'text-stone-600 dark:text-stone-400'
          }`}
        >
          <Volume2 className="w-3 h-3" />
          <span>Audio</span>
        </button>
        <button
          onClick={onOpenTajweedGuide}
          className="px-2 py-1 rounded text-[11px] text-stone-600 dark:text-stone-400 flex items-center gap-0.5"
        >
          <Sparkles className="w-3 h-3 text-emerald-600" />
          <span>Tajweed</span>
        </button>
        <button
          onClick={onOpenKhatamTracker}
          className="px-2 py-1 rounded text-[11px] text-stone-600 dark:text-stone-400"
        >
          Tracker
        </button>
      </div>
    </header>
  );
};
