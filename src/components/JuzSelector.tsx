import React, { useState } from 'react';
import { JUZ_LIST } from '../data/juzData';
import { JuzInfo } from '../types/quran';
import { Search, BookOpen, Layers, CheckCircle2, ArrowRight, Volume2, BookMarked } from 'lucide-react';

interface JuzSelectorProps {
  currentJuz: number;
  onSelectJuz: (juzNumber: number, mode?: 'reader' | 'mushaf') => void;
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
            کسی بھی پارے کا انتخاب کریں: بغیر سنے صرف پڑھیں (Read Quran) یا تجوید آڈیو کے ساتھ سنیں
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
              className="pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-600 w-56 sm:w-64"
            />
          </div>

          <div className="flex items-center p-0.5 bg-stone-100 dark:bg-stone-850 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Grid View"
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
              title="List View"
            >
              <BookOpen className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {filteredJuz.map((juz) => {
            const isSelected = currentJuz === juz.number;
            const isCompleted = completedParas.includes(juz.number);

            return (
              <div
                key={juz.number}
                className={`group p-4 rounded-xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-600 dark:border-emerald-600 ring-1 ring-emerald-600'
                    : 'bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-850 hover:border-emerald-500/50 hover:shadow-md'
                }`}
              >
                {/* Top Row: Para Number Badge & Arabic Name */}
                <div
                  onClick={() => onSelectJuz(juz.number, 'mushaf')}
                  className="flex items-start justify-between gap-3 mb-3 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold font-mono ${
                        isSelected
                          ? 'bg-emerald-800 text-white'
                          : 'bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-950/80 group-hover:text-emerald-800 transition-colors'
                      }`}
                    >
                      {juz.number}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-stone-900 dark:text-stone-100 block">
                        Para {juz.number}
                      </span>
                      <span className="text-[11px] text-stone-500 dark:text-stone-400">
                        {juz.transliteration}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-arabic text-xl font-bold text-emerald-800 dark:text-emerald-400 block dir-rtl">
                      {juz.arabicName}
                    </span>
                    <span className="text-[10px] text-stone-400 font-arabic">
                      {juz.urduName}
                    </span>
                  </div>
                </div>

                {/* Middle: Surah Scope info */}
                <div
                  onClick={() => onSelectJuz(juz.number, 'mushaf')}
                  className="py-2.5 px-3 rounded-lg bg-stone-50 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-850 text-xs space-y-1 mb-3 cursor-pointer"
                >
                  <div className="flex items-center justify-between text-stone-600 dark:text-stone-400">
                    <span className="text-[11px]">Surah Range:</span>
                    <span className="font-medium text-stone-800 dark:text-stone-200 truncate ml-2">
                      {juz.startSurahName} ({juz.startAyah}) → {juz.endSurahName} ({juz.endAyah})
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-stone-500 text-[11px]">
                    <span>Total Verses:</span>
                    <span className="font-mono">{juz.totalVerses} Ayahs</span>
                  </div>
                </div>

                {/* Bottom Action strip: Read without audio vs Listen audio */}
                <div className="flex items-center justify-between pt-2.5 border-t border-stone-100 dark:border-stone-850 text-xs gap-2">
                  {/* Read Quran (Silent) */}
                  <button
                    onClick={() => onSelectJuz(juz.number, 'mushaf')}
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-medium text-[11px] flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                    title="Read without listening / audio"
                  >
                    <BookMarked className="w-3.5 h-3.5" />
                    <span>صرف پڑھیں (Read)</span>
                  </button>

                  {/* Listen Audio */}
                  <button
                    onClick={() => onSelectJuz(juz.number, 'reader')}
                    className="py-1.5 px-2.5 rounded-lg bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                    title="Listen with Tajweed audio recitation"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>سنیں (Audio)</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="divide-y divide-stone-200 dark:divide-stone-800 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden bg-white dark:bg-stone-950">
          {filteredJuz.map((juz) => {
            const isSelected = currentJuz === juz.number;
            const isCompleted = completedParas.includes(juz.number);

            return (
              <div
                key={juz.number}
                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  isSelected
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30'
                    : 'hover:bg-stone-50 dark:hover:bg-stone-900/50'
                }`}
              >
                <div
                  onClick={() => onSelectJuz(juz.number, 'mushaf')}
                  className="flex items-center gap-4 min-w-0 flex-1 cursor-pointer"
                >
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

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                  <div
                    onClick={() => onSelectJuz(juz.number, 'mushaf')}
                    className="text-right cursor-pointer"
                  >
                    <span className="font-arabic text-xl font-bold text-emerald-800 dark:text-emerald-400 block" dir="rtl">
                      {juz.arabicName}
                    </span>
                    <span className="text-[11px] text-stone-400 font-arabic">
                      {juz.urduName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectJuz(juz.number, 'mushaf')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
                      title="Read without listening"
                    >
                      <BookMarked className="w-3.5 h-3.5" />
                      <span>Read</span>
                    </button>

                    <button
                      onClick={() => onSelectJuz(juz.number, 'reader')}
                      className="px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 text-stone-700 dark:text-stone-300 font-medium text-xs flex items-center gap-1.5 transition-colors"
                      title="Listen with Audio"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Audio</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
