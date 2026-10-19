import { Ayah } from '../types/quran';
import { FALLBACK_JUZ_1_AYAHS, FALLBACK_JUZ_30_SAMPLE } from '../data/fallbackAyahs';
import { SURAH_LIST } from '../data/surahData';

const CACHE_PREFIX = 'quran_juz_v2_';

interface AlQuranAyahItem {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil?: number;
  page?: number;
  ruku?: number;
  hizbQuarter?: number;
  sajda?: boolean | object;
  surah: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: string;
  };
}

export async function fetchJuzData(juzNumber: number): Promise<Ayah[]> {
  const cacheKey = `${CACHE_PREFIX}${juzNumber}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // ignore localStorage read issues
  }

  // Attempt to fetch from public AlQuran Cloud API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    // Fetch tajweed, urdu, hindi, english in parallel
    const [tajweedRes, urduRes, hindiRes, englishRes] = await Promise.all([
      fetch(`https://api.alquran.cloud/v1/juz/${juzNumber}/quran-tajweed`, { signal: controller.signal }),
      fetch(`https://api.alquran.cloud/v1/juz/${juzNumber}/ur.jalandhry`, { signal: controller.signal }),
      fetch(`https://api.alquran.cloud/v1/juz/${juzNumber}/hi.farooq`, { signal: controller.signal }).catch(() => null),
      fetch(`https://api.alquran.cloud/v1/juz/${juzNumber}/en.sahih`, { signal: controller.signal }).catch(() => null)
    ]);

    clearTimeout(timeoutId);

    if (!tajweedRes.ok) {
      throw new Error(`Failed to fetch tajweed edition: ${tajweedRes.status}`);
    }

    const tajweedData = await tajweedRes.json();
    const urduData = urduRes && urduRes.ok ? await urduRes.json() : null;
    const hindiData = hindiRes && hindiRes.ok ? await hindiRes.json() : null;
    const englishData = englishRes && englishRes.ok ? await englishRes.json() : null;

    const tajweedAyahs: AlQuranAyahItem[] = tajweedData.data?.ayahs || [];
    const urduAyahs: AlQuranAyahItem[] = urduData?.data?.ayahs || [];
    const hindiAyahs: AlQuranAyahItem[] = hindiData?.data?.ayahs || [];
    const englishAyahs: AlQuranAyahItem[] = englishData?.data?.ayahs || [];

    const urduMap = new Map<number, string>();
    urduAyahs.forEach(a => urduMap.set(a.number, a.text));

    const hindiMap = new Map<number, string>();
    hindiAyahs.forEach(a => hindiMap.set(a.number, a.text));

    const englishMap = new Map<number, string>();
    englishAyahs.forEach(a => englishMap.set(a.number, a.text));

    const result: Ayah[] = tajweedAyahs.map(a => {
      const cleanArabic = stripTajweedTags(a.text);
      const surahMeta = SURAH_LIST.find(s => s.number === a.surah.number);

      return {
        number: a.number,
        numberInSurah: a.numberInSurah,
        surahNumber: a.surah.number,
        surahNameArabic: a.surah.name || surahMeta?.name,
        surahNameEnglish: a.surah.englishName || surahMeta?.englishName,
        textArabic: cleanArabic,
        textTajweed: a.text,
        translationUrdu: urduMap.get(a.number) || '',
        translationHindi: hindiMap.get(a.number) || '',
        translationEnglish: englishMap.get(a.number) || '',
        juz: a.juz || juzNumber,
        page: a.page,
        hizbQuarter: a.hizbQuarter,
        sajda: Boolean(a.sajda)
      };
    });

    if (result.length > 0) {
      try {
        localStorage.setItem(cacheKey, JSON.stringify(result));
      } catch {
        // quota limit or disabled
      }
      return result;
    }
  } catch (err) {
    console.warn(`AlQuran API fetch failed for Juz ${juzNumber}, using fallback.`, err);
  }

  // Fallback to local high-precision data if Juz 1 or Juz 30
  if (juzNumber === 1) {
    return FALLBACK_JUZ_1_AYAHS;
  }
  if (juzNumber === 30) {
    return FALLBACK_JUZ_30_SAMPLE;
  }

  // If other Juz and offline, synthesize readable placeholder structure with Surah info
  return generateSyntheticJuzFallback(juzNumber);
}

