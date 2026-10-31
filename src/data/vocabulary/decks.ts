import { VocabularyDeck } from '../../types/vocabulary';

export const VOCABULARY_DECKS: VocabularyDeck[] = [
  {
    id: 'phrasal-verbs',
    order: 1,
    titleEn: 'Essential Phrasal Verbs (In/Out, On/Off, Up/Down)',
    titleFr: 'Verbes à Particule (Phrasal Verbs Essentiels)',
    titleDari: 'افعال عبارتی ضروری (Phrasal Verbs)',
    badge: 'Murphy Units 137–145',
    descriptionFr:
      'Les verbes à particule incontournables du quotidien (put off, carry on, work out, bring up, run out of, look forward to...).',
    descriptionDari:
      'مهم‌ترین افعال عبارتی انگلیسی روزمره از بخش پایانی کتاب مورفی.',
    color: '#059669', // Emerald
    iconName: 'Compass',
  },
  {
    id: 'irregular-verbs',
    order: 2,
    titleEn: 'Master Irregular Verbs (V1 • V2 • V3)',
    titleFr: 'Verbes Irréguliers Maîtres (3 Formes)',
    titleDari: 'افعال بی‌قاعده کلیدی (سه شکل فعل)',
    badge: 'Murphy Appendix 1 • Azar Chart 2-7',
    descriptionFr:
      'Les verbes irréguliers fondamentaux avec leurs 3 formes (Infinitif, Past Simple, Past Participle) et exemples en contexte.',
    descriptionDari:
      'افعال بی‌قاعده مهم انگلیسی همراه با هر سه شکل (ساده، گذشته و اسم مفعول).',
    color: '#7C3AED', // Violet
    iconName: 'Layers',
  },
  {
    id: 'adj-prepositions',
    order: 3,
    titleEn: 'Adjective + Preposition Collocations',
    titleFr: 'Adjectif + Préposition (Collocations Fixes)',
    titleDari: 'ترکیب‌های صفت و حرف اضافه',
    badge: 'Murphy Units 130–131 • Azar Chart 11-6',
    descriptionFr:
      'Les associations obligatoires adjectif + préposition (good at, afraid of, interested in, married to, fed up with, capable of...).',
    descriptionDari:
      'حروف اضافه ثابتی که بعد از صفت‌ها می‌آیند (مانند good at, interested in, married to).',
    color: '#2563EB', // Royal Blue
    iconName: 'BookCheck',
  },
  {
    id: 'verb-prepositions',
    order: 4,
    titleEn: 'Verb + Preposition Constructions',
    titleFr: 'Verbe + Préposition (Constructions Verbales)',
    titleDari: 'افعال همراه با حروف اضافه خاص',
    badge: 'Murphy Units 132–136 • Azar Ch 14',
    descriptionFr:
      'Maîtrisez la préposition exacte exigée par chaque verbe (depend on, belong to, apologize for, insist on, succeed in, suffer from...).',
    descriptionDari:
      'یادگیری حرف اضافه دقیق هر فعل (depend on, belong to, succeed in, insist on).',
    color: '#0284C7', // Sky Blue
    iconName: 'Sliders',
  },
  {
    id: 'noun-idioms',
    order: 5,
    titleEn: 'Noun + Preposition & Fixed Idioms',
    titleFr: 'Nom + Préposition & Expressions Idiomatiques',
    titleDari: 'اسم + حرف اضافه و اصطلاحات کاربردی',
    badge: 'Murphy Units 122, 127–129',
    descriptionFr:
      'Nuances clés (on time vs in time, at the end vs in the end, by chance, on purpose) et noms + prépositions (reason for, increase in, solution to).',
    descriptionDari:
      'تفاوت اصطلاحات مهم زمانی و مکانی (on time/in time, by mistake, on purpose) و اسم با حرف اضافه.',
    color: '#D97706', // Amber
    iconName: 'Sparkles',
  },
  {
    id: 'uncountable-nouns',
    order: 6,
    titleEn: 'Uncountable Nouns & Lexical Pairs',
    titleFr: 'Noms Indénombrables Pièges & Partitifs',
    titleDari: 'اسامی غیرقابل شمارش و واحدهای شمارش',
    badge: 'Murphy Units 69–71 • Azar Ch 7',
    descriptionFr:
      'Les faux amis indénombrables en anglais (advice, furniture, luggage, news, progress, work vs job, travel vs journey, weather vs climate).',
    descriptionDari:
      'اسامی غیرقابل شمارش مهم در انگلیسی (advice, luggage, furniture, work/job, travel/journey).',
    color: '#B45309', // Warm Leather
    iconName: 'Award',
  },
  {
    id: 'stative-mental',
    order: 7,
    titleEn: 'Stative, Perception & Mental Verbs',
    titleFr: 'Verbes d’État, de Pensée & de Perception',
    titleDari: 'افعال حالتی، ذهنی و حسی (Stative Verbs)',
    badge: 'Murphy Unit 4 • Azar Chart 2-3',
    descriptionFr:
      'Le vocabulaire des états mentaux, de la possession et de l’apparence (realize, recognize, suppose, belong, consist, resemble, owe...).',
    descriptionDari:
      'واژگان مربوط به حالات ذهنی، مالکیت و به نظر رسیدن از جدول معروف بتی آذر.',
    color: '#0D9488', // Teal
    iconName: 'Clock',
  },
  {
    id: 'participial-adjectives',
    order: 8,
    titleEn: 'Participial Adjectives (-ed vs -ing Emotions)',
    titleFr: 'Adjectifs d’Émotion en -ed et -ing',
    titleDari: 'صفت‌های احساسی با پسوند ed و ing',
    badge: 'Murphy Unit 98 • Azar Chart 11-7',
    descriptionFr:
      'Enrichissez votre registre émotionnel : astonished/astonishing, exhausted/exhausting, overwhelmed/overwhelming, fascinated/fascinating.',
    descriptionDari:
      'گسترش دایره واژگان احساسی و توصیفی با صفت‌های فاعلی و مفعولی.',
    color: '#8D4A19', // Deep Amber
    iconName: 'ListFilter',
  },
  {
    id: 'confusable-pairs',
    order: 9,
    titleEn: 'Troublesome & Confusable Word Pairs',
    titleFr: 'Paires de Mots Confondables & Verbes Pièges',
    titleDari: 'جفت‌کلمات چالش‌برانگیز و مشابه',
    badge: 'Azar Chart 2-6 • Murphy Units 101, 117, 119',
    descriptionFr:
      'Ne confondez plus : raise/rise, lay/lie, set/sit, hard/hardly, late/lately, borrow/lend, say/tell, win/beat, rob/steal.',
    descriptionDari:
      'رفع ابهام از کلمات مشابه: raise/rise، lay/lie، hard/hardly، borrow/lend، win/beat.',
    color: '#E11D48', // Rose
    iconName: 'Flame',
  },
  {
    id: 'connectors-academic',
    order: 10,
    titleEn: 'Connectives, Reporting & Academic Lexicon',
    titleFr: 'Connecteurs Logiques & Verbes de Discours',
    titleDari: 'حروف ربط پیشرفته و افعال گزارش‌دهی',
    badge: 'Murphy Units 47–48, 113–120 • Azar Ch 12, 17, 19',
    descriptionFr:
      'Structurer son argumentation (nevertheless, consequently, whereas, provided that, otherwise) et rapporter avec précision (claim, deny, admit, warn, persuade).',
    descriptionDari:
      'واژگان رسمی برای استدلال، تضاد، نتیجه و افعال نقل قول غیرمستقیم.',
    color: '#4F46E5', // Indigo
    iconName: 'GraduationCap',
  },
];
