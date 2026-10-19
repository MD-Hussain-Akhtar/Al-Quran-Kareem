import React from 'react';
import { Bookmark } from '../types/quran';
import { Bookmark as BookmarkIcon, X, Trash2, ArrowUpRight } from 'lucide-react';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: Bookmark[];
  onRemoveBookmark: (id: string) => void;
  onNavigateToBookmark: (bookmark: Bookmark) => void;
}

export const BookmarksModal: React.FC<BookmarksModalProps> = ({
  isOpen,
  onClose,
  bookmarks,
  onRemoveBookmark,
  onNavigateToBookmark
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-800 dark:text-emerald-400">
              <BookmarkIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                محفوظ آیات · Bookmarks
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Saved verses for daily recitation & memorization
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {bookmarks.length === 0 ? (
            <div className="text-center py-12 text-stone-500 dark:text-stone-400 space-y-2">
              <BookmarkIcon className="w-8 h-8 mx-auto stroke-1 opacity-50" />
              <p className="text-sm">کوئی نشانی محفوظ نہیں ہے</p>
              <p className="text-xs">
                Click the bookmark icon on any Ayah during Tilawat to save it here.
              </p>
            </div>
          ) : (
            bookmarks.map((bm) => (
              <div
                key={bm.id}
                className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 flex items-start justify-between gap-3 hover:border-emerald-500/40 transition-colors"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-stone-900 dark:text-stone-100">
                      {bm.surahName}
                    </span>
                    <span className="text-stone-400">·</span>
                    <span className="text-stone-500">Ayah {bm.ayahNumberInSurah}</span>
                    <span className="text-stone-400">·</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                      Para {bm.juzNumber}
                    </span>
                  </div>
                  <p
                    className="font-arabic text-right text-stone-800 dark:text-stone-200 text-sm leading-relaxed truncate"
                    dir="rtl"
                  >
                    {bm.arabicTextPreview}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      onNavigateToBookmark(bm);
                      onClose();
                    }}
                    className="p-1.5 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-lg transition-colors"
                    title="Go to Ayah"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onRemoveBookmark(bm.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg transition-colors"
                    title="Remove Bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 flex items-center justify-between text-xs text-stone-500">
          <span>{bookmarks.length} saved bookmarks</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-white bg-emerald-800 dark:bg-emerald-700 hover:bg-emerald-900 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
