import { FrenchGrammarModule } from '../../types/frenchGrammar';

export const FRENCH_GRAMMAR_MODULES: FrenchGrammarModule[] = [
  {
    id: 'fr-mod-nouns-articles',
    category: 'nouns-articles',
    order: 1,
    titleFr: 'Articles, Genre des Noms & Pluriels',
    titleEn: 'Articles, Noun Genders & Plurals',
    titleDari: 'حروف تعریف، جنسیت اسامی و جمع در فرانسوی',
    badge: 'All-in-One Ch. 1–3 • Complete Grammar Unit 20',
    descriptionFr:
      'Maîtrisez les articles définis, indéfinis et partitifs (du, de la, pas de), les terminaisons masculines/féminines, les noms à double genre (le/la livre, le/la poste) et les prépositions géographiques.',
    descriptionEn:
      'Master definite, indefinite, and partitive articles, masculine/feminine suffix rules, dual-gender nouns, and geographical prepositions.',
    descriptionDari:
      'آموزش کامل حروف تعریف معین، نامعین و بخشی، تشخیص جنسیت اسامی از روی پسوند، اسامی دو جنسیتی و حروف اضافه کشورها و شهرها.',
    color: '#2563EB', // Royal French Blue
    iconName: 'BookOpen',
    lessonIds: [
      'fr-lesson-articles',
      'fr-lesson-noun-gender',
      'fr-lesson-dual-gender-geo',
    ],
  },
  {
    id: 'fr-mod-present-tense',
    category: 'present-tense',
    order: 2,
    titleFr: "Le Présent de l'Indicatif : -ER, -IR, -RE & Orthographe",
    titleEn: 'Present Tense: Regular Verbs & Spelling Changes',
    titleDari: 'زمان حال اخباری: افعال باقاعده و تغییرات املایی',
    badge: 'All-in-One Ch. 10–11 • Complete Grammar Units 1–2',
    descriptionFr:
      'Conjuguez les verbes réguliers en -er, -ir (-iss-) et -re, comprenez « tu vs vous » et les 4 sens de « on », ainsi que les verbes à changement orthographique (-cer, -ger, -yer, -eler, -é_er).',
    descriptionEn:
      'Conjugate regular -er, -ir, and -re verbs, distinguish tu vs vous and on, and master stem/spelling-change verbs.',
    descriptionDari:
      'صرف افعال باقاعده گروه اول، دوم و سوم در زمان حال، تفاوت tu و vous، کاربردهای ضمیر on و تغییرات املایی افعال.',
    color: '#0284C7', // Sky Blue
    iconName: 'Clock',
    lessonIds: [
      'fr-lesson-present-er',
      'fr-lesson-present-spelling',
      'fr-lesson-present-ir-re',
    ],
  },
  {
    id: 'fr-mod-irregular-modals',
    category: 'irregular-modals',
    order: 3,
    titleFr: 'Être, Avoir, Aller, Faire & Verbes Modaux',
    titleEn: 'Être, Avoir, Aller, Faire & Modal Verbs',
    titleDari: 'افعال کلیدی Être، Avoir، Aller، Faire و افعال وجهی',
    badge: 'All-in-One Ch. 12–13 • Complete Grammar Units 3–5',
    descriptionFr:
      'Les piliers du français : être, avoir (et ses expressions idiomatiques : avoir faim, besoin de, l’air), aller (futur proche), venir (passé récent), faire causatif, pouvoir, vouloir, devoir et savoir.',
    descriptionEn:
      'Core irregular verbs, idiomatic avoir expressions, near future, recent past, causative faire, and modal verbs.',
    descriptionDari:
      'افعال بنیادی بودن و داشتن به همراه اصطلاحات avoir، آینده نزدیک با aller، گذشته نزدیک با venir، ساختار سببی faire و افعال توانستن و خواستن.',
    color: '#7C3AED', // Violet
    iconName: 'Sparkles',
    lessonIds: [
      'fr-lesson-etre-avoir',
      'fr-lesson-aller-venir-faire',
      'fr-lesson-modal-verbs',
    ],
  },
  {
    id: 'fr-mod-sentence-architecture',
    category: 'sentence-architecture',
    order: 4,
    titleFr: 'Architecture de la Phrase : Négation, Questions & Pronominaux',
    titleEn: 'Sentence Builder: Negation, Questions & Pronominal Verbs',
    titleDari: 'ساختار جمله: منفی‌سازی، پرسش‌سازی و افعال ضمیردار',
    badge: 'All-in-One Ch. 6–8, 14 • Complete Grammar Units 2, 6',
    descriptionFr:
      'Construisez des phrases négatives (ne...pas, jamais, plus, rien, personne, que), posez des questions aux 3 registres (intonation, est-ce que, inversion) et maîtrisez les verbes pronominaux (se lever, se parler).',
    descriptionEn:
      'Build negative sentences, master all 3 registers of French questions, and conjugate reflexive & reciprocal pronominal verbs.',
    descriptionDari:
      'ساخت جملات منفی پیشرفته، سه روش پرسش‌سازی در فرانسوی و صرف کامل افعال ضمیردار (انعکاسی و متقابل).',
    color: '#0D9488', // Teal
    iconName: 'Layers',
    lessonIds: [
      'fr-lesson-negation',
      'fr-lesson-questions',
      'fr-lesson-pronominal-verbs',
    ],
  },
  {
    id: 'fr-mod-past-tenses',
    category: 'past-tenses',
    order: 5,
    titleFr: 'Les Temps du Passé : Passé Composé, Imparfait & Plus-que-parfait',
    titleEn: 'Past Tenses: Passé Composé, Imparfait & Pluperfect',
    titleDari: 'زمان‌های گذشته: گذشته نقلی، استمراری و بعید',
    badge: 'All-in-One Ch. 15–16 • Complete Grammar Units 7, 8, 10',
    descriptionFr:
      'Auxiliaire avoir vs être (les 17 verbes de mouvement & pronominaux), règles d’accord du participe passé, l’art de moduler Imparfait et Passé Composé dans un récit, et l’antériorité du Plus-que-parfait.',
    descriptionEn:
      'Master avoir vs être in the passé composé, past participle agreement, imparfait vs passé composé narrative contrast, and plus-que-parfait.',
    descriptionDari:
      'گذشته نقلی با avoir و être، قوانین مطابقت اسم مفعول، هنر ترکیب Imparfait و Passé Composé در روایت و گذشته بعید.',
    color: '#D97706', // Amber
    iconName: 'Compass',
    lessonIds: [
      'fr-lesson-passe-compose-avoir',
      'fr-lesson-passe-compose-etre',
      'fr-lesson-imparfait-vs-pc',
    ],
  },
  {
    id: 'fr-mod-future-conditional',
    category: 'future-conditional',
    order: 6,
    titleFr: 'Le Futur & Le Conditionnel (Hypothèses en « Si »)',
    titleEn: 'Future Tenses, Conditional & Si Clauses',
    titleDari: 'زمان آینده ساده، آینده کامل، شرطی و جملات شرطی با Si',
    badge: 'All-in-One Ch. 17–19 • Complete Grammar Units 9, 11, 12',
    descriptionFr:
      'Futur simple et futur antérieur (avec quand, dès que, aussitôt que), conditionnel présent et passé, les 3 structures hypothétiques avec « Si », et les nuances de Could / Should / Would (aurait pu, aurait dû).',
    descriptionEn:
      'Simple & anterior future after time conjunctions, present & past conditional, the 3 Si clause rules, and could/should/would nuances.',
    descriptionDari:
      'آینده ساده و کامل پس از قیدهای زمان، شرطی حال و گذشته، سه قانون طلایی جملات شرطی با Si و بیان حسرت یا سرزنش (aurait dû / aurait pu).',
    color: '#DC2626', // Crimson
    iconName: 'ArrowRight',
    lessonIds: [
      'fr-lesson-futur-simple-anterieur',
      'fr-lesson-conditionnel-si',
      'fr-lesson-could-should-would',
    ],
  },
  {
    id: 'fr-mod-subjunctive-moods',
    category: 'subjunctive-moods',
    order: 7,
    titleFr: "Le Subjonctif, l'Impératif, l'Infinitif & le Gérondif",
    titleEn: 'Subjunctive, Imperative, Infinitive & Gerund Moods',
    titleDari: 'وجه التزامی (Subjonctif)، امری، مصدری و قید حالت (Gérondif)',
    badge: 'All-in-One Ch. 20, 22–24 • Complete Grammar Units 13–15, 19',
    descriptionFr:
      'Formation du subjonctif présent et passé, verbes irréguliers (sois, aie, puisse, sache, fasse, aille), déclencheurs (volonté, émotion, doute, bien que, pour que), impératif et gérondif (en + -ant).',
    descriptionEn:
      'Present & past subjunctive formation, irregular stems, subjunctive triggers vs indicative, imperative commands, and present participle / gerund.',
    descriptionDari:
      'ساختار و کاربرد وجه التزامی (Subjonctif) پس از افعال اراده، احساس، تردید و حروف ربط، وجه امری و ساختار en + participe présent.',
    color: '#9333EA', // Purple
    iconName: 'GraduationCap',
    lessonIds: [
      'fr-lesson-subjunctive-formation',
      'fr-lesson-subjunctive-uses',
      'fr-lesson-imperative-gerund-infinitive',
    ],
  },
  {
    id: 'fr-mod-pronouns',
    category: 'pronouns',
    order: 8,
    titleFr: 'Tous les Pronoms : COD, COI, Y, En & Doubles Pronoms',
    titleEn: 'All Pronouns: Direct, Indirect, Y, En & Pronoun Order',
    titleDari: 'تمام ضمایر: مفعولی مستقیم و غیرمستقیم، Y، En و ترتیب ضمایر',
    badge: 'All-in-One Ch. 26 • Complete Grammar Units 21, 23',
    descriptionFr:
      'Remplacez les noms avec précision : COD (le, la, les), COI (lui, leur), pronoms toniques (moi, eux), pronoms adverbiaux Y et EN, le tableau de l’ordre des doubles pronoms, démonstratifs (celui) et possessifs (le mien).',
    descriptionEn:
      'Master COD, COI, disjunctive pronouns, Y and EN, the double-pronoun order sequence, and demonstrative/possessive pronouns.',
    descriptionDari:
      'ضمایر مفعولی مستقیم (COD) و غیرمستقیم (COI)، ضمایر تأکیدی، کاربرد دقیق Y و En، جدول ترتیب دو ضمیر در جمله، و ضمایر اشاره و ملکی.',
    color: '#4F46E5', // Indigo
    iconName: 'Sliders',
    lessonIds: [
      'fr-lesson-cod-coi-disjunctive',
      'fr-lesson-pronouns-y-en',
      'fr-lesson-demonstrative-possessive',
    ],
  },
  {
    id: 'fr-mod-syntax-discourse',
    category: 'syntax-discourse',
    order: 9,
    titleFr: 'Pronoms Relatifs, Voix Passive & Discours Indirect',
    titleEn: 'Relative Pronouns, Passive Voice & Indirect Speech',
    titleDari: 'ضمایر موصولی، مجهول، گذشته ادبی و نقل قول غیرمستقیم',
    badge: 'All-in-One Ch. 9, 25, 27 • Complete Grammar Units 16–18, 24',
    descriptionFr:
      'Reliez vos idées avec qui, que, dont, où, lequel et ce qui / ce que / ce dont ; maîtrisez la voix passive (par vs de), le passé simple littéraire et la concordance des temps au discours indirect.',
    descriptionEn:
      'Connect clauses with qui, que, dont, où, lequel, ce qui/que/dont; master the passive voice, literary passé simple, and indirect speech tense harmony.',
    descriptionDari:
      'اتصال جملات با ضمایر موصولی qui، que، dont، où و lequel، ساختار مجهول، آشنایی با گذشته ساده ادبی و هماهنگی زمان‌ها در نقل قول غیرمستقیم.',
    color: '#059669', // Emerald
    iconName: 'BookCheck',
    lessonIds: [
      'fr-lesson-relative-pronouns',
      'fr-lesson-passive-passe-simple',
      'fr-lesson-indirect-speech',
    ],
  },
  {
    id: 'fr-mod-adjectives-numbers',
    category: 'adjectives-numbers',
    order: 10,
    titleFr: 'Adjectifs, Adverbes, Comparatifs & Nombres',
    titleEn: 'Adjectives, Adverbs, Comparisons & Numbers',
    titleDari: 'صفت‌ها، قیدها، ساختارهای مقایسه‌ای و اعداد فرانسوی',
    badge: 'All-in-One Ch. 4, 28–29 • Complete Grammar Units 22, 25–26',
    descriptionFr:
      'Accord et place des adjectifs (règle BAGS, adjectifs à double sens : un grand homme vs un homme grand), formation des adverbes (-ment), meilleur vs mieux, expressions de temps (depuis, pendant, il y a) et nombres.',
    descriptionEn:
      'Adjective agreement & BAGS placement, meaning-shifting adjectives, adverbs in -ment, meilleur vs mieux, time markers, and numbers.',
    descriptionDari:
      'مطابقت و جایگاه صفت‌ها (قانون BAGS و تغییر معنا بر اساس جایگاه)، ساخت قید با -ment، تفاوت meilleur و mieux، قیدهای زمان و اعداد.',
    color: '#B45309', // Warm Amber
    iconName: 'ListFilter',
    lessonIds: [
      'fr-lesson-adjectives',
      'fr-lesson-adverbs-comparisons',
      'fr-lesson-numbers-dates',
    ],
  },
  {
    id: 'fr-mod-prepositions-solver',
    category: 'prepositions-solver',
    order: 11,
    titleFr: 'Prépositions, Régimes des Verbes & Solutionneur de Pièges',
    titleEn: 'Prepositions, Verb Regimes & French Problem Solver',
    titleDari: 'حروف اضافه افعال، افعال گیج‌کننده و اصطلاحات پیشرفته',
    badge: 'All-in-One Ch. 21, 30–32 • Complete Grammar Units 14, 27',
    descriptionFr:
      'Verbes + à / de / ø avant l’infinitif, duos pièges (savoir vs connaître, rendre vs retourner vs rentrer, amener vs apporter, manquer à), et structures idiomatiques (avoir beau, quitte à, quoi que / quel que).',
    descriptionEn:
      'Verbs requiring à or de before an infinitive, tricky verb pairs (savoir/connaître, rendre/retourner, manquer à), and high-level idioms (avoir beau, quitte à).',
    descriptionDari:
      'حروف اضافه à و de پس از افعال، تفاوت افعال پرچالش (savoir/connaître، rendre/retourner، amener/apporter، manquer à) و اصطلاحات پیشرفته (avoir beau، quitte à).',
    color: '#E11D48', // Rose
    iconName: 'Flame',
    lessonIds: [
      'fr-lesson-verb-prepositions',
      'fr-lesson-confusing-verbs',
      'fr-lesson-idioms-connectors',
    ],
  },
];

