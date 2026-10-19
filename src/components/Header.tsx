import React from 'react';
import { Sparkles, Bookmark, Award, BookOpen, Volume2, BookMarked, Download } from 'lucide-react';

interface HeaderProps {
  currentTab: 'paras' | 'surahs' | 'reader' | 'mushaf';
  onSelectTab: (tab: 'paras' | 'surahs' | 'reader' | 'mushaf') => void;
  onOpenTajweedGuide: () => void;
  onOpenKhatamTracker: () => void;
  onOpenBookmarks: () => void;
  onOpenInstallModal: () => void;
  bookmarkCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenTajweedGuide,
  onOpenKhatamTracker,
  onOpenBookmarks,
  onOpenInstallModal,
  bookmarkCount
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-stone-950/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-850 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 lg:gap-6">
        {/* Zone 1: App Icon & Brand Wordmark */}
        <button
          onClick={() => onSelectTab('paras')}
          className="text-left flex items-center gap-2.5 sm:gap-3 shrink-0 hover:opacity-95 transition-opacity group"
        >
          {/* App Icon */}
          <div className="relative">
            <img
              src="/assets/aistudio/Gemini_Generated_Image_j8biewj8biewj8bi_ae784cb6.png"
              alt="Al-Quran Kareem App Icon"
              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-700/70 shadow-xs ring-2 ring-emerald-500/20 group-hover:scale-105 transition-transform"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-600 border-2 border-white dark:border-stone-950 rounded-full" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-arabic text-base sm:text-lg text-emerald-800 dark:text-emerald-400 font-bold leading-none">
                القرآن الكريم
              </span>
              <span className="text-stone-900 dark:text-stone-100 font-sans-ui text-xs sm:text-sm font-bold tracking-tight truncate">
                Al-Quran
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-emerald-800 dark:text-emerald-400 font-medium tracking-tight block">
              Created by Hussain Akhter
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-4 text-xs font-medium text-stone-600 dark:text-stone-400">
          <button
            onClick={() => onSelectTab('paras')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentTab === 'paras'
                ? 'text-emerald-800 dark:text-emerald-400 font-bold border-b-2 border-emerald-800 dark:border-emerald-400 py-1'
                : 'hover:text-stone-900'
            }`}
          >
            30 Paras (پارے)
          </button>

          {/* Dedicated Silent Read Quran 30 Para Link */}
          <button
            onClick={() => onSelectTab('mushaf')}
            className={`whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 py-1 ${
              currentTab === 'mushaf'
                ? 'text-emerald-800 dark:text-emerald-400 font-bold border-b-2 border-emerald-800 dark:border-emerald-400'
                : 'text-emerald-800 hover:text-emerald-900 dark:text-emerald-300 font-medium'
            }`}
            title="Read all 30 Paras without audio / listening"
          >
            <BookMarked className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            <span>Read Quran (صرف پڑھیں)</span>
          </button>

          <button
            onClick={() => onSelectTab('reader')}
            className={`whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 py-1 ${
              currentTab === 'reader'
                ? 'text-emerald-800 dark:text-emerald-400 font-bold border-b-2 border-emerald-800 dark:border-emerald-400'
                : 'hover:text-stone-900'
            }`}
            title="Listen with Tajweed audio recitation"
          >
            <Volume2 className="w-3.5 h-3.5 text-stone-500" />
            <span>Audio Tilawat (سنیں)</span>
          </button>

          <button
            onClick={() => onSelectTab('surahs')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentTab === 'surahs'
                ? 'text-emerald-800 dark:text-emerald-400 font-bold border-b-2 border-emerald-800 dark:border-emerald-400 py-1'
                : 'hover:text-stone-900'
            }`}
          >
            Surahs (سورتیں)
          </button>

          <button
            onClick={onOpenTajweedGuide}
            className="whitespace-nowrap shrink-0 transition-colors hover:text-emerald-800 dark:hover:text-emerald-400 flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tajweed</span>
          </button>

          <button
            onClick={onOpenKhatamTracker}
            className="whitespace-nowrap shrink-0 transition-colors hover:text-emerald-800 dark:hover:text-emerald-400 flex items-center gap-1"
          >
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>Tracker</span>
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

        {/* Zone 3: Download Button & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Prominent Download App Button (Visible on ALL devices) */}
          <button
            onClick={onOpenInstallModal}
            className="px-2.5 sm:px-3.5 py-1.5 text-xs font-bold text-emerald-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-transform active:scale-95 shadow-xs flex items-center gap-1.5 border border-amber-500/30"
            title="Download & Install App on your mobile phone or PC"
          >
            <Download className="w-3.5 h-3.5 text-emerald-950 stroke-[2.5]" />
            <span className="whitespace-nowrap">Download App</span>
          </button>

          {/* Primary Quick Button: Read Quran without audio */}
          <button
            onClick={() => onSelectTab('mushaf')}
            className={`hidden md:flex px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs items-center gap-1.5 ${
              currentTab === 'mushaf'
                ? 'bg-emerald-900 text-white dark:bg-emerald-600'
                : 'bg-emerald-800 hover:bg-emerald-900 text-white dark:bg-emerald-700'
            }`}
            title="Read 30 Paras without audio"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Read Quran (پڑھیں)</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center justify-around py-2 px-1 border-t border-stone-200 dark:border-stone-850 bg-stone-50 dark:bg-stone-950 text-xs">
        <button
          onClick={() => onSelectTab('paras')}
          className={`px-2 py-1 rounded text-[11px] ${
            currentTab === 'paras'
              ? 'font-bold text-emerald-800 dark:text-emerald-400'
              : 'text-stone-600 dark:text-stone-400'
          }`}
        >
          30 Paras
        </button>

        {/* Read Quran Mode (No Audio) */}
        <button
          onClick={() => onSelectTab('mushaf')}
          className={`px-2 py-1 rounded text-[11px] flex items-center gap-1 ${
            currentTab === 'mushaf'
              ? 'font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/60'
              : 'text-emerald-700 dark:text-emerald-400 font-semibold'
          }`}
          title="Read without listening / audio"
        >
          <BookMarked className="w-3 h-3" />
          <span>Read Quran</span>
        </button>

        <button
          onClick={() => onSelectTab('reader')}
          className={`px-2 py-1 rounded text-[11px] flex items-center gap-1 ${
            currentTab === 'reader'
              ? 'font-bold text-emerald-800 dark:text-emerald-400'
              : 'text-stone-600 dark:text-stone-400'
          }`}
        >
          <Volume2 className="w-3 h-3" />
          <span>Audio</span>
        </button>

        {/* Mobile Download App trigger */}
        <button
          onClick={onOpenInstallModal}
          className="px-2 py-1 rounded text-[11px] text-emerald-950 font-bold flex items-center gap-1 bg-amber-400 hover:bg-amber-300 shadow-2xs"
        >
          <Download className="w-3 h-3 stroke-[2.5]" />
          <span>Download</span>
        </button>

        <button
          onClick={onOpenTajweedGuide}
          className="px-2 py-1 rounded text-[11px] text-stone-600 dark:text-stone-400 flex items-center gap-0.5"
        >
          <Sparkles className="w-3 h-3 text-emerald-600" />
          <span>تجوید</span>
        </button>
      </div>
    </header>
  );
};
