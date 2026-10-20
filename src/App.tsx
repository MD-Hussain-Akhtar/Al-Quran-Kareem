import React, { useState, useEffect, useCallback } from 'react';
import { Ayah, ReadingSettings, Bookmark, AudioPlaybackState, SurahInfo } from './types/quran';
import { JUZ_LIST } from './data/juzData';
import { SURAH_LIST } from './data/surahData';
import { Header } from './components/Header';
import { JuzSelector } from './components/JuzSelector';
import { SurahSelector } from './components/SurahSelector';
import { QuranReader } from './components/QuranReader';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { FooterContact } from './components/FooterContact';
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
  Bookmark as BookmarkIcon,
  Award,
  ArrowRight,
  ShieldCheck,
  Mail,
  Phone,
  MessageSquare
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
  const [currentTab, setCurrentTab] = useState<'paras' | 'surahs' | 'reader'>('paras');
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

  const handleSelectTab = (tab: 'paras' | 'surahs' | 'reader') => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectJuz = (juzNumber: number) => {
    setCurrentJuz(juzNumber);
    setCurrentTab('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSurah = (surah: SurahInfo) => {
    setCurrentJuz(surah.juzNumber);
    setCurrentTab('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToContact = () => {
    const el = document.getElementById('contact-creator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
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
      {/* Top Navigation - Contains the ONLY Download App button */}
      <Header
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenTajweedGuide={() => setIsTajweedGuideOpen(true)}
        onOpenKhatamTracker={() => setIsKhatamTrackerOpen(true)}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        onScrollToContact={handleScrollToContact}
        bookmarkCount={bookmarks.length}
      />

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
                <span>30 Paras Quran Tilawat & Live Recitation Tracker</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                القرآن الكريم · سنیں، پڑھیں اور تجوید سیکھیں
              </h1>

              <p className="text-sm text-emerald-100/90 leading-relaxed">
                قرآنِ مجید کے تمام 30 پارے مکمل تجوید اور خوبصورت آڈیو کے ساتھ۔ جیسے جیسے آڈیو چلے گی، پڑھی جانے والی آیت لائیو ہائی لائٹ ہوگی تاکہ آپ باآسانی ساتھ ساتھ پڑھ سکیں۔
              </p>

              {/* Fast Action Buttons in Hero */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {/* 1. Open Quran Tilawat */}
                <button
                  onClick={() => handleSelectTab('reader')}
                  className="px-5 py-2.5 text-xs font-bold text-emerald-950 bg-white hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                  title="Open Quran Reader with Audio & Live Highlight"
                >
                  <Volume2 className="w-4 h-4 text-emerald-800" />
                  <span>تلاوت شروع کریں (پارہ {currentJuz})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {/* 2. Tajweed Rules */}
                <button
                  onClick={() => setIsTajweedGuideOpen(true)}
                  className="px-4 py-2.5 text-xs font-medium text-emerald-100 bg-emerald-800/80 hover:bg-emerald-700/80 border border-emerald-600/40 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>تجوید قواعد و رہنمائی</span>
                </button>
              </div>

              {/* Trust Indicators & Creator Badge */}
              <div className="pt-3 border-t border-emerald-700/50 flex flex-wrap items-center justify-between gap-4 text-xs text-emerald-200">
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Real-time Recitation Highlight</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Color-Coded Tajweed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Sheikh Mahmoud Al-Husary Recitation</span>
                  </div>
                </div>

                {/* Creator Attribution in Hero (Clickable to jump to contact) */}
                <button
                  onClick={handleScrollToContact}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-950 border border-emerald-500/30 text-white transition-colors"
                  title="Click to view Contact details"
                >
                  <img
                    src="/assets/aistudio/Gemini_Generated_Image_j8biewj8biewj8bi_ae784cb6.png"
                    alt="Created by Hussain Akhter"
                    className="w-6 h-6 rounded-full object-cover border border-amber-300"
                  />
                  <span className="text-[11px] font-medium text-emerald-100">
                    Created by <strong className="font-semibold text-white">Hussain Akhter</strong>
                  </span>
                  <span className="text-[10px] text-amber-300 ml-1">· Contact</span>
                </button>
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

        {/* Quran Reader with Audio & Live Real-time Recitation Highlighting */}
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
          />
        )}

        {/* Dedicated Contact Creator Section at Bottom */}
        <section id="contact-creator" className="pt-6">
          <FooterContact />
        </section>
      </main>

      {/* Floating Side Attribution Badge */}
      <aside
        aria-label="Creator credit"
        className="fixed right-0 top-1/2 -translate-y-1/2 z-20 hidden lg:block"
      >
        <button
          onClick={handleScrollToContact}
          className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-l-2 border-y border-emerald-600 dark:border-emerald-500 shadow-lg py-2.5 px-3 rounded-l-xl flex items-center gap-2.5 transition-all hover:translate-x-[-4px] text-left group"
          title="Click to contact creator Hussain Akhter"
        >
          <img
            src="/assets/aistudio/Gemini_Generated_Image_j8biewj8biewj8bi_ae784cb6.png"
            alt="Hussain Akhter"
            className="w-8 h-8 rounded-full object-cover border-2 border-emerald-600/50 shadow-xs shrink-0 group-hover:scale-105 transition-transform"
          />
          <div>
            <span className="text-[10px] text-stone-500 dark:text-stone-400 block font-medium uppercase tracking-wider">
              Designed & Built
            </span>
            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 whitespace-nowrap block">
              Created by Hussain Akhter
            </span>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
              <Phone className="w-2.5 h-2.5" />
              <span>Contact: 8210739639</span>
            </span>
          </div>
        </button>
      </aside>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-stone-200 dark:border-stone-850 text-center text-xs text-stone-500 pb-28 bg-white/50 dark:bg-stone-950/50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img
              src="/assets/aistudio/Gemini_Generated_Image_j8biewj8biewj8bi_ae784cb6.png"
              alt="Hussain Akhter"
              className="w-6 h-6 rounded-full object-cover border border-emerald-600/40"
            />
            <span className="font-semibold text-stone-800 dark:text-stone-200">
              Al-Quran Kareem
            </span>
            <span>·</span>
            <span>Created by <strong className="text-emerald-800 dark:text-emerald-400 font-semibold">Hussain Akhter</strong></span>
          </div>

          {/* Quick Direct Contact Links in Footer */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-medium">
            <a
              href="mailto:mhussainakhter@gmail.com"
              className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-400 hover:underline"
              title="Send email to mhussainakhter@gmail.com"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>mhussainakhter@gmail.com</span>
            </a>
            <span className="text-stone-300 dark:text-stone-700">|</span>
            <a
              href="tel:8210739639"
              className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-400 hover:underline"
              title="Call 8210739639"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>+91 8210739639</span>
            </a>
            <span className="text-stone-300 dark:text-stone-700">|</span>
            <a
              href="https://wa.me/918210739639"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp</span>
            </a>
          </div>

          <span className="text-[11px] text-stone-400 font-arabic" dir="rtl">
            صَدَقَ اللّٰهُ الْعَظِيمُ وَبَلَّغَ رَسُولُهُ الْكَرِيمُ
          </span>
        </div>
      </footer>

      {/* Global Bottom Audio Player */}
      <AudioPlayerBar audioState={audioState} currentAyahs={ayahs} />

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
