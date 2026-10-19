import React, { useState, useEffect } from 'react';
import { JUZ_LIST } from '../data/juzData';
import { CheckSquare, Square, Award, X, RotateCcw } from 'lucide-react';

interface KhatamTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectJuz: (juzNumber: number) => void;
}

const STORAGE_KEY = 'quran_completed_paras_v1';

export const KhatamTracker: React.FC<KhatamTrackerProps> = ({ isOpen, onClose, onSelectJuz }) => {
  const [completedParas, setCompletedParas] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedParas));
    } catch {
      // ignore
    }
  }, [completedParas]);

  if (!isOpen) return null;

  const togglePara = (paraNum: number) => {
    setCompletedParas((prev) =>
      prev.includes(paraNum) ? prev.filter((p) => p !== paraNum) : [...prev, paraNum]
    );
  };

  const resetAll = () => {
    if (window.confirm('کیا آپ تمام پاروں کا ریکارڈ ری سیٹ کرنا چاہتے ہیں؟ (Reset Khatam Progress?)')) {
      setCompletedParas([]);
    }
  };

  const progressPct = Math.round((completedParas.length / 30) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/80 flex items-center justify-center text-amber-800 dark:text-amber-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                ختمِ قرآن ٹریکر · 30 Para Khatam Tracker
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                اپنے پڑھے ہوئے پاروں کو نشان زد کریں اور مکمل پیش رفت دیکھیں
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 rounded-lg transition-colors hover:bg-stone-200 dark:hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Strip */}
        <div className="px-6 py-4 bg-stone-100/70 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between text-xs font-medium mb-1.5">
            <span className="text-stone-700 dark:text-stone-300">
              {completedParas.length} of 30 Paras Completed ({progressPct}%)
            </span>
            <button
              onClick={resetAll}
              className="text-stone-500 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 text-[11px] transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
          <div className="w-full h-2.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* 30 Paras Checklist Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {JUZ_LIST.map((juz) => {
              const isDone = completedParas.includes(juz.number);

              return (
                <div
                  key={juz.number}
                  className={`p-3 rounded-lg border transition-all flex items-center justify-between gap-3 ${
                    isDone
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                      : 'bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 hover:border-stone-300'
                  }`}
                >
                  <button
                    onClick={() => togglePara(juz.number)}
                    className="flex items-center gap-2.5 text-left flex-1 min-w-0"
                  >
                    {isDone ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-stone-400 dark:text-stone-600 shrink-0" />
                    )}
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                          Para {juz.number}
                        </span>
                        <span className="text-[11px] font-arabic text-emerald-700 dark:text-emerald-400">
                          {juz.arabicName}
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-500 dark:text-stone-400 truncate block">
                        {juz.transliteration}
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onSelectJuz(juz.number);
                      onClose();
                    }}
                    className="px-2 py-1 text-[11px] font-medium text-stone-600 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 bg-stone-100 dark:bg-stone-850 hover:bg-stone-200 rounded shrink-0 transition-colors"
                  >
                    Read
                  </button>
                </div>
              );
            })}
          </div>

          {/* Khatam Du'a Box when nearing or finishing */}
          <div className="mt-6 p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 space-y-2">
            <h4 className="text-xs font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              <span>دعاء ختم القرآن الكريم (Du'a for Khatam-ul-Quran)</span>
            </h4>
            <p className="font-arabic text-base leading-relaxed text-right text-stone-800 dark:text-stone-200 dir-rtl">
              اللَّهُمَّ ارْحَمْنَا بِالقُرْآنِ، وَاجْعَلْهُ لَنَا إِمَاماً وَنُوراً وَهُدًى وَرَحْمَةً، اللَّهُمَّ ذَكِّرْنَا مِنْهُ مَا نُسِّينَا، وَعَلِّمْنَا مِنْهُ مَا جَهِلْنَا
            </p>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              اے اللہ! ہم پر قرآن کے طفیل رحم فرما، اور اسے ہمارے لیے رہنما، نور، ہدایت اور رحمت بنا دے۔
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            Progress automatically saved on this device
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-white bg-emerald-800 dark:bg-emerald-700 hover:bg-emerald-900 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
