import React, { useState, useEffect } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { downloadAll30Paras, getDownloadedParasCount } from '../services/quranApi';
import {
  Download,
  X,
  Smartphone,
  Share,
  PlusSquare,
  MoreVertical,
  Monitor,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  HardDriveDownload,
  CheckCircle2,
  RefreshCw,
  Sparkles
} from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [modalTab, setModalTab] = useState<'app' | 'offline'>('app');
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeGuideTab, setActiveGuideTab] = useState<'android' | 'ios' | 'desktop'>(
    isIOS ? 'ios' : isAndroid ? 'android' : 'android'
  );

  // Offline download state
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<{ current: number; total: number }>({
    current: 0,
    total: 30
  });
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadedCount, setDownloadedCount] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      setDownloadedCount(getDownloadedParasCount());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    const success = await install();
    if (success) {
      onClose();
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleStartOfflineDownload = async () => {
    setIsDownloadingAll(true);
    setDownloadSuccess(false);
    try {
      await downloadAll30Paras((current, total) => {
        setDownloadProgress({ current, total });
        setDownloadedCount(current);
      });
      setDownloadSuccess(true);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsDownloadingAll(false);
      setDownloadedCount(getDownloadedParasCount());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 dark:bg-emerald-950 flex items-center justify-center text-emerald-950 dark:text-emerald-400 shrink-0 shadow-xs">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <span>ڈاؤنلوڈ ایپ · Download App</span>
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                اپنے موبائل پر انسٹال کریں اور بغیر انٹرنیٹ 30 پارے پڑھیں
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Top Switcher: Install App vs Offline Download */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-950/60 text-xs font-semibold">
          <button
            onClick={() => setModalTab('app')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-all ${
              modalTab === 'app'
                ? 'border-emerald-700 text-emerald-800 dark:text-emerald-400 bg-white dark:bg-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>1. موبائل ایپ انسٹال کریں (Install App)</span>
          </button>

          <button
            onClick={() => setModalTab('offline')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-all ${
              modalTab === 'offline'
                ? 'border-emerald-700 text-emerald-800 dark:text-emerald-400 bg-white dark:bg-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <HardDriveDownload className="w-4 h-4 text-amber-600" />
            <span>2. تمام 30 پارے ڈاؤنلوڈ کریں (Offline)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* App Preview Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50/70 to-teal-50/70 dark:from-stone-950 dark:to-stone-900 border border-emerald-200/60 dark:border-stone-800 flex items-center gap-4">
            <img
              src="/assets/aistudio/Gemini_Generated_Image_j8biewj8biewj8bi_ae784cb6.png"
              alt="Al-Quran App Icon"
              className="w-13 h-13 rounded-2xl object-cover border-2 border-emerald-700/60 shadow-xs shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 truncate">
                  Al-Quran Kareem by Hussain
                </h3>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 truncate">
                All 30 Paras with Color Tajweed & Audio Recitation
              </p>
              <span className="text-[11px] text-emerald-800 dark:text-emerald-400 font-semibold block mt-0.5">
                Created by Hussain Akhter
              </span>
            </div>
          </div>

          {modalTab === 'app' ? (
            <>
              {/* Direct 1-Click Install Button if supported by browser */}
              {isInstallable ? (
                <button
                  onClick={handleNativeInstall}
                  className="w-full py-3.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-sm flex items-center justify-center gap-2 transition-transform active:scale-98 shadow-md"
                >
                  <Download className="w-5 h-5 text-emerald-950" />
                  <span>ابھی ایپ ڈاؤنلوڈ / انسٹال کریں (Download App Now)</span>
                </button>
              ) : (
                <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl text-xs space-y-1">
                  <p className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                    <span>موبائل میں انسٹال کرنے کا طریقہ (How to Download App):</span>
                  </p>
                  <p className="text-amber-800/90 dark:text-amber-300/80 leading-relaxed">
                    اگر براہِ راست بٹن نظر نہ آئے تو نیچے دیے گئے 2 آسان مراحل کے ذریعے اپنے فون کی ہوم اسکرین پر شامل کریں:
                  </p>
                </div>
              )}

              {isInstalled && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-2.5 text-xs text-emerald-900 dark:text-emerald-200 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>یہ ایپ پہلے ہی آپ کے فون یا کمپیوٹر پر کامیابی سے انسٹال ہے!</span>
                </div>
              )}

              {/* Platform Instructions Selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-stone-700 dark:text-stone-300">
                  <span>اپنا ڈیوائس منتخب کریں:</span>
                  <div className="flex items-center gap-1 p-0.5 bg-stone-100 dark:bg-stone-800 rounded-lg">
                    <button
                      onClick={() => setActiveGuideTab('android')}
                      className={`px-3 py-1 rounded text-xs transition-colors ${
                        activeGuideTab === 'android'
                          ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-400 font-semibold shadow-xs'
                          : 'text-stone-500'
                      }`}
                    >
                      Android Phone
                    </button>
                    <button
                      onClick={() => setActiveGuideTab('ios')}
                      className={`px-3 py-1 rounded text-xs transition-colors ${
                        activeGuideTab === 'ios'
                          ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-400 font-semibold shadow-xs'
                          : 'text-stone-500'
                      }`}
                    >
                      iPhone / iPad
                    </button>
                    <button
                      onClick={() => setActiveGuideTab('desktop')}
                      className={`px-3 py-1 rounded text-xs transition-colors ${
                        activeGuideTab === 'desktop'
                          ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-400 font-semibold shadow-xs'
                          : 'text-stone-500'
                      }`}
                    >
                      PC / Laptop
                    </button>
                  </div>
                </div>

                {/* Android Guide */}
                {activeGuideTab === 'android' && (
                  <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-950 space-y-3.5 text-xs">
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 flex items-center justify-center font-bold font-mono shrink-0">
                        1
                      </span>
                      <div>
                        <span className="font-semibold text-stone-900 dark:text-stone-100 block">
                          کروم کے اوپر دائیں جانب 3 ڈاٹس (⋮) پر کلک کریں
                        </span>
                        <p className="text-stone-500 mt-0.5">
                          Open Chrome browser and tap the <strong>three dots (⋮)</strong> menu icon at top right.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 flex items-center justify-center font-bold font-mono shrink-0">
                        2
                      </span>
                      <div>
                        <span className="font-semibold text-stone-900 dark:text-stone-100 block">
                          &quot;Install app&quot; یا &quot;Add to Home screen&quot; منتخب کریں
                        </span>
                        <p className="text-stone-500 mt-0.5">
                          Tap <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong>. The app icon will appear on your phone home screen like a regular app!
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* iOS Guide */}
                {activeGuideTab === 'ios' && (
                  <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-950 space-y-3.5 text-xs">
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 flex items-center justify-center font-bold font-mono shrink-0">
                        1
                      </span>
                      <div>
                        <span className="font-semibold text-stone-900 dark:text-stone-100 block">
                          سفاری (Safari) میں نیچے Share (📤) بٹن پر ٹیپ کریں
                        </span>
                        <p className="text-stone-500 mt-0.5">
                          In Safari browser, tap the <strong>Share</strong> button (box with upward arrow) at the bottom toolbar.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 flex items-center justify-center font-bold font-mono shrink-0">
                        2
                      </span>
                      <div>
                        <span className="font-semibold text-stone-900 dark:text-stone-100 block">
                          نیچے اسکرول کر کے &quot;Add to Home Screen&quot; دبائیں
                        </span>
                        <p className="text-stone-500 mt-0.5">
                          Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong>, then tap <strong>Add</strong> at top right.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Desktop Guide */}
                {activeGuideTab === 'desktop' && (
                  <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-950 space-y-3.5 text-xs">
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 flex items-center justify-center font-bold font-mono shrink-0">
                        1
                      </span>
                      <div>
                        <span className="font-semibold text-stone-900 dark:text-stone-100 block">
                          ایڈریس بار میں انسٹال آئیکون (📥) دبائیں
                        </span>
                        <p className="text-stone-500 mt-0.5">
                          Click the <strong>Install icon (📥)</strong> in Chrome or Edge address bar on the right side.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 flex items-center justify-center font-bold font-mono shrink-0">
                        2
                      </span>
                      <div>
                        <span className="font-semibold text-stone-900 dark:text-stone-100 block">
                          Install پر کلک کریں
                        </span>
                        <p className="text-stone-500 mt-0.5">
                          Click Install to open the app in a standalone distraction-free window.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Copy Direct Link Section */}
              <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <span className="font-semibold text-stone-900 dark:text-stone-100 block truncate">
                    موبائل براؤزر میں کھولنے کے لیے لنک کاپی کریں
                  </span>
                  <span className="text-[11px] text-stone-400 truncate block">
                    Copy link to open in mobile Chrome or share on WhatsApp
                  </span>
                </div>

                <button
                  onClick={copyShareLink}
                  className="px-3.5 py-1.5 rounded-lg bg-stone-200 dark:bg-stone-800 hover:bg-emerald-700 hover:text-white transition-colors shrink-0 flex items-center gap-1.5 font-medium"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </>
          ) : (
            /* Offline 30 Paras Download Tab */
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardDriveDownload className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-sm text-stone-900 dark:text-stone-100">
                      پورے 30 پارے آف لائن محفوظ کریں
                    </span>
                  </div>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    {downloadedCount} / 30 Downloaded
                  </span>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  ایک بار تمام 30 پارے ڈاؤنلوڈ کر لیں، اس کے بعد سفر میں یا بغیر انٹرنیٹ کے بھی آپ بلا روک ٹوک مکمل قرآن پاک تجوید کے ساتھ پڑھ سکتے ہیں۔
                </p>

                {/* Progress Bar if downloading */}
                {isDownloadingAll && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 font-medium text-emerald-800 dark:text-emerald-400">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>ڈاؤنلوڈ جاری ہے: پارہ {downloadProgress.current} از 30...</span>
                      </span>
                      <span className="font-mono font-bold">
                        {Math.round((downloadProgress.current / downloadProgress.total) * 100)}%
                      </span>
                    </div>

                    <div className="w-full bg-stone-200 dark:bg-stone-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${(downloadProgress.current / downloadProgress.total) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                )}

                {downloadSuccess && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-2.5 text-xs text-emerald-900 dark:text-emerald-200 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>ماشاء اللہ! تمام 30 پارے کامیابی سے ڈاؤنلوڈ ہو چکے ہیں اور آف لائن دستیاب ہیں۔</span>
                  </div>
                )}

                {!isDownloadingAll && (
                  <button
                    onClick={handleStartOfflineDownload}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>
                      {downloadedCount >= 30
                        ? 'دوبارہ تمام 30 پارے ڈاؤنلوڈ / اپ ڈیٹ کریں'
                        : 'تمام 30 پارے آف لائن ڈاؤنلوڈ کریں (Download 30 Paras)'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>PWA Fast & Offline Ready</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors"
          >
            بند کریں (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
