import React, { useState, useEffect, useRef } from 'react';
import { Ayah, ReadingSettings, Bookmark, MushafTheme } from '../types/quran';
import { JUZ_LIST } from '../data/juzData';
import { TajweedParser } from './TajweedParser';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Bookmark as BookmarkIcon,
  Copy,
  Check,
  Sparkles,
  Eye,
  Type,
  Sun,
  Moon,
  Compass,
  ArrowRight,
  Volume2
} from 'lucide-react';

interface MushafReaderProps {
  currentJuz: number;
  ayahs: Ayah[];
  isLoading: boolean;
  bookmarks: Bookmark[];
  onToggleBookmark: (ayah: Ayah) => void;
  onSelectJuz: (juzNumber: number) => void;
  readingSettings: ReadingSettings;
  onUpdateSettings: (settings: Partial<ReadingSettings>) => void;
  onOpenTajweedGuide: () => void;
  onSwitchToAudio?: () => void;
}

export const MushafReader: React.FC<MushafReaderProps> = ({
  currentJuz,
  ayahs,
  isLoading,
  bookmarks,
  onToggleBookmark,
  onSelectJuz,
  readingSettings,
  onUpdateSettings,
  onOpenTajweedGuide,
  onSwitchToAudio
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedAyahNum, setCopiedAyahNum] = useState<number | null>(null);
  const [selectedAyahForDetails, setSelectedAyahForDetails] = useState<Ayah | null>(null);
  const [theme, setTheme] = useState<MushafTheme>(readingSettings.mushafTheme || 'parchment');
  const [showOnlyArabic, setShowOnlyArabic] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const juzInfo = JUZ_LIST.find((j) => j.number === currentJuz) || JUZ_LIST[0];

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleCopyAyah = (ayah: Ayah) => {
    const textToCopy = `${ayah.textArabic}\n[Surah ${ayah.surahNameEnglish || ayah.surahNumber}:${ayah.numberInSurah} - Para ${ayah.juz}]`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedAyahNum(ayah.number);
    setTimeout(() => setCopiedAyahNum(null), 2000);
  };

  const isBookmarked = (ayahNum: number) => {
    return bookmarks.some((b) => b.globalAyahNumber === ayahNum);
  };

  // Theme styling definitions
  const themeClasses: Record<MushafTheme, { bg: string; text: string; border: string; banner: string; subText: string }> = {
    parchment: {
      bg: 'bg-[#faf6ec]',
      text: 'text-[#1e1b18]',
      border: 'border-[#dfd3be]',
      banner: 'bg-[#f3ead6] border-[#dfd3be]',
      subText: 'text-[#6b5e4d]'
    },
    sepia: {
      bg: 'bg-[#f4ebd0]',
      text: 'text-[#2b2118]',
      border: 'border-[#d8c5a2]',
      banner: 'bg-[#e9dcbe] border-[#d8c5a2]',
      subText: 'text-[#705b41]'
    },
    white: {
      bg: 'bg-white',
      text: 'text-stone-900',
      border: 'border-stone-200',
      banner: 'bg-stone-50 border-stone-200',
      subText: 'text-stone-500'
    },
    night: {
      bg: 'bg-[#141518]',
      text: 'text-stone-100',
      border: 'border-stone-800',
      banner: 'bg-[#1c1d22] border-stone-800',
      subText: 'text-stone-400'
    }
  };

  const activeTheme = themeClasses[theme];

  return (
    <div
      ref={containerRef}
      className={`min-h-[85vh] flex flex-col transition-colors duration-200 ${activeTheme.bg} ${activeTheme.text} ${
        isFullscreen ? 'p-4 sm:p-8 overflow-y-auto' : 'rounded-2xl border ' + activeTheme.border + ' shadow-sm'
      }`}
    >
      {/* Top Toolbar for Pure Reading Experience */}
      <div className={`p-4 border-b ${activeTheme.border} flex flex-wrap items-center justify-between gap-3`}>
        {/* Left: Para Selector & Information */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>مصحف تلاوت (صرف پڑھیں)</span>
            </span>
            <span className="text-stone-300 dark:text-stone-700">·</span>
            <select
              value={currentJuz}
              onChange={(e) => onSelectJuz(Number(e.target.value))}
              className={`text-xs font-bold py-1 px-2.5 rounded-lg border ${activeTheme.border} ${activeTheme.bg} cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-emerald-600`}
            >
              {JUZ_LIST.map((j) => (
                <option key={j.number} value={j.number}>
                  Para {j.number} - {j.transliteration} ({j.arabicName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Controls (Theme, Font Size, Tajweed, Translations, Fullscreen) */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Pure Arabic vs Translations Toggle */}
          <button
            onClick={() => setShowOnlyArabic(!showOnlyArabic)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors border flex items-center gap-1.5 ${
              showOnlyArabic
                ? 'bg-emerald-800 text-white border-emerald-800'
                : 'bg-stone-100 dark:bg-stone-850 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
            }`}
            title="Toggle pure Arabic vs with translations"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showOnlyArabic ? 'صرف عربی (Pure Arabic)' : 'مع ترجمہ (With Translation)'}</span>
          </button>

          {/* Tajweed Colors Toggle */}
          <button
            onClick={() => onUpdateSettings({ showTajweed: !readingSettings.showTajweed })}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors border flex items-center gap-1.5 ${
              readingSettings.showTajweed
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800'
                : 'bg-stone-100 dark:bg-stone-850 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
            }`}
            title="Toggle Tajweed colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{readingSettings.showTajweed ? 'Tajweed ON' : 'Plain Text'}</span>
          </button>

          {/* Font Size Buttons */}
          <div className="flex items-center border rounded-lg overflow-hidden border-stone-200 dark:border-stone-700">
            <button
              onClick={() => onUpdateSettings({ arabicFontSize: Math.max(22, readingSettings.arabicFontSize - 2) })}
              className="px-2.5 py-1 text-xs hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-mono"
              title="Decrease Font Size"
            >
              A-
            </button>
            <span className="px-2 text-[11px] font-mono border-x border-stone-200 dark:border-stone-700">
              {readingSettings.arabicFontSize}
            </span>
            <button
              onClick={() => onUpdateSettings({ arabicFontSize: Math.min(48, readingSettings.arabicFontSize + 2) })}
              className="px-2.5 py-1 text-xs hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-mono"
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          {/* Reading Themes */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg border border-stone-200 dark:border-stone-700">
            <button
              onClick={() => {
                setTheme('parchment');
                onUpdateSettings({ mushafTheme: 'parchment' });
              }}
              className={`w-6 h-6 rounded-md bg-[#faf6ec] border border-[#dfd3be] flex items-center justify-center ${
                theme === 'parchment' ? 'ring-2 ring-emerald-600' : ''
              }`}
              title="Classic Parchment Theme"
            />
            <button
              onClick={() => {
                setTheme('sepia');
                onUpdateSettings({ mushafTheme: 'sepia' });
              }}
              className={`w-6 h-6 rounded-md bg-[#f4ebd0] border border-[#d8c5a2] flex items-center justify-center ${
                theme === 'sepia' ? 'ring-2 ring-emerald-600' : ''
              }`}
              title="Warm Sepia Theme"
            />
            <button
              onClick={() => {
                setTheme('white');
                onUpdateSettings({ mushafTheme: 'white' });
              }}
              className={`w-6 h-6 rounded-md bg-white border border-stone-200 flex items-center justify-center ${
                theme === 'white' ? 'ring-2 ring-emerald-600' : ''
              }`}
              title="Crisp White Theme"
            />
            <button
              onClick={() => {
                setTheme('night');
                onUpdateSettings({ mushafTheme: 'night' });
              }}
              className={`w-6 h-6 rounded-md bg-[#141518] border border-stone-700 flex items-center justify-center ${
                theme === 'night' ? 'ring-2 ring-emerald-600' : ''
              }`}
              title="Night Dark Theme"
            >
              <Moon className="w-3 h-3 text-stone-300" />
            </button>
          </div>

          {/* Switch to Audio Recitation Mode */}
          {onSwitchToAudio && (
            <button
              onClick={onSwitchToAudio}
              className="px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-1 text-[11px] font-medium"
              title="Listen with Tajweed audio recitation"
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">آڈیو سنیں</span>
            </button>
          )}

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Reading'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Mushaf Page Body */}
      <div className="flex-1 p-6 sm:p-12 max-w-4xl mx-auto w-full">
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-semibold">پارہ {currentJuz} کا متن تیار ہو رہا ہے...</p>
            <p className="text-xs opacity-70">Opening pure Mushaf reading layout...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Traditional Top Quran Manuscript Frame */}
            <div className={`p-4 rounded-xl border ${activeTheme.border} ${activeTheme.banner} text-center space-y-1 relative overflow-hidden`}>
              <div className="flex items-center justify-between text-xs font-semibold px-2">
                <span className="font-mono">Para {juzInfo.number}</span>
                <span className="font-arabic text-lg font-bold text-emerald-800 dark:text-emerald-400">
                  {juzInfo.arabicName}
                </span>
                <span className="font-mono">{juzInfo.totalVerses} Ayahs</span>
              </div>
            </div>

            {/* Continuous Arabic Mushaf Text */}
            <div
              className="font-arabic leading-[2.6] tracking-wide text-right dir-rtl select-text text-justify"
              style={{ fontSize: `${readingSettings.arabicFontSize}px` }}
            >
              {ayahs.map((ayah, idx) => {
                const prevAyah = idx > 0 ? ayahs[idx - 1] : null;
                const isNewSurah = !prevAyah || prevAyah.surahNumber !== ayah.surahNumber;

                return (
                  <React.Fragment key={ayah.number}>
                    {/* Surah Banner when a new Surah starts */}
                    {isNewSurah && (
                      <div className="my-8 block text-center clear-both">
                        <div className={`inline-block py-2.5 px-8 rounded-xl border ${activeTheme.border} ${activeTheme.banner} shadow-xs`}>
                          <span className="font-arabic text-xl font-bold text-emerald-900 dark:text-emerald-300 block">
                            سُورَةُ {ayah.surahNameArabic || ayah.surahNameEnglish}
                          </span>
                          <span className="text-[11px] font-sans-ui block text-stone-500 dark:text-stone-400">
                            {ayah.surahNameEnglish}
                          </span>
                        </div>

                        {ayah.surahNumber !== 9 && (
                          <div className="font-arabic text-2xl font-bold my-4 text-emerald-800 dark:text-emerald-400">
                            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                          </div>
                        )}
                      </div>
                    )}

                    {/* Ayah Content */}
                    <span
                      onClick={() => setSelectedAyahForDetails(ayah)}
                      className="cursor-pointer hover:bg-emerald-500/10 rounded px-1 transition-colors inline"
                      title={`Click for Ayah ${ayah.surahNumber}:${ayah.numberInSurah} details & options`}
                    >
                      <TajweedParser
                        rawTajweedHtml={ayah.textTajweed}
                        fallbackArabicText={ayah.textArabic}
                        enableTajweedColors={readingSettings.showTajweed}
                        fontSize={readingSettings.arabicFontSize}
                      />

                      {/* Traditional Ayah Stop Rosette */}
                      <span className="inline-flex items-center justify-center w-8 h-8 mx-1 text-xs font-mono font-bold rounded-full border border-amber-600/50 text-amber-800 dark:text-amber-400 bg-amber-500/10 align-middle">
                        {ayah.numberInSurah}
                      </span>
                    </span>

                    {/* Optional Inline Translations if showOnlyArabic is toggled off */}
                    {!showOnlyArabic && (
                      <div className="my-2.5 p-3 rounded-lg bg-black/5 dark:bg-white/5 text-left dir-ltr space-y-1 text-xs">
                        {readingSettings.showUrdu && ayah.translationUrdu && (
                          <p className="font-arabic text-right dir-rtl text-sm leading-relaxed text-emerald-900 dark:text-emerald-300">
                            {ayah.translationUrdu}
                          </p>
                        )}
                        {readingSettings.showHindi && ayah.translationHindi && (
                          <p className="font-sans-ui text-stone-700 dark:text-stone-300">
                            {ayah.translationHindi}
                          </p>
                        )}
                        {readingSettings.showEnglish && ayah.translationEnglish && (
                          <p className="font-sans-ui text-stone-600 dark:text-stone-400 italic">
                            {ayah.translationEnglish}
                          </p>
                        )}
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Selected Ayah Modal Drawer (when clicked for quick bookmark / copy) */}
      {selectedAyahForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-2xl p-5 max-w-lg w-full space-y-4 text-stone-900 dark:text-stone-100">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <span className="text-xs font-semibold">
                {selectedAyahForDetails.surahNameEnglish} · Ayah {selectedAyahForDetails.numberInSurah} (Para {selectedAyahForDetails.juz})
              </span>
              <button
                onClick={() => setSelectedAyahForDetails(null)}
                className="text-stone-400 hover:text-stone-600 text-xs px-2 py-1 rounded"
              >
                Close ✕
              </button>
            </div>

            <div className="font-arabic text-xl leading-relaxed text-right dir-rtl py-2">
              {selectedAyahForDetails.textArabic}
            </div>

            {selectedAyahForDetails.translationUrdu && (
              <p className="font-arabic text-right dir-rtl text-sm text-stone-700 dark:text-stone-300 border-t border-stone-100 dark:border-stone-800 pt-2">
                {selectedAyahForDetails.translationUrdu}
              </p>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
              <button
                onClick={() => {
                  onToggleBookmark(selectedAyahForDetails);
                  setSelectedAyahForDetails(null);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 text-white rounded-lg hover:bg-emerald-900 transition-colors"
              >
                <BookmarkIcon className="w-3.5 h-3.5" />
                <span>
                  {isBookmarked(selectedAyahForDetails.number) ? 'Remove Bookmark' : 'Save Bookmark (نشان لگائیں)'}
                </span>
              </button>

              <button
                onClick={() => handleCopyAyah(selectedAyahForDetails)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 dark:bg-stone-800 rounded-lg hover:bg-stone-200 transition-colors"
              >
                {copiedAyahNum === selectedAyahForDetails.number ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>Copy Verse</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation for Pure Reading (Para Switching) */}
      <div className={`p-4 border-t ${activeTheme.border} flex items-center justify-between`}>
        <button
          onClick={() => onSelectJuz(Math.max(1, currentJuz - 1))}
          disabled={currentJuz <= 1}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>پچھلا پارہ (Para {Math.max(1, currentJuz - 1)})</span>
        </button>

        <span className="text-xs font-mono opacity-60">
          Para {currentJuz} of 30 · {juzInfo.transliteration}
        </span>

        <button
          onClick={() => onSelectJuz(Math.min(30, currentJuz + 1))}
          disabled={currentJuz >= 30}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30 transition-colors"
        >
          <span>اگلا پارہ (Para {Math.min(30, currentJuz + 1)})</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