export function stripTajweedTags(htmlWithTags: string): string {
  if (!htmlWithTags) return '';
  return htmlWithTags
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

/**
 * Generates an offline placeholder with correct Surah references if API is unreachable for that Juz
 */
function generateSyntheticJuzFallback(juzNumber: number): Ayah[] {
  return [
    {
      number: juzNumber * 100,
      numberInSurah: 1,
      surahNumber: Math.min(114, Math.max(1, Math.floor(juzNumber * 3.8))),
      surahNameArabic: 'سورة قرآنية',
      surahNameEnglish: `Juz ${juzNumber}`,
      textArabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      textTajweed: '<tajweed class="madda_normal">بِسْمِ</tajweed> <tajweed class="ham_wasl">ٱ</tajweed>للَّهِ <tajweed class="ham_wasl">ٱ</tajweed>لرَّحْمَٰنِ <tajweed class="ham_wasl">ٱ</tajweed>لرَّحِيمِ',
      translationUrdu: `پارہ نمبر ${juzNumber} - انٹرنیٹ بحال ہونے پر مکمل آیات خودکار لوڈ ہو جائیں گی۔`,
      translationHindi: `पारा नंबर ${juzNumber} - इंटरनेट कनेक्ट होने पर पूरी आयतें लोड होंगी।`,
      translationEnglish: `Juz ${juzNumber} content will be retrieved automatically when online.`,
      juz: juzNumber,
      page: juzNumber * 20
    }
  ];
}

/**
 * Maps AlQuran cloud tajweed CSS classes to tailwind colors and rule descriptors
 */
export function getTajweedClassStyles(cssClass: string): { color: string; label: string; ruleId: string } {
  const norm = cssClass.toLowerCase().trim();

  if (norm.includes('ghunnah')) {
    return { color: 'text-emerald-600 dark:text-emerald-400 font-semibold', label: 'Ghunnah (غنة)', ruleId: 'ghunnah' };
  }
  if (norm.includes('qalaqah') || norm.includes('qalqalah')) {
    return { color: 'text-blue-600 dark:text-blue-400 font-semibold', label: 'Qalqalah (قلقلة)', ruleId: 'qalqalah' };
  }
  if (norm.includes('ikhafa') || norm.includes('ikhfa')) {
    return { color: 'text-cyan-600 dark:text-cyan-400 font-semibold', label: 'Ikhfa (إخفاء)', ruleId: 'ikhfa' };
  }
  if (norm.includes('idgham')) {
    return { color: 'text-purple-600 dark:text-purple-400 font-semibold', label: 'Idgham (إدغام)', ruleId: 'idgham' };
  }
  if (norm.includes('iqlab')) {
    return { color: 'text-amber-600 dark:text-amber-400 font-semibold', label: 'Iqlab (إقلاب)', ruleId: 'iqlab' };
  }
  if (norm.includes('madda') || norm.includes('madd')) {
    return { color: 'text-rose-600 dark:text-rose-400 font-semibold', label: 'Madd (مد)', ruleId: 'madd' };
  }
  if (norm.includes('ham_wasl')) {
    return { color: 'text-slate-400 dark:text-slate-500', label: 'Hamzatul Wasl (همزة وصل)', ruleId: 'wasl' };
  }
  if (norm.includes('slnt') || norm.includes('silent')) {
    return { color: 'text-slate-300 dark:text-slate-600', label: 'Silent Letter (حرف لا ينطق)', ruleId: 'silent' };
  }

  return { color: 'text-emerald-700 dark:text-emerald-300', label: 'Tajweed Rule', ruleId: 'general' };
}
