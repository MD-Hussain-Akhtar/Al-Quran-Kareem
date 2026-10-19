import React, { useState } from 'react';
import { SURAH_LIST } from '../data/surahData';
import { SurahInfo } from '../types/quran';
import { Search, Compass, ArrowRight } from 'lucide-react';

interface SurahSelectorProps {
  onSelectSurah: (surah: SurahInfo) => void;
}

export const SurahSelector: React.FC<SurahSelectorProps> = ({ onSelectSurah }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'Meccan' | 'Medinan'>('all');

  const filteredSurahs = SURAH_LIST.filter((surah) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesFilter = filterType === 'all' || surah.revelationType === filterType;
    if (!matchesFilter) return false;

    if (!q) return true;
    return (
      surah.number.toString().includes(q) ||
      surah.englishName.toLowerCase().includes(q) ||
      surah.englishNameTranslation.toLowerCase().includes(q) ||
      surah.name.includes(q) ||
      surah.urduName.includes(q) ||
      surah.hindiName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span>سورہ فہرست (All 114 Surahs)</span>
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            مکی اور مدنی سورتوں کی مکمل فہرست بمع معانی اور آیات کی تعداد
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Revelation Type Filter */}
          <div className="flex items-center gap-1 p-0.5 bg-stone-100 dark:bg-stone-800 rounded-lg">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                filterType === 'all'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              All (114)
            </button>
            <button
              onClick={() => setFilterType('Meccan')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                filterType === 'Meccan'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              مکی (Makki)
            </button>
            <button
              onClick={() => setFilterType('Medinan')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                filterType === 'Medinan'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              مدنی (Madani)
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search Surah / تلاش کریں..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-600 w-52 sm:w-60"
            />
          </div>
        </div>
      </div>

      {/* Surah List Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredSurahs.map((surah) => (
          <div
            key={surah.number}
            onClick={() => onSelectSurah(surah)}
            className="group p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 hover:border-emerald-500/50 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-stone-100 dark:bg-stone-900 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-950/80 text-stone-800 dark:text-stone-200 group-hover:text-emerald-800 flex items-center justify-center text-xs font-mono font-bold shrink-0 transition-colors">
                {surah.number}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">
                    {surah.englishName}
                  </h4>
                  <span className="text-[10px] text-stone-400">
                    ({surah.revelationType === 'Meccan' ? 'مکی' : 'مدنی'})
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                  {surah.englishNameTranslation} · {surah.numberOfAyahs} Ayahs
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="font-arabic text-lg font-bold text-emerald-800 dark:text-emerald-400 block" dir="rtl">
                {surah.name}
              </span>
              <span className="text-[10px] text-stone-400 font-mono">
                Para {surah.juzNumber}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
