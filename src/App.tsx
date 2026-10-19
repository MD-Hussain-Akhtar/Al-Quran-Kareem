import React, { useState, useEffect, useCallback } from 'react';
import { Ayah, ReadingSettings, Bookmark, AudioPlaybackState, SurahInfo } from './types/quran';
import { JUZ_LIST } from './data/juzData';
import { SURAH_LIST } from './data/surahData';
import { Header } from './components/Header';
import { JuzSelector } from './components/JuzSelector';
import { SurahSelector } from './components/SurahSelector';
import { QuranReader } from './components/QuranReader';
import { MushafReader } from './components/MushafReader';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { TajweedGuideModal } from './components/TajweedGuideModal';
import { KhatamTracker } from './components/KhatamTracker';
import { BookmarksModal } from './components/BookmarksModal';
import { InstallAppModal } from './components/InstallAppModal';
import { fetchJuzData } from './services/quranApi';
import { audioManager } from './services/audioService';
import {
  Sparkles,
  BookOpen,
  Volume2,
  BookMarked,
  Bookmark as BookmarkIcon,
  Award,
  ArrowRight,
  ShieldCheck,
  Compass,
  Download
} from 'lucide-react';

const LAST_READ_JUZ_KEY = 'quran_last_read_juz_v1';
const BOOKMARKS_KEY = 'quran_saved_bookmarks_v1';
const SETTINGS_KEY = 'quran_reading_settings_v1';

