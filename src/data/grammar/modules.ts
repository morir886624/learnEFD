import { GrammarModule } from '../../types/grammar';

export const GRAMMAR_MODULES: GrammarModule[] = [
  {
    id: 'mod-tenses-present-past',
    category: 'tenses',
    order: 1,
    titleEn: 'Present & Past Tenses',
    titleFr: 'Présent & Passé Simple / Continu',
    titleDari: 'زمان حال و گذشته ساده و استمراری',
    badge: 'Murphy Units 1–6 • Azar Ch 1–2',
    descriptionFr:
      'Distinguez le présent simple du continu, maîtrisez les verbes d’état (stative verbs) et l’habitude passée avec used to.',
    descriptionDari:
      'تفاوت بین حال ساده و استمراری، افعال حالتی (Stative Verbs) و عادت در گذشته با used to.',
    color: '#0284C7', // Sky Blue
    iconName: 'Clock',
    lessonIds: ['lesson-present-simple-continuous', 'lesson-past-simple-continuous', 'lesson-used-to'],
  },
  {
    id: 'mod-tenses-perfect',
    category: 'tenses',
    order: 2,
    titleEn: 'Perfect & Progressive Tenses',
    titleFr: 'Les Temps Parfaits (Have Done / Had Done)',
    titleDari: 'زمان‌های کامل و کامل استمراری',
    badge: 'Murphy Units 7–16 • Azar Ch 3',
    descriptionFr:
      'Comprenez enfin le Present Perfect face au Past Simple, l’usage de since / for, et l’antériorité du Past Perfect.',
    descriptionDari:
      'یادگیری کامل Present Perfect در مقابل گذشته ساده، کاربرد since و for، و گذشته کامل.',
    color: '#7C3AED', // Violet
    iconName: 'Sparkles',
    lessonIds: ['lesson-present-perfect-vs-past', 'lesson-present-perfect-continuous', 'lesson-past-perfect'],
  },
  {
    id: 'mod-future',
    category: 'tenses',
    order: 3,
    titleEn: 'Future Time & Intentions',
    titleFr: 'Le Futur : Will, Going to & Projets',
    titleDari: 'زمان آینده و بیان تصمیمات',
    badge: 'Murphy Units 19–25 • Azar Ch 4',
    descriptionFr:
      'Décisions spontanées avec will, projets prémédités avec be going to, et futur dans les propositions de temps.',
    descriptionDari:
      'تصمیمات آنی با will، برنامه‌های آینده با going to و جملات قیدی زمان آینده.',
    color: '#0D9488', // Teal
    iconName: 'ArrowRight',
    lessonIds: ['lesson-will-vs-going-to', 'lesson-present-for-future', 'lesson-future-continuous-perfect'],
  },
  {
    id: 'mod-modals',
    category: 'modals',
    order: 4,
    titleEn: 'Modal Auxiliaries & Certainty',
    titleFr: 'Verbes Modaux & Degrés de Certitude',
    titleDari: 'افعال معین و درجات اطمینان',
    badge: 'Murphy Units 26–37 • Azar Ch 9–10',
    descriptionFr:
      'Échelle de certitude Azar (100% à 50%), déductions logiques (must be / can’t be), obligation et interdiction.',
    descriptionDari:
      'مقیاس اطمینان، نتیجه‌گیری‌های منطقی با must و can’t، و تفاوت ضرورت و اجبار.',
    color: '#D97706', // Amber
    iconName: 'Sliders',
    lessonIds: ['lesson-modals-ability-requests', 'lesson-modals-obligation-prohibition', 'lesson-modals-certainty-deduction'],
  },
  {
    id: 'mod-conditionals',
    category: 'conditionals',
    order: 5,
    titleEn: 'Conditionals & Wishes',
    titleFr: 'Phrases Conditionnelles & Souhaits (If / Wish)',
    titleDari: 'جملات شرطی و آرزوها',
    badge: 'Murphy Units 38–41 • Azar Ch 20',
    descriptionFr:
      'Conditionnels 0, 1, 2, 3, regrets passés avec if had done / wish, et alternatives à if (unless, in case).',
    descriptionDari:
      'انواع شرطی ۱، ۲ و ۳، بیان حسرت و آرزو با wish، و کلمات شرطی دیگر مثل unless.',
    color: '#DC2626', // Red
    iconName: 'Compass',
    lessonIds: ['lesson-conditionals-zero-first', 'lesson-conditionals-second-third', 'lesson-wishes-regrets', 'lesson-unless-in-case'],
  },
  {
    id: 'mod-passive',
    category: 'passive',
    order: 6,
    titleEn: 'Passive Voice & Causatives',
    titleFr: 'Voix Passive & Structures Causatives',
    titleDari: 'مجهول و جملات سببی (Causatives)',
    badge: 'Murphy Units 42–46 • Azar Ch 11',
    descriptionFr:
      'Former le passif à tous les temps, passif d’état, et faire faire quelque chose (have something done / make / get).',
    descriptionDari:
      'ساخت مجهول، صفت‌های حاصل از اسم مفعول، و انجام کار توسط دیگری با have/get something done.',
    color: '#4F46E5', // Indigo
    iconName: 'Layers',
    lessonIds: ['lesson-passive-voice', 'lesson-stative-passive', 'lesson-causatives'],
  },
  {
    id: 'mod-clauses',
    category: 'clauses',
    order: 7,
    titleEn: 'Clauses & Sentence Connectors',
    titleFr: 'Propositions Relatives & Connecteurs',
    titleDari: 'بندهای موصولی و حروف ربط',
    badge: 'Murphy Units 92–96, 113 • Azar Ch 12, 13, 17',
    descriptionFr:
      'Relatives (who, which, that, whose), opposition avec although / despite, et propositions subordonnées complétives.',
    descriptionDari:
      'ضمایر موصولی، بندهای تضاد با although و despite، و جملات نقل قول.',
    color: '#2563EB', // Blue
    iconName: 'BookCheck',
    lessonIds: ['lesson-relative-clauses', 'lesson-connectors-contrast-cause', 'lesson-noun-clauses-reported'],
  },
  {
    id: 'mod-gerunds',
    category: 'gerunds',
    order: 8,
    titleEn: 'Gerunds & Infinitives',
    titleFr: 'Gérondif (-ing) ou Infinitif (To...)',
    titleDari: 'اسم مصدر (-ing) و مصدر با to',
    badge: 'Murphy Units 53–68 • Azar Ch 14–15',
    descriptionFr:
      'Quels verbes prennent -ing ou to, les verbes à double sens (stop, remember, try) et les pièges comme look forward to.',
    descriptionDari:
      'کدام افعال نیاز به -ing یا to دارند، تغییر معنا با stop و remember، و حروف اضافه با gerund.',
    color: '#16A34A', // Green
    iconName: 'GraduationCap',
    lessonIds: ['lesson-gerund-vs-infinitive', 'lesson-verbs-meaning-change', 'lesson-prepositions-gerund'],
  },
  {
    id: 'mod-nouns',
    category: 'nouns-articles',
    order: 9,
    titleEn: 'Nouns, Articles & Quantifiers',
    titleFr: 'Noms, Articles (A/An/The) & Quantifieurs',
    titleDari: 'اسامی، حروف تعریف و کلمات کمیت',
    badge: 'Murphy Units 69–91 • Azar Ch 7',
    descriptionFr:
      'Noms dénombrables vs indénombrables (advice, furniture), l’article zéro, and nuances de few vs a few.',
    descriptionDari:
      'تفاوت اسامی قابل شمارش و غیرقابل شمارش، کاربرد the و تفاوت few با a few.',
    color: '#B45309', // Amber / Leather
    iconName: 'Award',
    lessonIds: ['lesson-countable-uncountable', 'lesson-articles-a-the-zero', 'lesson-quantifiers'],
  },
  {
    id: 'mod-adjectives',
    category: 'adjectives-adverbs',
    order: 10,
    titleEn: 'Adjectives, Adverbs & Comparison',
    titleFr: 'Adjectifs en -ed/-ing, Comparatifs & So/Such',
    titleDari: 'صفت‌ها، قیدها، مقایسه و so/such',
    badge: 'Murphy Units 98–108 • Azar Ch 11, 19',
    descriptionFr:
      'Bored vs boring, règles de comparatifs / superlatifs, constructions as...as, et distinction so vs such / too vs enough.',
    descriptionDari:
      'تفاوت bored و boring، ساختار مقایسه‌ای و تفاوت ظریف بین so و such.',
    color: '#8D4A19', // Deep amber
    iconName: 'ListFilter',
    lessonIds: ['lesson-comparatives-superlatives', 'lesson-ed-ing-adjectives', 'lesson-so-such-too-enough'],
  },
  {
    id: 'mod-prepositions',
    category: 'prepositions',
    order: 11,
    titleEn: 'Prepositions & Phrasal Verbs',
    titleFr: 'Prépositions de Temps/Lieu & Phrasal Verbs',
    titleDari: 'حروف اضافه زمان، مکان و افعال ترکیبی',
    badge: 'Murphy Units 121–145',
    descriptionFr:
      'Pyramide du temps at / on / in, positionnements spatiaux, et règles de séparabilité des phrasal verbs.',
    descriptionDari:
      'هرم زمانی at، on، in، حروف اضافه مکان و جداپذیری افعال عبارتی.',
    color: '#059669', // Emerald
    iconName: 'Compass',
    lessonIds: ['lesson-prepositions-time', 'lesson-prepositions-place', 'lesson-phrasal-verbs'],
  },
  {
    id: 'mod-troublesome',
    category: 'troublesome',
    order: 12,
    titleEn: 'Troublesome Verbs & Pitfalls',
    titleFr: 'Verbes Pièges & Confusions Courantes',
    titleDari: 'افعال چالش‌برانگیز و اشتباهات رایج',
    badge: 'Azar Ch 2 (Chart 2-6) • Murphy Units 117, 119',
    descriptionFr:
      'Paires intransitives/transitives célèbres (raise/rise, set/sit, lay/lie), ainsi que during vs while et like vs as.',
    descriptionDari:
      'افعال پرچالش raise/rise، lay/lie، set/sit و تفاوت during با while.',
    color: '#E11D48', // Rose
    iconName: 'Flame',
    lessonIds: ['lesson-raise-rise-lay-lie', 'lesson-during-while-for-like-as'],
  },
];

