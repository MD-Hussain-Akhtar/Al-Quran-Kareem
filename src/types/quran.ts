export interface JuzInfo {
  number: number;
  arabicName: string;
  transliteration: string;
  urduName: string;
  hindiName: string;
  startSurahNumber: number;
  startSurahName: string;
  startAyah: number;
  endSurahNumber: number;
  endSurahName: string;
  endAyah: number;
  totalVerses: number;
  description: string;
}

export interface SurahInfo {
  number: number;
  name: string; // Arabic name, e.g. الفاتحة
  englishName: string; // Al-Faatiha
  englishNameTranslation: string; // The Opening
  urduName: string;
  hindiName: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  juzNumber: number;
}

export interface Ayah {
  number: number; // Global ayah index 1-6236
  numberInSurah: number;
  surahNumber: number;
  surahNameArabic?: string;
  surahNameEnglish?: string;
  textArabic: string;
  textTajweed?: string;
  translationUrdu?: string;
  translationHindi?: string;
  translationEnglish?: string;
  transliteration?: string;
  audioUrl?: string;
  juz: number;
  page?: number;
  hizbQuarter?: number;
  sajda?: boolean;
}

export interface Reciter {
  id: string;
  name: string;
  nameArabic: string;
  subfolder: string;
  description: string;
  style: 'Murattal' | 'Mujawwad' | 'Muallim';
  recommendedForTajweed: boolean;
}

export interface AudioPlaybackState {
  isPlaying: boolean;
  currentAyahNumber: number | null; // global ayah number
  currentAyahInSurah: number | null;
  currentSurahNumber: number | null;
  reciterId: string;
  playbackSpeed: number;
  repeatMode: 'once' | 'twice' | 'thrice' | 'five' | 'infinite';
  currentRepeatCount: number;
  progress: number; // 0 to 1
  currentTime: number;
  duration: number;
  autoPlayNext: boolean;
  isLoading: boolean;
}

export type MushafTheme = 'parchment' | 'sepia' | 'white' | 'night';

export interface ReadingSettings {
  arabicFontSize: number; // px, e.g. 28 to 44
  translationFontSize: number; // px, e.g. 14 to 20
  showTajweed: boolean;
  showUrdu: boolean;
  showHindi: boolean;
  showEnglish: boolean;
  showTransliteration: boolean;
  readingView: 'ayah-by-ayah' | 'continuous-mushaf';
  autoScrollWithAudio: boolean;
  mushafTheme?: MushafTheme;
}

export interface Bookmark {
  id: string;
  surahNumber: number;
  ayahNumberInSurah: number;
  globalAyahNumber: number;
  surahName: string;
  juzNumber: number;
  arabicTextPreview: string;
  createdAt: number;
  note?: string;
}

export interface TajweedRuleItem {
  id: string;
  name: string;
  nameArabic: string;
  colorHex: string;
  category: string;
  descriptionEn: string;
  descriptionUr: string;
  descriptionHi: string;
  letters?: string[];
  exampleArabic: string;
  exampleTranslit: string;
  ruleExplanation: string;
}
