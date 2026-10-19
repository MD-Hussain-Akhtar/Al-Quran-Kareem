import React, { useState } from 'react';
import { TAJWEED_RULES, WAQF_SIGNS } from '../data/tajweedRules';
import { X, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';

interface TajweedGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TajweedGuideModal: React.FC<TajweedGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'rules' | 'waqf'>('rules');
  const [langPreference, setLangPreference] = useState<'ur' | 'hi' | 'en'>('ur');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-800 dark:text-emerald-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                قواعد التجويد · Tajweed & Tilawat Guide
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                تجوید کے بنیادی اصول، رنگین علامات اور تلفظ کا طریقہ
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 rounded-lg transition-colors hover:bg-stone-200 dark:hover:bg-stone-800"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-bar with Segmented Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-2.5 bg-stone-100/70 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
          {/* Section Tabs */}
          <div className="flex items-center gap-1 p-0.5 bg-stone-200/70 dark:bg-stone-800 rounded-lg">
            <button
              onClick={() => setActiveTab('rules')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'rules'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              حروف و قواعد (Tajweed Rules)
            </button>
            <button
              onClick={() => setActiveTab('waqf')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'waqf'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              رموز الاوقاف (Stop Signs)
            </button>
          </div>

          {/* Explanation Language Selector */}
          <div className="flex items-center gap-1 text-xs text-stone-600 dark:text-stone-400">
            <span className="text-[11px] font-medium mr-1">زبان / Language:</span>
            <button
              onClick={() => setLangPreference('ur')}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                langPreference === 'ur'
                  ? 'bg-emerald-700 text-white font-medium'
                  : 'hover:bg-stone-200 dark:hover:bg-stone-800'
              }`}
            >
              اردو
            </button>
            <button
              onClick={() => setLangPreference('hi')}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                langPreference === 'hi'
                  ? 'bg-emerald-700 text-white font-medium'
                  : 'hover:bg-stone-200 dark:hover:bg-stone-800'
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setLangPreference('en')}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                langPreference === 'en'
                  ? 'bg-emerald-700 text-white font-medium'
                  : 'hover:bg-stone-200 dark:hover:bg-stone-800'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'rules' ? (
            <div className="space-y-4">
              {TAJWEED_RULES.map((rule) => {
                const description =
                  langPreference === 'ur'
                    ? rule.descriptionUr
                    : langPreference === 'hi'
                    ? rule.descriptionHi
                    : rule.descriptionEn;

                return (
                  <div
                    key={rule.id}
                    className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950/60 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                          style={{ backgroundColor: rule.colorHex }}
                        />
                        <div>
                          <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                            {rule.name}
                          </h3>
                          <span className="text-xs text-stone-500 dark:text-stone-400 font-arabic">
                            {rule.nameArabic}
                          </span>
                        </div>
                      </div>

                      {rule.letters && (
                        <div className="flex items-center gap-1 font-arabic text-sm text-stone-800 dark:text-stone-200 dir-rtl">
                          {rule.letters.slice(0, 6).join(' · ')}
                          {rule.letters.length > 6 && <span className="text-xs text-stone-400"> +{rule.letters.length - 6}</span>}
                        </div>
                      )}
                    </div>

                    <p className={`text-xs leading-relaxed text-stone-700 dark:text-stone-300 ${langPreference === 'ur' ? 'font-arabic text-right leading-loose text-sm' : ''}`}>
                      {description}
                    </p>

                    {/* Example Box */}
                    <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-850 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-stone-500 uppercase tracking-wider block">
                          Example / مثال
                        </span>
                        <span className="text-xs text-stone-600 dark:text-stone-400 italic">
                          {rule.exampleTranslit}
                        </span>
                      </div>
                      <span className="font-arabic text-lg text-emerald-800 dark:text-emerald-400 font-semibold" dir="rtl">
                        {rule.exampleArabic}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-900/50 text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
                <span className="font-semibold block mb-0.5">وقف کے آداب (Rules of Stopping):</span>
                تلاوت کے دوران آیات کے درمیان درست جگہ ٹھہرنا قرآن فہمی اور تجوید کا لازمی حصہ ہے۔ درج ذیل رموز تلاوت میں وقف اور وصل کی رہنمائی کرتے ہیں۔
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {WAQF_SIGNS.map((sign, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 flex items-start gap-3.5"
                  >
                    <div className="w-9 h-9 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center font-arabic text-base font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
                      {sign.symbol}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                        {sign.name}
                      </h4>
                      <p className="text-xs text-stone-600 dark:text-stone-400">
                        {langPreference === 'ur' ? sign.meaningUr : sign.meaningEn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 flex items-center justify-between">
          <span className="text-xs text-stone-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Tajweed color-coding active in Tilawat mode</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-white bg-emerald-800 dark:bg-emerald-700 hover:bg-emerald-900 rounded-lg transition-colors"
          >
            سمجھ گیا (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
