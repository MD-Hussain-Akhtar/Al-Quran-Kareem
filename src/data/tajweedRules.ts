import { TajweedRuleItem } from '../types/quran';

export const TAJWEED_RULES: TajweedRuleItem[] = [
  {
    id: 'ghunnah',
    name: 'Ghunnah (Nasalization)',
    nameArabic: 'غُنَّة (نون وميم مشددتان)',
    colorHex: '#10b981', // emerald green
    category: 'Nasalization',
    descriptionEn: 'Holding the sound of Noon or Meem with Shaddah (نّ / مّ) in the nasal cavity for 2 beats (harakat).',
    descriptionUr: 'نون مشدد (نّ) یا میم مشدد (مّ) پر ناک کے بانسے سے دو حرکات کے برابر آواز روک کر غنہ کرنا واجب ہے۔',
    descriptionHi: 'नून मुशद्दद (نّ) या मीम मुशद्दद (मّ) पर नाक से 2 हरकात के बराबर आवाज़ निकालना ज़रूरी (वाजिब) है।',
    letters: ['نّ', 'مّ'],
    exampleArabic: 'إِنَّ ٱلَّذِينَ · عَمَّ يَتَسَآءَلُونَ',
    exampleTranslit: 'Inna allatheena · ‘Amma yatasa’aloon',
    ruleExplanation: 'Keep the tongue steady and allow the sound to resonate inside the nasal passage (Khaishoom).'
  },
  {
    id: 'qalqalah',
    name: 'Qalqalah (Echo / Bouncing)',
    nameArabic: 'قَلْقَلَة (قطب جد)',
    colorHex: '#3b82f6', // blue
    category: 'Articulation',
    descriptionEn: 'Echoing or bouncing sound produced when one of the five Qalqalah letters (ق، ط، ب، ج، د) has a Sukoon or when stopping on them.',
    descriptionUr: 'حروف قلقلہ پانچ ہیں: ق، ط، ب، ج، د (مجموعہ: قُطْبُ جَدٍّ)۔ جب یہ ساکن ہوں یا ان پر وقف ہو تو مخرج میں جنبش پیدا کر کے آواز کو اچھال کر پڑھا جاتا ہے۔',
    descriptionHi: 'क़लक़ला के 5 हर्फ़ हैं: क़, त, ब, ज, द (قطب جد)। जब इन पर सुकून हो या वक़्फ़ हो, तो आवाज़ को मख़रज में उछाल कर पढ़ा जाता है।',
    letters: ['ق', 'ط', 'ب', 'ج', 'د'],
    exampleArabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ · ٱلْفَلَقِ · مَسَدٍ',
    exampleTranslit: 'Qul Huwa-llahu Ahad · Al-Falaq · Masad',
    ruleExplanation: 'There are minor (Sughra) in middle of word, and major (Kubra) at end of ayah or pause.'
  },
  {
    id: 'ikhfa',
    name: 'Ikhfa (Concealment / Hiding)',
    nameArabic: 'إِخْفَاء حقيقي',
    colorHex: '#06b6d4', // cyan
    category: 'Noon Sakinah & Tanween',
    descriptionEn: 'Pronouncing Noon Sakinah or Tanween between Izhar and Idgham with Ghunnah when followed by any of the 15 Ikhfa letters.',
    descriptionUr: 'نون ساکن یا تنوین کے بعد حروف اخفاء (15 حروف: ت، ث، ج، د، ذ، ز، س، ش، ص، ض، ط، ظ، ف، ق، ك) میں سے کوئی حرف آئے تو نون کو ناک میں چھپا کر غنہ کے ساتھ پڑھتے ہیں۔',
    descriptionHi: 'नून साकिन या तनवीन के बाद 15 इख़्फ़ा हर्फ़ों (त, स, ज, द, ज़, स, श, क़, क, वगैरह) में से कोई आए तो नून को छुपा कर 2 हरकात तक ग़ुन्ना करते हैं।',
    letters: ['ت', 'ث', 'ج', 'د', 'ذ', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ف', 'ق', 'ك'],
    exampleArabic: 'مِن قَبْلِ · كُنتُمْ · أَنزَلْنَا',
    exampleTranslit: 'Min qabli · Kuntum · Anzalna',
    ruleExplanation: 'Do not touch the tip of the tongue to the upper gums; position your mouth ready for the next letter.'
  },
  {
    id: 'idgham',
    name: 'Idgham (Merging / Assimilation)',
    nameArabic: 'إِدْغَام (يرملون)',
    colorHex: '#8b5cf6', // violet
    category: 'Noon Sakinah & Tanween',
    descriptionEn: 'Merging Noon Sakinah or Tanween into one of the 6 letters of Yarmaloon (ي، ر، م، ل، و، ن). Merged with Ghunnah in (ي، ن، م، و) and without Ghunnah in (ل، ر).',
    descriptionUr: 'نون ساکن یا تنوین کے بعد حروف یرملون (ی، ر، م، ل، و، ن) آئیں تو نون کو اگلے حرف میں مدغم کر دیا جاتا ہے۔ (ل، ر میں بلا غنہ، باقی میں مع الغنہ)۔',
    descriptionHi: 'नून साकिन या तनवीन के बाद यर्मलून (ي، ر، م، ل، و، ن) आए तो नून को अगले हर्फ़ में मिला देते हैं।',
    letters: ['ي', 'ر', 'م', 'ل', 'و', 'ن'],
    exampleArabic: 'مَن يَّقُولُ · مِن رَّبِّهِمْ · هُدًى لِّلْمُتَّقِينَ',
    exampleTranslit: 'May yaqoolu · Mir Rabbihim · Hudal lil-muttaqeen',
    ruleExplanation: 'The first letter loses its sound and merges into the second letter as if it has a Shaddah.'
  },
  {
    id: 'iqlab',
    name: 'Iqlab (Conversion)',
    nameArabic: 'إِقْلَاب (قلب إلى ميم)',
    colorHex: '#f59e0b', // amber
    category: 'Noon Sakinah & Tanween',
    descriptionEn: 'Converting Noon Sakinah or Tanween into a hidden Meem with Ghunnah when followed by the letter Baa (ب). Indicated by a small Meem (م) above the text.',
    descriptionUr: 'نون ساکن یا تنوین کے بعد حرف باء (ب) آئے تو نون کو میم مخففہ سے بدل کر غنہ کے ساتھ پڑھتے ہیں۔',
    descriptionHi: 'नून साकिन या तनवीन के बाद बा (ب) आए तो नून को मीम से बदल कर ग़ुन्ना के साथ पढ़ते हैं।',
    letters: ['ب'],
    exampleArabic: 'مِنۢ بَعْدِ · عَلِيمٌۢ بِذَاتِ الصُّدُورِ',
    exampleTranslit: 'Mim ba‘di · ‘Aleemum bi-zatis sudoor',
    ruleExplanation: 'Close the lips lightly without excessive pressure and hold the nasal sound for 2 counts.'
  },
  {
    id: 'madd',
    name: 'Madd (Elongation / Prolongation)',
    nameArabic: 'مَدّ (لازم، متصل، منفصل، عارض)',
    colorHex: '#ef4444', // red
    category: 'Elongation',
    descriptionEn: 'Stretching the sound of vowels (Alif, Waw, Yaa) when followed by Hamzah or Sukoon/Shaddah. Prolonged from 4 to 6 beats (harakat).',
    descriptionUr: 'حروف مدہ (الف، واو، یاء) کے بعد ہمزہ یا سکون/تشدید آنے پر آواز کو 4 یا 6 حرکات تک لمبا کر کے کھینچنا۔',
    descriptionHi: 'मद्द (लंबा खींचना): अलिफ़, वाव, या के बाद हमज़ा या सुकून/तशदीद आने पर 4 से 6 हरकात तक आवाज़ खींचना।',
    letters: ['ا', 'و', 'ي'],
    exampleArabic: 'جَآءَ · وَلَا الضَّآلِّينَ · السَّمَآء',
    exampleTranslit: 'Jaaa’a · Wa la-ddaallleeen · As-Samaaa’',
    ruleExplanation: 'Madd Lazim requires 6 full counts (3 Alifs). Madd Muttasil / Munfasil typically requires 4-5 counts.'
  },
  {
    id: 'tafkheem',
    name: 'Tafkheem (Heavy / Full Mouth Letters)',
    nameArabic: 'تَفْخِيم (خُصَّ ضَغْطٍ قِظْ)',
    colorHex: '#4f46e5', // indigo
    category: 'Articulation',
    descriptionEn: 'Pronouncing letters with a full, thick sound by raising the back of the tongue towards the palate (خ، ص، ض، غ، ط، ق، ظ).',
    descriptionUr: 'حروف مستعلیہ سات ہیں: خ، ص، ض، غ، ط، ق، ظ (مجموعہ: خُصَّ ضَغْطٍ قِظْ)۔ ان کو منہ بھر کر موٹا (پر) پڑھا جاتا ہے۔',
    descriptionHi: 'तफ़ख़ीम (भारी हर्फ़): ख़, साद, ज़ाद, ग़ैन, ता, क़ाफ़, ज़ा को मुँह भर कर भारी आवाज़ में पढ़ा जाता है।',
    letters: ['خ', 'ص', 'ض', 'غ', 'ط', 'ق', 'ظ'],
    exampleArabic: 'خَالِدِينَ · الصِّرَاطَ · الضَّالِّينَ',
    exampleTranslit: 'Khalideen · As-Siraat · Ad-Daalleen',
    ruleExplanation: 'Also applies to the name of Allah (الله) when preceded by Fatha or Dammah, and Ra (ر) when open.'
  }
];

export const WAQF_SIGNS = [
  { symbol: 'مـ', name: 'Waqf Lazim', meaningEn: 'Mandatory Stop (stopping is compulsory to prevent meaning change)', meaningUr: 'وقف لازم - یہاں ٹھہرنا ضروری ہے تاکہ معنی نہ بگڑے' },
  { symbol: 'ط', name: 'Waqf Mutlaq', meaningEn: 'Absolute Stop (strongly recommended to stop)', meaningUr: 'وقف مطلق - ٹھہرنا بہتر ہے' },
  { symbol: 'ج', name: 'Waqf Ja\'iz', meaningEn: 'Permissible Stop (you may stop or continue)', meaningUr: 'وقف جائز - ٹھہرنا اور ملانا دونوں جائز ہیں' },
  { symbol: 'ز', name: 'Waqf Mujawwaz', meaningEn: 'Stop allowed, continuation preferred', meaningUr: 'وقف مجوز - ملانا بہتر ہے، ٹھہرنا بھی درست' },
  { symbol: 'ص', name: 'Waqf Murakh-khas', meaningEn: 'Licensed Stop (permissible when running out of breath)', meaningUr: 'وقف مرخص - سانس ٹوٹنے پر ٹھہرنے کی رخصت' },
  { symbol: 'قلى', name: 'Al-Waqf Awla', meaningEn: 'Stopping is preferred', meaningUr: 'قِف اولٰی - رک جانا زیادہ بہتر ہے' },
  { symbol: 'صلى', name: 'Al-Wasl Awla', meaningEn: 'Continuing is preferred', meaningUr: 'وصل اولٰی - ملا کر پڑھنا زیادہ بہتر ہے' },
  { symbol: 'لا', name: 'La Taقف', meaningEn: 'Do not stop (continuation required unless at end of ayah)', meaningUr: 'لا تقف - مت رکیے، کلام ملا کر جاری رکھیے' }
];
