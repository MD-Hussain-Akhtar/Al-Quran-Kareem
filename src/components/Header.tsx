import React from 'react';
import { Sparkles, Bookmark, Award, Volume2, Download, Phone, Mail } from 'lucide-react';

interface HeaderProps {
  currentTab: 'paras' | 'surahs' | 'reader';
  onSelectTab: (tab: 'paras' | 'surahs' | 'reader') => void;
  onOpenTajweedGuide: () => void;
  onOpenKhatamTracker: () => void;
  onOpenBookmarks: () => void;
  onOpenInstallModal: () => void;
  onScrollToContact?: () => void;
  bookmarkCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenTajweedGuide,
  onOpenKhatamTracker,
  onOpenBookmarks,
  onOpenInstallModal,
  onScrollToContact,
  bookmarkCount
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-stone-950/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-850 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 lg:gap-6">
        {/* Zone 1: App Icon & Brand Wordmark with Creator Attribution */}
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
        <nav className="hidden lg:flex items-center gap-5 text-xs font-medium text-stone-600 dark:text-stone-400">
          <button
            onClick={() => onSelectTab('paras')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentTab === 'paras'
                ? 'text-emerald-800 dark:text-emerald-400 font-bold border-b-2 border-emerald-800 dark:border-emerald-400 py-1'
                : 'hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            30 Paras (پارے)
          </button>

          <button
            onClick={() => onSelectTab('reader')}
            className={`whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 py-1 ${
              currentTab === 'reader'
                ? 'text-emerald-800 dark:text-emerald-400 font-bold border-b-2 border-emerald-800 dark:border-emerald-400'
                : 'hover:text-stone-900 dark:hover:text-stone-100'
            }`}
            title="Listen with Tajweed audio recitation & live highlight"
          >
            <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>قرآن تلاوت (Audio & Highlight)</span>
          </button>

          <button
            onClick={() => onSelectTab('surahs')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentTab === 'surahs'
                ? 'text-emerald-800 dark:text-emerald-400 font-bold border-b-2 border-emerald-800 dark:border-emerald-400 py-1'
                : 'hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            Surahs (سورتیں)
          </button>

          <button
            onClick={onOpenTajweedGuide}
            className="whitespace-nowrap shrink-0 transition-colors hover:text-emerald-800 dark:hover:text-emerald-400 flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>تجوید قواعد</span>
          </button>

          <button
            onClick={onOpenKhatamTracker}
            className="whitespace-nowrap shrink-0 transition-colors hover:text-emerald-800 dark:hover:text-emerald-400 flex items-center gap-1"
          >
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>ختم قرآن ٹریکر</span>
          </button>

          {onScrollToContact && (
            <button
              onClick={onScrollToContact}
              className="whitespace-nowrap shrink-0 transition-colors hover:text-emerald-800 dark:hover:text-emerald-400 flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold"
              title="Contact Developer Hussain Akhter"
            >
              <Phone className="w-3 h-3 text-emerald-600" />
              <span>Contact (رابطہ)</span>
            </button>
          )}

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

        {/* Zone 3: ONLY ONE Download App Button (Visible on all devices) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenInstallModal}
            className="px-3 sm:px-4 py-1.5 text-xs font-bold text-emerald-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-transform active:scale-95 shadow-xs flex items-center gap-1.5 border border-amber-500/30"
            title="Download & Install App on your mobile phone or PC"
          >
            <Download className="w-3.5 h-3.5 text-emerald-950 stroke-[2.5]" />
            <span className="whitespace-nowrap">Download App</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center justify-around py-2 px-1 border-t border-stone-200 dark:border-stone-850 bg-stone-50 dark:bg-stone-950 text-xs">
        <button
          onClick={() => onSelectTab('paras')}
          className={`px-2.5 py-1 rounded text-xs font-medium ${
            currentTab === 'paras'
              ? 'font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/60'
              : 'text-stone-600 dark:text-stone-400'
          }`}
        >
          30 پارے
        </button>

        <button
          onClick={() => onSelectTab('reader')}
          className={`px-2.5 py-1 rounded text-xs flex items-center gap-1 font-medium ${
            currentTab === 'reader'
              ? 'font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/60'
              : 'text-stone-600 dark:text-stone-400'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>تلاوت</span>
        </button>

        <button
          onClick={() => onSelectTab('surahs')}
          className={`px-2.5 py-1 rounded text-xs font-medium ${
            currentTab === 'surahs'
              ? 'font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/60'
              : 'text-stone-600 dark:text-stone-400'
          }`}
        >
          سورتیں
        </button>

        <button
          onClick={onOpenTajweedGuide}
          className="px-2 py-1 rounded text-xs text-stone-600 dark:text-stone-400 flex items-center gap-1 font-medium"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>تجوید</span>
        </button>

        {onScrollToContact && (
          <button
            onClick={onScrollToContact}
            className="px-2 py-1 rounded text-xs text-emerald-800 dark:text-emerald-400 font-semibold flex items-center gap-1"
          >
            <Phone className="w-3 h-3 text-emerald-600" />
            <span>رابطہ</span>
          </button>
        )}

        <button
          onClick={onOpenBookmarks}
          className="px-2 py-1 rounded text-xs text-stone-600 dark:text-stone-400 flex items-center gap-1 font-medium"
        >
          <Bookmark className="w-3.5 h-3.5 text-stone-500" />
          {bookmarkCount > 0 && (
            <span className="text-[10px] font-mono px-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-full">
              {bookmarkCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
