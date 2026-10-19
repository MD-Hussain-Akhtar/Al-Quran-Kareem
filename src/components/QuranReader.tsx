import React, { useEffect, useRef, useState } from 'react';
import { Ayah, ReadingSettings, AudioPlaybackState, Bookmark } from '../types/quran';
import { JUZ_LIST } from '../data/juzData';
import { TajweedParser } from './TajweedParser';
import { audioManager } from '../services/audioService';
import {
  Play,
  Pause,
  Bookmark as BookmarkIcon,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Sparkles,
  BookOpen,
  Volume2,
  BookMarked,
  Share2
} from 'lucide-react';

interface QuranReaderProps {
  currentJuz: number;
  ayahs: Ayah[];
  isLoading: boolean;
  audioState: AudioPlaybackState;
  bookmarks: Bookmark[];
  onToggleBookmark: (ayah: Ayah) => void;
  onPrevJuz: () => void;
  onNextJuz: () => void;
  onOpenTajweedGuide: () => void;
  readingSettings: ReadingSettings;
  onUpdateSettings: (settings: Partial<ReadingSettings>) => void;
  onSwitchToSilentRead?: () => void;
}

export const QuranReader: React.FC<QuranReaderProps> = ({
  currentJuz,
  ayahs,
  isLoading,
  audioState,
  bookmarks,
  onToggleBookmark,
  onPrevJuz,
  onNextJuz,
  onOpenTajweedGuide,
  readingSettings,
  onUpdateSettings,
  onSwitchToSilentRead
}) => {
  const [copiedAyahNum, setCopiedAyahNum] = useState<number | null>(null);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const ayahRefs = useRef<Map<number, HTMLElement>>(new Map());

  const juzInfo = JUZ_LIST.find((j) => j.number === currentJuz) || JUZ_LIST[0];

  // Auto-scroll to currently playing Ayah
  useEffect(() => {
    if (!readingSettings.autoScrollWithAudio || audioState.currentAyahNumber === null) return;

    const el = ayahRefs.current.get(audioState.currentAyahNumber);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [audioState.currentAyahNumber, readingSettings.autoScrollWithAudio]);

  const copyAyahText = (ayah: Ayah) => {
    const textToCopy = `${ayah.textArabic}\n\n${ayah.translationUrdu ? `اردو: ${ayah.translationUrdu}\n` : ''}${ayah.translationHindi ? `हिन्दी: ${ayah.translationHindi}\n` : ''}${ayah.translationEnglish ? `English: ${ayah.translationEnglish}\n` : ''}\n[Surah ${ayah.surahNameEnglish || ayah.surahNumber}:${ayah.numberInSurah} - Para ${ayah.juz}]`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedAyahNum(ayah.number);
    setTimeout(() => setCopiedAyahNum(null), 2000);
  };

  const isAyahBookmarked = (ayahNum: number) => {
    return bookmarks.some((b) => b.globalAyahNumber === ayahNum);
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Juz Banner & Reader Toolbar */}
      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Para Info */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                Para {juzInfo.number} of 30
              </span>
              <span className="text-stone-300 dark:text-stone-700">·</span>
              <span className="text-xs text-stone-500 font-mono">
                {juzInfo.totalVerses} Verses
              </span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                {juzInfo.transliteration}
              </h1>
              <span className="font-arabic text-2xl font-bold text-emerald-800 dark:text-emerald-400" dir="rtl">
                {juzInfo.arabicName}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-xl">
              {juzInfo.description}
            </p>
          </div>

          {/* Quick Para Navigation & Reader Settings Trigger */}
          <div className="flex items-center gap-2">
            <button
              onClick={onPrevJuz}
              disabled={currentJuz <= 1}
              className="p-2 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-900 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Previous Para"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={onNextJuz}
              disabled={currentJuz >= 30}
              className="p-2 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-900 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Next Para"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {onSwitchToSilentRead && (
              <button
                onClick={onSwitchToSilentRead}
                className="px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-stone-100 hover:bg-stone-200 dark:bg-stone-900 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                title="Switch to silent reading mode without audio"
              >
                <BookMarked className="w-3.5 h-3.5" />
                <span>صرف پڑھیں (Read Quran)</span>
              </button>
            )}

            <button
              onClick={onOpenTajweedGuide}
              className="px-3 py-1.5 text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tajweed Rules</span>
            </button>

            <button
              onClick={() => setShowSettingsPanel(!showSettingsPanel)}
              className={`p-2 border rounded-lg transition-colors ${
                showSettingsPanel
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-stone-900'
                  : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
              title="Reading Settings"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Collapsible Reading Settings Panel */}
        {showSettingsPanel && (
          <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Tajweed Color Toggle */}
            <div className="space-y-1.5">
              <span className="font-medium text-stone-700 dark:text-stone-300 block">
                تجوید رنگ (Tajweed Colors):
              </span>
              <button
                onClick={() => onUpdateSettings({ showTajweed: !readingSettings.showTajweed })}
                className={`w-full py-1.5 px-3 rounded-lg text-xs font-medium border transition-colors flex items-center justify-between ${
                  readingSettings.showTajweed
                    ? 'bg-emerald-800 text-white border-emerald-800'
                    : 'bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800'
                }`}
              >
                <span>{readingSettings.showTajweed ? 'Tajweed Active' : 'Plain Text'}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </button>
            </div>

            {/* Translation Toggles */}
            <div className="space-y-1.5">
              <span className="font-medium text-stone-700 dark:text-stone-300 block">
                ترجمہ (Translations):
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onUpdateSettings({ showUrdu: !readingSettings.showUrdu })}
                  className={`flex-1 py-1 px-2 rounded border text-xs ${
                    readingSettings.showUrdu
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800 font-medium'
                      : 'bg-stone-50 dark:bg-stone-900 text-stone-500 border-stone-200 dark:border-stone-800'
                  }`}
                >
                  اردو
                </button>
                <button
                  onClick={() => onUpdateSettings({ showHindi: !readingSettings.showHindi })}
                  className={`flex-1 py-1 px-2 rounded border text-xs ${
                    readingSettings.showHindi
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800 font-medium'
                      : 'bg-stone-50 dark:bg-stone-900 text-stone-500 border-stone-200 dark:border-stone-800'
                  }`}
                >
                  हिन्दी
                </button>
                <button
                  onClick={() => onUpdateSettings({ showEnglish: !readingSettings.showEnglish })}
                  className={`flex-1 py-1 px-2 rounded border text-xs ${
                    readingSettings.showEnglish
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800 font-medium'
                      : 'bg-stone-50 dark:bg-stone-900 text-stone-500 border-stone-200 dark:border-stone-800'
                  }`}
                >
                  Eng
                </button>
              </div>
            </div>

            {/* Arabic Font Size Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-stone-700 dark:text-stone-300">
                <span className="font-medium">عربی فونٹ سائز:</span>
                <span className="font-mono">{readingSettings.arabicFontSize}px</span>
              </div>
              <input
                type="range"
                min="24"
                max="44"
                step="2"
                value={readingSettings.arabicFontSize}
                onChange={(e) => onUpdateSettings({ arabicFontSize: Number(e.target.value) })}
                className="w-full accent-emerald-700 h-1.5 bg-stone-200 dark:bg-stone-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Reading View & Auto-Scroll */}
            <div className="space-y-1.5">
              <span className="font-medium text-stone-700 dark:text-stone-300 block">
                تلاوت موڈ (View):
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onUpdateSettings({ readingView: 'ayah-by-ayah' })}
                  className={`flex-1 py-1 px-2 rounded border text-xs ${
                    readingSettings.readingView === 'ayah-by-ayah'
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-stone-900'
                      : 'bg-stone-50 dark:bg-stone-900 text-stone-600 border-stone-200 dark:border-stone-800'
                  }`}
                >
                  آیت بہ آیت
                </button>
                <button
                  onClick={() => onUpdateSettings({ readingView: 'continuous-mushaf' })}
                  className={`flex-1 py-1 px-2 rounded border text-xs ${
                    readingSettings.readingView === 'continuous-mushaf'
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-stone-900'
                      : 'bg-stone-50 dark:bg-stone-900 text-stone-600 border-stone-200 dark:border-stone-800'
                  }`}
                >
                  مصحف متصل
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading Indicator */}
      {isLoading ? (
        <div className="p-16 text-center space-y-3 bg-white dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800">
          <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">
            پارہ {currentJuz} کی تلاوت و تجوید لوڈ ہو رہی ہے...
          </p>
          <p className="text-xs text-stone-500">
            Loading accurate Uthmanic text and Tajweed data...
          </p>
        </div>
      ) : readingSettings.readingView === 'continuous-mushaf' ? (
        /* Continuous Mushaf View */
        <div className="p-8 sm:p-12 rounded-2xl border border-stone-200 dark:border-stone-800 bg-[#fdfbf7] dark:bg-stone-950 shadow-xs leading-loose text-right dir-rtl">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center pb-6 border-b border-stone-200 dark:border-stone-850">
              <span className="font-arabic text-2xl font-bold text-emerald-800 dark:text-emerald-400">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </span>
            </div>

            <div
              className="font-arabic leading-[2.5] tracking-wide text-stone-900 dark:text-stone-100"
              style={{ fontSize: `${readingSettings.arabicFontSize}px` }}
            >
              {ayahs.map((ayah) => {
                const isPlaying = audioState.currentAyahNumber === ayah.number;

                return (
                  <span
                    key={ayah.number}
                    ref={(el) => {
                      if (el) ayahRefs.current.set(ayah.number, el);
                      else ayahRefs.current.delete(ayah.number);
                    }}
                    onClick={() => audioManager.playAyah(ayah, ayahs)}
                    className={`cursor-pointer transition-colors px-1 py-0.5 rounded ${
                      isPlaying
                        ? 'bg-amber-200/80 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200'
                        : 'hover:bg-emerald-50/50 dark:hover:bg-stone-900'
                    }`}
                  >
                    <TajweedParser
                      rawTajweedHtml={ayah.textTajweed}
                      fallbackArabicText={ayah.textArabic}
                      enableTajweedColors={readingSettings.showTajweed}
                      fontSize={readingSettings.arabicFontSize}
                    />
                    <span className="inline-flex items-center justify-center w-8 h-8 mx-1.5 rounded-full border border-amber-600/40 text-xs font-mono text-amber-800 dark:text-amber-400 align-middle">
                      {ayah.numberInSurah}
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Ayah by Ayah Detailed Card View */
        <div className="space-y-4">
          {ayahs.map((ayah, index) => {
            const isPlaying = audioState.currentAyahNumber === ayah.number;
            const bookmarked = isAyahBookmarked(ayah.number);

            // Show Surah Header when surah changes or at first ayah
            const prevAyah = index > 0 ? ayahs[index - 1] : null;
            const isNewSurah = !prevAyah || prevAyah.surahNumber !== ayah.surahNumber;

            return (
              <React.Fragment key={ayah.number}>
                {isNewSurah && (
                  <div className="my-6 p-6 rounded-2xl border border-emerald-900/10 dark:border-emerald-800/20 bg-linear-to-b from-emerald-50/60 to-white dark:from-emerald-950/20 dark:to-stone-950 text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 text-xs font-medium text-emerald-800 dark:text-emerald-400">
                      <span>سورة {ayah.surahNameArabic || ''}</span>
                      <span>·</span>
                      <span>{ayah.surahNameEnglish || `Surah ${ayah.surahNumber}`}</span>
                    </div>
                    {ayah.surahNumber !== 9 && (
                      <div className="font-arabic text-2xl font-bold text-stone-900 dark:text-stone-100 pt-1" dir="rtl">
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                      </div>
                    )}
                  </div>
                )}

                <div
                  ref={(el) => {
                    if (el) ayahRefs.current.set(ayah.number, el);
                    else ayahRefs.current.delete(ayah.number);
                  }}
                  className={`p-5 rounded-2xl border transition-all duration-200 ${
                    isPlaying
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/25 border-emerald-500 shadow-md ring-1 ring-emerald-500/50'
                      : 'bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-850 hover:border-stone-300 dark:hover:border-stone-800'
                  }`}
                >
                  {/* Top Ayah Meta Bar */}
                  <div className="flex items-center justify-between gap-3 pb-3 mb-3 border-b border-stone-100 dark:border-stone-900 text-xs text-stone-500">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-stone-100 dark:bg-stone-900 flex items-center justify-center text-xs font-mono font-bold text-stone-800 dark:text-stone-200">
                        {ayah.numberInSurah}
                      </div>
                      <span className="font-medium text-stone-800 dark:text-stone-200">
                        {ayah.surahNameEnglish || `Surah ${ayah.surahNumber}`}
                      </span>
                      <span>·</span>
                      <span className="font-mono">Ayah {ayah.numberInSurah}</span>
                    </div>

                    {/* Quick Ayah Actions */}
                    <div className="flex items-center gap-1">
                      {/* Play Ayah */}
                      <button
                        onClick={() => {
                          if (isPlaying && audioState.isPlaying) {
                            audioManager.pause();
                          } else {
                            audioManager.playAyah(ayah, ayahs);
                          }
                        }}
                        className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                          isPlaying && audioState.isPlaying
                            ? 'bg-emerald-800 text-white'
                            : 'hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-600 dark:text-stone-300'
                        }`}
                        title="Listen to this Ayah with Tajweed"
                      >
                        {isPlaying && audioState.isPlaying ? (
                          <Pause className="w-3.5 h-3.5 fill-current" />
                        ) : (
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        )}
                        <span className="text-[11px] font-medium hidden sm:inline">
                          {isPlaying && audioState.isPlaying ? 'Playing' : 'Listen'}
                        </span>
                      </button>

                      {/* Bookmark Ayah */}
                      <button
                        onClick={() => onToggleBookmark(ayah)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          bookmarked
                            ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50'
                            : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
                        }`}
                        title={bookmarked ? 'Bookmarked' : 'Add Bookmark'}
                      >
                        <BookmarkIcon className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
                      </button>

                      {/* Copy Ayah */}
                      <button
                        onClick={() => copyAyahText(ayah)}
                        className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 rounded-lg transition-colors"
                        title="Copy Ayah and Translations"
                      >
                        {copiedAyahNum === ayah.number ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Arabic Text with Tajweed Parser */}
                  <div className="py-2">
                    <TajweedParser
                      rawTajweedHtml={ayah.textTajweed}
                      fallbackArabicText={ayah.textArabic}
                      enableTajweedColors={readingSettings.showTajweed}
                      fontSize={readingSettings.arabicFontSize}
                    />
                  </div>

                  {/* Translations Container */}
                  <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-900 space-y-2.5">
                    {/* Urdu Translation */}
                    {readingSettings.showUrdu && ayah.translationUrdu && (
                      <div className="space-y-0.5 text-right dir-rtl">
                        <span className="text-[10px] text-emerald-800 dark:text-emerald-400 font-semibold block">
                          اردو ترجمہ (جالندھری):
                        </span>
                        <p
                          className="font-arabic text-stone-800 dark:text-stone-200 leading-relaxed"
                          style={{ fontSize: `${readingSettings.translationFontSize}px` }}
                        >
                          {ayah.translationUrdu}
                        </p>
                      </div>
                    )}

                    {/* Hindi Translation */}
                    {readingSettings.showHindi && ayah.translationHindi && (
                      <div className="space-y-0.5 text-left">
                        <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold block uppercase">
                          हिन्दी अनुवाद (फ़ारूक़ ख़ान):
                        </span>
                        <p
                          className="text-stone-800 dark:text-stone-200 leading-relaxed font-sans-ui"
                          style={{ fontSize: `${readingSettings.translationFontSize}px` }}
                        >
                          {ayah.translationHindi}
                        </p>
                      </div>
                    )}

                    {/* English Translation */}
                    {readingSettings.showEnglish && ayah.translationEnglish && (
                      <div className="space-y-0.5 text-left">
                        <span className="text-[10px] text-stone-500 font-semibold block uppercase">
                          English (Sahih Int.):
                        </span>
                        <p
                          className="text-stone-700 dark:text-stone-300 leading-relaxed font-sans-ui"
                          style={{ fontSize: `${readingSettings.translationFontSize}px` }}
                        >
                          {ayah.translationEnglish}
                        </p>
                      </div>
                    )}

                    {/* Transliteration */}
                    {readingSettings.showTransliteration && ayah.transliteration && (
                      <div className="space-y-0.5 text-left">
                        <span className="text-[10px] text-stone-400 font-semibold block uppercase">
                          Transliteration:
                        </span>
                        <p className="text-xs text-stone-500 italic">
                          {ayah.transliteration}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* Bottom Juz Navigation Footer */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950">
        <button
          onClick={onPrevJuz}
          disabled={currentJuz <= 1}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-900 rounded-lg disabled:opacity-40 hover:bg-stone-200 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>پچھلا پارہ (Para {Math.max(1, currentJuz - 1)})</span>
        </button>

        <span className="text-xs text-stone-500 font-mono">
          Para {currentJuz} / 30
        </span>

        <button
          onClick={onNextJuz}
          disabled={currentJuz >= 30}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-900 rounded-lg disabled:opacity-40 hover:bg-stone-200 transition-colors"
        >
          <span>اگلا پارہ (Para {Math.min(30, currentJuz + 1)})</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
