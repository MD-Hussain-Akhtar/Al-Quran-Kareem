import { Reciter } from '../types/quran';

export const RECITERS_LIST: Reciter[] = [
  {
    id: 'husary',
    name: 'Mahmoud Khalil Al-Husary',
    nameArabic: 'محمود خليل الحصري',
    subfolder: 'Husary_128kbps',
    description: 'The global benchmark for pure Tajweed and classical pronunciation rules.',
    style: 'Muallim',
    recommendedForTajweed: true
  },
  {
    id: 'alafasy',
    name: 'Mishary Rashid Alafasy',
    nameArabic: 'مشاري بن راشد العفاسي',
    subfolder: 'Alafasy_128kbps',
    description: 'Renowned for melodious, pristine and emotionally resonant recitation.',
    style: 'Murattal',
    recommendedForTajweed: true
  },
  {
    id: 'abdulbasit_mujawwad',
    name: 'Abdul Basit Abdul Samad (Mujawwad)',
    nameArabic: 'عبد الباسط عبد الصمد - مجوّد',
    subfolder: 'Abdul_Basit_Mujawwad_128kbps',
    description: 'Legendary golden voice of Egypt with soaring Tajweed maqamat & breath control.',
    style: 'Mujawwad',
    recommendedForTajweed: true
  },
  {
    id: 'minshawy_mujawwad',
    name: 'Mohamed Siddiq Al-Minshawi (Mujawwad)',
    nameArabic: 'محمد صديق المنشاوي - مجوّد',
    subfolder: 'Minshawy_Mujawwad_192kbps',
    description: 'Deeply heartfelt, soulful Tajweed with unmatched humility and tearful tones.',
    style: 'Mujawwad',
    recommendedForTajweed: true
  },
  {
    id: 'ghamadi',
    name: 'Saad Al-Ghamdi',
    nameArabic: 'سعد الغامدي',
    subfolder: 'Ghamadi_40kbps',
    description: 'Harmonious, steady paced Murattal suitable for daily recitation practice.',
    style: 'Murattal',
    recommendedForTajweed: false
  }
];

export function getAyahAudioUrl(surahNumber: number, ayahInSurah: number, reciterSubfolder: string): string {
  const s = String(surahNumber).padStart(3, '0');
  const a = String(ayahInSurah).padStart(3, '0');
  return `https://everyayah.com/data/${reciterSubfolder}/${s}${a}.mp3`;
}