const DEFAULT_SETTINGS: ReadingSettings = {
  arabicFontSize: 30,
  translationFontSize: 15,
  showTajweed: true,
  showUrdu: true,
  showHindi: true,
  showEnglish: true,
  showTransliteration: false,
  readingView: 'ayah-by-ayah',
  autoScrollWithAudio: true
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<'paras' | 'surahs' | 'reader' | 'mushaf'>('paras');
  const [currentJuz, setCurrentJuz] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LAST_READ_JUZ_KEY);
      return saved ? Number(saved) : 1;
    } catch {
      return 1;
    }
  });

  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [isLoadingAyahs, setIsLoadingAyahs] = useState<boolean>(true);

  const [readingSettings, setReadingSettings] = useState<ReadingSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    try {
      const saved = localStorage.getItem(BOOKMARKS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [audioState, setAudioState] = useState<AudioPlaybackState>(audioManager.getState());

  // Modal states
  const [isTajweedGuideOpen, setIsTajweedGuideOpen] = useState(false);
  const [isKhatamTrackerOpen, setIsKhatamTrackerOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // Subscribe to audio player changes
  useEffect(() => {
    const unsubscribe = audioManager.subscribe((state) => {
      setAudioState(state);
    });
    return unsubscribe;
  }, []);

  // Save last read Juz
  useEffect(() => {
    try {
      localStorage.setItem(LAST_READ_JUZ_KEY, currentJuz.toString());
    } catch {
      // ignore
    }
  }, [currentJuz]);

  // Save settings
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(readingSettings));
    } catch {
      // ignore
    }
  }, [readingSettings]);

  // Save bookmarks
  useEffect(() => {
    try {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    } catch {
      // ignore
    }
  }, [bookmarks]);

  // Load ayahs when currentJuz changes
  const loadJuz = useCallback(async (juzNum: number) => {
    setIsLoadingAyahs(true);
    try {
      const data = await fetchJuzData(juzNum);
      setAyahs(data);
      audioManager.setAyahList(data);
    } catch (err) {
      console.error('Error fetching Juz data:', err);
    } finally {
      setIsLoadingAyahs(false);
    }
  }, []);

  useEffect(() => {
    loadJuz(currentJuz);
  }, [currentJuz, loadJuz]);

  const handleSelectTab = (tab: 'paras' | 'surahs' | 'reader' | 'mushaf') => {
    if (tab === 'mushaf') {
      audioManager.pause();
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectJuz = (juzNumber: number, targetMode: 'reader' | 'mushaf' = 'mushaf') => {
    setCurrentJuz(juzNumber);
    if (targetMode === 'mushaf') {
      audioManager.pause();
    }
    setCurrentTab(targetMode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSurah = (surah: SurahInfo) => {
    setCurrentJuz(surah.juzNumber);
    setCurrentTab('mushaf');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleBookmark = (ayah: Ayah) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.globalAyahNumber === ayah.number);
      if (exists) {
        return prev.filter((b) => b.globalAyahNumber !== ayah.number);
      } else {
        const newBm: Bookmark = {
          id: `${ayah.number}-${Date.now()}`,
          surahNumber: ayah.surahNumber,
          ayahNumberInSurah: ayah.numberInSurah,
          globalAyahNumber: ayah.number,
          surahName: ayah.surahNameEnglish || `Surah ${ayah.surahNumber}`,
          juzNumber: ayah.juz,
          arabicTextPreview: ayah.textArabic.slice(0, 80),
          createdAt: Date.now()
        };
        return [newBm, ...prev];
      }
    });
  };

  const handleRemoveBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const handleNavigateToBookmark = (bm: Bookmark) => {
    setCurrentJuz(bm.juzNumber);
    setCurrentTab('reader');
  };

  const handleUpdateSettings = (updated: Partial<ReadingSettings>) => {
    setReadingSettings((prev) => ({ ...prev, ...updated }));
  };

  const currentJuzMeta = JUZ_LIST.find((j) => j.number === currentJuz) || JUZ_LIST[0];

  return (
    <div className="min-h-screen bg-[#fbfaf8] dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans-ui selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navigation */}
      <Header
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenTajweedGuide={() => setIsTajweedGuideOpen(true)}
        onOpenKhatamTracker={() => setIsKhatamTrackerOpen(true)}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        bookmarkCount={bookmarks.length}
      />

      {/* Prominent Download App Announcement Banner */}
      <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 dark:from-emerald-950 dark:via-emerald-900 dark:to-emerald-950 text-emerald-950 dark:text-emerald-100 py-2 px-3 sm:px-6 border-b border-amber-500/40 dark:border-emerald-800 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-800 dark:bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-900 dark:bg-emerald-300"></span>
            </span>
            <span className="font-bold">📱 Download App (ڈاؤنلوڈ ایپ):</span>
            <span className="hidden sm:inline">
              قرآن پاک ایپ کو اپنے موبائل پر انسٹال کریں اور بغیر انٹرنیٹ تمام 30 پارے تجوید کے ساتھ پڑھیں
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsInstallModalOpen(true)}
              className="px-3 py-1 rounded-md bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-transform active:scale-95"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Download App Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        {/* Welcome Hero on 30 Paras Tab */}
        {currentTab === 'paras' && (
          <div className="mb-8 rounded-2xl border border-emerald-900/10 dark:border-emerald-850/30 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 sm:p-8 shadow-sm relative overflow-hidden">
            {/* Subtle Islamic arabesque watermark element */}
            <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-end pr-6 font-arabic text-9xl select-none">
              قرآن
            </div>

            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="flex items-center gap-2 text-xs text-emerald-200">
                <span className="font-arabic text-base">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
                <span>·</span>
                <span>30 Paras Quran Reader & Audio Tilawat</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                القرآن الكريم · پڑھیں، سنیں اور تجوید سیکھیں
              </h1>

              <p className="text-sm text-emerald-100/90 leading-relaxed">
                قرآنِ مجید کے تمام 30 پارے مکمل تجوید کے ساتھ پڑھیں — بغیر آڈیو کے پرسکون تلاوت یا مایہ ناز قراء کی تجوید آڈیو کے ساتھ۔
              </p>

              {/* Fast Action Buttons in Hero */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {/* 1. Read Quran without listening */}
                <button
                  onClick={() => handleSelectTab('mushaf')}
                  className="px-5 py-2.5 text-xs font-bold text-emerald-950 bg-white hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                  title="Read 30 Paras Quran without audio"
                >
                  <BookMarked className="w-4 h-4 text-emerald-800" />
                  <span>Read Quran (صرف تلاوت)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {/* 2. Download / Install App */}
                <button
                  onClick={() => setIsInstallModalOpen(true)}
                  className="px-4 py-2.5 text-xs font-bold text-emerald-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                  title="Download and install app on your phone"
                >
                  <Download className="w-4 h-4 text-emerald-950" />
                  <span>Download App (ڈاؤنلوڈ ایپ)</span>
                </button>

                {/* 3. Listen & Read with audio */}
                <button
                  onClick={() => handleSelectTab('reader')}
                  className="px-4 py-2.5 text-xs font-medium text-emerald-100 bg-emerald-800/80 hover:bg-emerald-700/80 border border-emerald-600/40 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Volume2 className="w-4 h-4 text-amber-300" />
                  <span>Listen Audio (سنیں)</span>
                </button>

                {/* 4. Tajweed Rules */}
                <button
                  onClick={() => setIsTajweedGuideOpen(true)}
                  className="px-3.5 py-2.5 text-xs font-medium text-emerald-200 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>تجوید قواعد</span>
                </button>
              </div>

              {/* Quick Trust / Feature Indicators & Creator Badge */}
              <div className="pt-3 border-t border-emerald-700/50 flex flex-wrap items-center justify-between gap-4 text-xs text-emerald-200">
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Pure Silent Reading Mode</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Color-Coded Tajweed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Sheikh Al-Husary Recitation</span>
                  </div>
                </div>

                {/* Creator Attribution in Hero */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-white">
                  <img
                    src="/assets/aistudio/Gemini_Generated_Image_j8biewj8biewj8bi_ae784cb6.png"
                    alt="Created by Hussain Akhter"
                    className="w-6 h-6 rounded-full object-cover border border-amber-300"
                  />
                  <span className="text-[11px] font-medium text-emerald-100">
                    Created by <strong className="font-semibold text-white">Hussain Akhter</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Switching */}
        {currentTab === 'paras' && (
          <JuzSelector
            currentJuz={currentJuz}
            onSelectJuz={handleSelectJuz}
          />
        )}

        {currentTab === 'surahs' && (
          <SurahSelector onSelectSurah={handleSelectSurah} />
        )}

        {/* Pure Silent Mushaf Reading Mode (No Audio) */}
        {currentTab === 'mushaf' && (
          <MushafReader
            currentJuz={currentJuz}
            ayahs={ayahs}
            isLoading={isLoadingAyahs}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            onSelectJuz={(num) => handleSelectJuz(num, 'mushaf')}
            readingSettings={readingSettings}
            onUpdateSettings={handleUpdateSettings}
            onOpenTajweedGuide={() => setIsTajweedGuideOpen(true)}
            onSwitchToAudio={() => handleSelectTab('reader')}
          />
        )}

        {/* Audio Tilawat Mode (Listen & Read with Audio Sync) */}
        {currentTab === 'reader' && (
          <QuranReader
            currentJuz={currentJuz}
            ayahs={ayahs}
            isLoading={isLoadingAyahs}
            audioState={audioState}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            onPrevJuz={() => setCurrentJuz((prev) => Math.max(1, prev - 1))}
            onNextJuz={() => setCurrentJuz((prev) => Math.min(30, prev + 1))}
            onOpenTajweedGuide={() => setIsTajweedGuideOpen(true)}
            readingSettings={readingSettings}
            onUpdateSettings={handleUpdateSettings}
            onSwitchToSilentRead={() => handleSelectTab('mushaf')}
          />
        )}
      </main>

      {/* Floating Side Attribution Badge */}
      <aside
        aria-label="Creator credit"
        className="fixed right-0 top-1/2 -translate-y-1/2 z-20 hidden lg:block"
      >
        <div className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-l-2 border-y border-emerald-600 dark:border-emerald-500 shadow-lg py-2.5 px-3 rounded-l-xl flex items-center gap-2.5 transition-all hover:translate-x-[-4px]">
          <img
            src="/assets/aistudio/Gemini_Generated_Image_j8biewj8biewj8bi_ae784cb6.png"
            alt="Hussain Akhter"
            className="w-8 h-8 rounded-full object-cover border-2 border-emerald-600/50 shadow-xs shrink-0"
          />
          <div className="text-left">
            <span className="text-[10px] text-stone-500 dark:text-stone-400 block font-medium uppercase tracking-wider">
              Designed & Built
            </span>
            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 whitespace-nowrap block">
              Created by Hussain Akhter
            </span>
            <button
              onClick={() => setIsInstallModalOpen(true)}
              className="mt-1 flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline"
            >
              <Download className="w-3 h-3" />
              <span>Install / Download</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-stone-200 dark:border-stone-850 text-center text-xs text-stone-500 pb-28">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <img
              src="/assets/aistudio/Gemini_Generated_Image_j8biewj8biewj8bi_ae784cb6.png"
              alt="Hussain Akhter"
              className="w-5 h-5 rounded-full object-cover"
            />
            <span className="font-semibold text-stone-800 dark:text-stone-200">
              Al-Quran Kareem
            </span>
            <span>·</span>
            <span>Created by <strong className="text-emerald-800 dark:text-emerald-400 font-semibold">Hussain Akhter</strong></span>
          </div>

          <button
            onClick={() => setIsInstallModalOpen(true)}
            className="flex items-center gap-1.5 text-xs text-emerald-800 dark:text-emerald-400 font-semibold hover:underline"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download App (ڈاؤنلوڈ ایپ)</span>
          </button>

          <span className="text-[11px] text-stone-400 font-arabic" dir="rtl">
            صَدَقَ اللّٰهُ الْعَظِيمُ وَبَلَّغَ رَسُولُهُ الْكَرِيمُ
          </span>
        </div>
      </footer>

      {/* Global Bottom Audio Player (Hidden in pure silent reading mode) */}
      {currentTab !== 'mushaf' && (
        <AudioPlayerBar audioState={audioState} currentAyahs={ayahs} />
      )}

      {/* Floating Download App Action Button (Always Accessible) */}
      <button
        onClick={() => setIsInstallModalOpen(true)}
        className={`fixed right-4 sm:right-6 z-40 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-full shadow-xl border-2 border-amber-500/50 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 ${
          currentTab !== 'mushaf' ? 'bottom-20 sm:bottom-24' : 'bottom-6'
        }`}
        title="Download Al-Quran App on Mobile or Desktop"
      >
        <Download className="w-4 h-4 text-emerald-950 stroke-[2.5]" />
        <span>Download App</span>
      </button>

      {/* Modals */}
      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      <TajweedGuideModal
        isOpen={isTajweedGuideOpen}
        onClose={() => setIsTajweedGuideOpen(false)}
      />

      <KhatamTracker
        isOpen={isKhatamTrackerOpen}
        onClose={() => setIsKhatamTrackerOpen(false)}
        onSelectJuz={handleSelectJuz}
      />

      <BookmarksModal
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        onRemoveBookmark={handleRemoveBookmark}
        onNavigateToBookmark={handleNavigateToBookmark}
      />
    </div>
  );
}
