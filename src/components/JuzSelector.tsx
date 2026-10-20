import React, { useState } from 'react';
import { JUZ_LIST } from '../data/juzData';
import { JuzInfo } from '../types/quran';
import { Search, BookOpen, Layers, CheckCircle2, ArrowRight, Volume2, Sparkles } from 'lucide-react';

interface JuzSelectorProps {
  currentJuz: number;
  onSelectJuz: (juzNumber: number) => void;
  completedParas?: number[];
}

export const JuzSelector: React.FC<JuzSelectorProps> = ({
  currentJuz,
  onSelectJuz,
  completedParas = []
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredJuz = JUZ_LIST.filter((juz) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      juz.number.toString().includes(q) ||
      juz.transliteration.toLowerCase().includes(q) ||
      juz.arabicName.includes(q) ||
      juz.urduName.includes(q) ||
      juz.hindiName.toLowerCase().includes(q) ||
      juz.startSurahName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-850">
        <div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span>قرآنِ پاک کے 30 پارے</span>
            <span className="text-xs font-normal text-stone-500 font-sans-ui">
              (All 30 Paras / Juz)
            </span>
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            کسی بھی پارے کا انتخاب کریں — تلاوت سنیں اور ساتھ ساتھ لائیو ہائی لائٹ دیکھیں
          </p>
        </div>

        {/* Search & View Toggle */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search Para (1-30) / نام تلاش کریں..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-lg text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-600 w-56 sm:w-64"
            />
          </div>

          <div className="flex items-center bg-stone-100 dark:bg-stone-900 p-0.5 rounded-lg border border-stone-200 dark:border-stone-850">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
              title="Grid View"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
              title="List View"
            >
              <BookOpen className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid or List Rendering */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJuz.map((juz) => {
            const isSelected = currentJuz === juz.number;
            const isCompleted = completedParas.includes(juz.number);

            return (
              <div
                key={juz.number}
                onClick={() => onSelectJuz(juz.number)}
                className={`group p-4 sm:p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-md ring-1 ring-emerald-500/30'
                    : 'border-stone-200 dark:border-stone-850 bg-white dark:bg-stone-950 hover:border-emerald-500/60 hover:shadow-sm'
                }`}
              >
                <div>
                  {/* Top Bar: Para Number & Arabic Calligraphy Name */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold font-mono transition-colors ${
                          isSelected
                            ? 'bg-emerald-800 text-white'
                            : 'bg-stone-100 dark:bg-stone-900 text-stone-800 dark:text-stone-200 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-950 group-hover:text-emerald-900'
                        }`}
                      >
                        {juz.number}
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block">
                          Para {juz.number}
                        </span>
                        <h3 className="font-semibold text-sm text-stone-900 dark:text-stone-100">
                          {juz.transliteration}
                        </h3>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-arabic text-xl font-bold text-emerald-800 dark:text-emerald-400 block leading-tight" dir="rtl">
                        {juz.arabicName}
                      </span>
                      <span className="text-[11px] text-stone-500 font-arabic block">
                        {juz.urduName}
                      </span>
                    </div>
                  </div>

                  {/* Range Description */}
                  <div className="py-2.5 px-3 rounded-lg bg-stone-50 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-850 text-xs text-stone-600 dark:text-stone-300 space-y-1 mb-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-stone-500">Starts:</span>
                      <span className="font-medium truncate max-w-[170px] text-stone-800 dark:text-stone-200">
                        {juz.startSurahName} ({juz.startAyah})
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-stone-500">Ends:</span>
                      <span className="font-medium truncate max-w-[170px] text-stone-800 dark:text-stone-200">
                        {juz.endSurahName} ({juz.endAyah})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-stone-500 text-[11px] mb-3">
                    <span>Total Verses:</span>
                    <span className="font-mono text-stone-700 dark:text-stone-300">{juz.totalVerses} Ayahs</span>
                  </div>
                </div>

                {/* Bottom Action: Click to open Para & listen/recite with live highlight */}
                <div className="pt-2.5 border-t border-stone-100 dark:border-stone-850 flex items-center justify-between text-xs">
                  <span className="text-emerald-800 dark:text-emerald-400 font-bold text-[11px] flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>تلاوت کھولیں اور سنیں</span>
                  </span>
                  <div className="flex items-center gap-1 text-emerald-700 font-semibold group-hover:translate-x-1 transition-transform">
                    <span>کھولیں</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="divide-y divide-stone-200 dark:divide-stone-850 border border-stone-200 dark:border-stone-850 rounded-xl overflow-hidden bg-white dark:bg-stone-950">
          {filteredJuz.map((juz) => {
            const isSelected = currentJuz === juz.number;
            const isCompleted = completedParas.includes(juz.number);

            return (
              <div
                key={juz.number}
                onClick={() => onSelectJuz(juz.number)}
                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30'
                    : 'hover:bg-stone-50 dark:hover:bg-stone-900/50'
                }`}
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold font-mono shrink-0 ${
                      isSelected
                        ? 'bg-emerald-800 text-white'
                        : 'bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {juz.number}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                        Para {juz.number}: {juz.transliteration}
                      </h4>
                      {isCompleted && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                      {juz.startSurahName} ({juz.startAyah}) to {juz.endSurahName} ({juz.endAyah}) · {juz.totalVerses} Ayahs
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0">
                  <div className="text-right">
                    <span className="font-arabic text-xl font-bold text-emerald-800 dark:text-emerald-400 block" dir="rtl">
                      {juz.arabicName}
                    </span>
                    <span className="text-[11px] text-stone-400 font-arabic">
                      {juz.urduName}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectJuz(juz.number);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>سنیں اور پڑھیں</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
