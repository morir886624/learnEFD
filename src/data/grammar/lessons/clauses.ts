import { GrammarLesson } from '../../../types/grammar';

export const CLAUSES_LESSONS: GrammarLesson[] = [
  // 20. Relative / Adjective Clauses
  {
    id: 'lesson-relative-clauses',
    moduleId: 'mod-clauses',
    unitNumber: 20,
    level: 'B1',
    titleEn: 'Relative Clauses: Who, Which, That & Whose',
    titleFr: 'Propositions Relatives : Who, Which, That & Whose',
    titleDari: 'بندهای موصولی: who, which, that, whose',
    summaryEn:
      'Learn how to combine sentences using relative pronouns, omit object pronouns, and distinguish defining (no commas) from non-defining (commas) clauses.',
    summaryFr:
      'Combinez vos phrases avec les pronoms relatifs, sachez quand les omettre et distinguez les relatives restrictives (sans virgule) des non-restrictives (avec virgules).',
    summaryDari:
      'اتصال جملات با ضمایر موصولی، حذف ضمیر مفعولی و تفاوت جملات موصولی تحدیدی و غیرتحدیدی.',
    sources: {
      murphyUnits: [92, 93, 94, 95, 96],
      azarChapters: [13],
      description: 'Murphy Units 92–96; Azar Charts 13-1 to 13-7',
    },
    formula: {
      affirmative: 'People: who / that  |  Things: which / that  |  Possession: whose',
      negative: 'The man who didn’t speak English...',
      question: 'Is this the book that you were looking for?',
      notesFr: 'JAMAIS de "that" dans une relative entre virgules (non-defining clause) !',
      notesDari: 'هرگز در بندهای موصولی دارای کاما (غیرتحدیدی) از that استفاده نکنید!',
    },
    comparison: {
      titleEn: 'Defining (Essential) vs Non-defining (Extra info with commas)',
      titleFr: 'Relative Restrictive (Essentielle) vs Non-Restrictive (Entre virgules)',
      titleDari: 'بند موصولی ضروری در مقابل بند موصولی اطلاعات اضافی با کاما',
      itemA: {
        name: 'Defining Relative Clause (No commas)',
        form: 'The woman who lives next door is a doctor.',
        conceptEn: 'Essential identification: tells us WHICH specific person or thing is meant. "That" is allowed.',
        conceptFr: 'Essentielle pour identifier la personne. Pas de virgules. "That" est permis.',
        conceptDari: 'برای شناسایی هویت فرد ضروری است؛ بدون کاما و امکان استفاده از that.',
        exampleEn: 'The doctor who treated my mother was exceptionally kind.',
        exampleFr: 'Le médecin qui a soigné ma mère était exceptionnellement gentil.',
        exampleDari: 'پزشکی که مادرم را درمان کرد فوق‌العاده مهربان بود.',
      },
      itemB: {
        name: 'Non-defining Relative Clause (With commas)',
        form: 'My brother John, who lives in Canada, is an architect.',
        conceptEn: 'Gives extra bonus information about someone already known. MUST have commas! CANNOT use "that".',
        conceptFr: 'Donne une information supplémentaire. VIRGULES OBLIGATOIRES ! Interdiction d’employer "that".',
        conceptDari: 'اطلاعات جانبی اضافه می‌دهد؛ حتماً بین کاما قرار می‌گیرد و به کار بردن that ممنوع است.',
        exampleEn: 'Paris, which is the capital of France, attracts millions of tourists.',
        exampleFr: 'Paris, qui est la capitale de la France, attire des millions de touristes.',
        exampleDari: 'پاریس، که پایتخت فرانسه است، میلیون‌ها گردشگر را جذب می‌کند.',
      },
      keyContrastEn:
        'In clauses with commas, NEVER replace "which" or "who" with "that".',
      keyContrastFr:
        'Dans les propositions entre virgules, ne remplacez JAMAIS "which" ou "who" par "that".',
      keyContrastDari:
        'در بندهای موصولی بین دو کاما هرگز that را جایگزین which یا who نکنید.',
    },
    rules: [
      {
        id: 'rrel-1',
        ruleEn: 'You can omit the relative pronoun (who/which/that) ONLY when it is the OBJECT of the relative clause.',
        ruleFr: 'Vous pouvez omettre le pronom relatif SEULEMENT lorsqu’il est le COMPLÉMENT (objet) de la relative.',
        ruleDari: 'تنها زمانی می‌توان ضمیر موصولی را حذف کرد که نقش مفعول جمله پیرو را داشته باشد.',
        exampleEn: 'The book (that) I bought yesterday is fascinating. (I bought IT -> object).',
        exampleFr: 'Le livre que j’ai acheté hier est passionnant.',
        exampleDari: 'کتابی که دیروز خریدم بسیار جذاب است.',
      },
      {
        id: 'rrel-2',
        ruleEn: '"Whose" expresses possession for people, animals, and organizations (replaces his/her/their).',
        ruleFr: '"Whose" exprime la possession (remplace his, her, their).',
        ruleDari: 'کلمه whose برای بیان مالکیت استفاده می‌شود.',
        exampleEn: 'A widow is a woman whose husband has died.',
        exampleFr: 'Une veuve est une femme dont le mari est décédé.',
        exampleDari: 'بیوه زنی است که همسرش فوت کرده است.',
      },
    ],
    exercises: [
      {
        id: 'ex-20-1',
        type: 'multiple-choice',
        promptEn: 'Choose the correct pronoun for this non-defining clause:',
        promptFr: 'Choisissez le bon pronom dans cette proposition entre virgules :',
        promptDari: 'ضمیر موصولی مناسب را برای این جمله با کاما انتخاب کنید:',
        sourceRef: 'Murphy Unit 95',
        sentence: 'Emily’s father, ___ is a renowned surgeon, has just retired.',
        options: ['who', 'that', 'which', 'whom'],
        correctAnswer: 'who',
        explanationEn: 'In a non-defining clause set off by commas about a person, you MUST use "who", never "that".',
        explanationFr: 'Dans une proposition entre virgules concernant une personne, il faut impérativement "who" et JAMAIS "that".',
        explanationDari: 'در جملات دارای کاما برای اشخاص فقط who به کار می‌رود و that ممنوع است.',
      },
    ],
  },

  // 21. Connectors of Contrast & Cause
  {
    id: 'lesson-connectors-contrast-cause',
    moduleId: 'mod-clauses',
    unitNumber: 21,
    level: 'B1',
    titleEn: 'Contrast & Cause: Although vs Despite',
    titleFr: 'Opposition & Cause : Although vs Despite, Because vs Because of',
    titleDari: 'حروف ربط تضاد و سبب: although در مقابل despite',
    summaryEn:
      'Master the critical structural difference: connectors followed by a Subject + Verb clause (although, because) vs connectors followed by a Noun / Gerund (despite, in spite of, because of).',
    summaryFr:
      'La grande différence de structure : les conjonctions suivies d’une proposition Sujet + Verbe (although, because) vs celles suivies d’un Nom / Gérondif (despite, because of).',
    summaryDari:
      'تفاوت ساختاری میان کلماتی که با جمله کامل می‌آیند با کلماتی که با اسم یا مصدر ing دار همراه می‌شوند.',
    sources: {
      murphyUnits: [113],
      azarChapters: [17, 19],
      description: 'Murphy Unit 113; Azar Charts 17-2, 19-1, 19-3',
    },
    comparison: {
      titleEn: 'although + Subject + Verb vs despite + Noun',
      titleFr: 'Although (Bien que + Sujet + Verbe) vs Despite (Malgré + Nom)',
      titleDari: 'although با جمله در مقابل despite با اسم',
      itemA: {
        name: 'Although / Even though (+ clause)',
        form: 'Although + Subject + Verb',
        conceptEn: 'Followed by a full clause with its own subject and conjugated verb.',
        conceptFr: 'Suivi d’une proposition complète avec son propre sujet et son verbe conjugué.',
        conceptDari: 'همراه با یک بند کامل شامل فاعل و فعل صرف‌شده.',
        exampleEn: 'Although it rained heavily all morning, we went for a long hike.',
        exampleFr: 'Bien qu’il ait plu abondamment toute la matinée, nous sommes partis randonner.',
        exampleDari: 'اگرچه تمام صبح به شدت باران بارید، ما به پیاده‌روی رفتیم.',
      },
      itemB: {
        name: 'Despite / In spite of (+ noun / -ing)',
        form: 'Despite / In spite of + Noun / Pronoun / Verb-ing',
        conceptEn: 'Prepositional phrase: MUST be followed by a noun, pronoun, or gerund (NOT subject + verb).',
        conceptFr: 'Locution prépositionnelle : DOIT être suivie d’un nom, pronom ou gérondif.',
        conceptDari: 'عبارت حرف اضافه‌ای: حتماً باید با اسم، ضمیر یا شکل ing فعل بیاید نه جمله.',
        exampleEn: 'Despite the heavy rain, we went for a long hike.',
        exampleFr: 'Malgré la pluie battante, nous sommes partis randonner.',
        exampleDari: 'با وجود باران شدید، به پیاده‌روی رفتیم.',
      },
      keyContrastEn:
        'Never say "despite of"! It is "despite" (alone) OR "in spite OF". Both take a noun, while "although" takes a clause.',
      keyContrastFr:
        'Ne dites JAMAIS "despite of" ! C’est "despite" (seul) OU "in spite OF". Tous deux prennent un nom, alors que "although" prend une phrase.',
      keyContrastDari:
        'هرگز despite of نگویید! یا despite به تنهایی یا in spite of. هر دو با اسم می‌آیند.',
    },
    rules: [
      {
        id: 'rcc-1',
        ruleEn: 'The same rule applies to Cause: "Because + Subject + Verb" vs "Because OF + Noun".',
        ruleFr: 'La même règle s’applique à la cause : "Because + Sujet + Verbe" vs "Because OF + Nom".',
        ruleDari: 'همین قانون برای علت نیز برقرار است: Because با جمله و Because of با اسم.',
        exampleEn: 'We were late because the traffic was bad = We were late because of the bad traffic.',
        exampleFr: 'Nous étions en retard à cause des bouchons.',
        exampleDari: 'به خاطر ترافیک سنگین دیر رسیدیم.',
      },
    ],
    exercises: [
      {
        id: 'ex-21-1',
        type: 'multiple-choice',
        promptEn: 'Choose the correct contrast word:',
        promptFr: 'Choisissez le mot d’opposition correct :',
        promptDari: 'کلمه تضاد مناسب را انتخاب کنید:',
        sourceRef: 'Murphy Unit 113',
        sentence: '___ feeling completely exhausted, Maria finished writing her thesis.',
        options: ['Despite', 'Although', 'Even though', 'In spite'],
        correctAnswer: 'Despite',
        explanationEn: '"Feeling" is a gerund (-ing form), so the preposition "Despite" (or In spite of) is required.',
        explanationFr: '"Feeling" est un gérondif en -ing, il faut donc la préposition "Despite".',
        explanationDari: 'چون فعل با ing آمده (اسم مصدر)، نیاز به Despite است.',
      },
    ],
  },

  // 22. Noun Clauses & Reported Speech
  {
    id: 'lesson-noun-clauses-reported',
    moduleId: 'mod-clauses',
    unitNumber: 22,
    level: 'B2',
    titleEn: 'Noun Clauses & Reported Speech',
    titleFr: 'Propositions Complétives & Discours Indirect',
    titleDari: 'بندهای اسمی و نقل قول غیرمستقیم',
    summaryEn:
      'Master indirect questions (word order: statement, not question!) and tense backshift when reporting speech in the past.',
    summaryFr:
      'Maîtrisez l’ordre des mots dans les questions indirectes (ordre affirmatif !) et la concordance des temps au passé.',
    summaryDari:
      'ترتیب کلمات در سؤالات غیرمستقیم (ترتیب خبری نه سؤالی!) و تغییر زمان افعال در نقل قول گذشته.',
    sources: {
      murphyUnits: [47, 48, 50],
      azarChapters: [12],
      description: 'Murphy Units 47, 48, 50; Azar Charts 12-1 to 12-7',
    },
    rules: [
      {
        id: 'rnc-1',
        ruleEn: 'In embedded / indirect questions, use STATEMENT word order (Subject + Verb), NOT question order.',
        ruleFr: 'Dans les questions indirectes, utilisez l’ordre de la phrase affirmative (Sujet + Verbe), PAS l’inversion.',
        ruleDari: 'در سؤالات غیرمستقیم بعد از کلمه پرسشی ترتیب جمله خبری است (فاعل + فعل).',
        exampleEn: 'Could you tell me where the station is? (NOT: where is the station)',
        exampleFr: 'Pourriez-vous me dire où se trouve la gare ?',
        exampleDari: 'می‌توانید به من بگویید ایستگاه کجاست؟',
        isAlert: true,
      },
      {
        id: 'rnc-2',
        ruleEn: 'When the reporting verb is in the past (He said that...), verbs shift back one tense into the past.',
        ruleFr: 'Quand le verbe introducteur est au passé (He said that...), les temps reculent d’un cran vers le passé.',
        ruleDari: 'وقتی فعل نقل قول گذشته باشد (He said)، زمان‌های داخل نقل قول یک مرحله به گذشته می‌روند.',
        exampleEn: '"I am tired" -> He said he was tired. / "I will come" -> She said she would come.',
        exampleFr: '"I am tired" devient : He said he was tired.',
        exampleDari: 'زمان حال به گذشته و will به would تبدیل می‌شود.',
      },
    ],
    exercises: [
      {
        id: 'ex-22-1',
        type: 'multiple-choice',
        promptEn: 'Choose the correct indirect question word order:',
        promptFr: 'Choisissez le bon ordre des mots dans cette question indirecte :',
        promptDari: 'ترتیب درست کلمات در سؤال غیرمستقیم را انتخاب کنید:',
        sourceRef: 'Murphy Unit 50',
        sentence: 'Do you know what time ___?',
        options: ['the concert starts', 'does the concert start', 'starts the concert', 'is the concert starting'],
        correctAnswer: 'the concert starts',
        explanationEn: 'Indirect questions require standard statement word order: Subject ("the concert") + Verb ("starts").',
        explanationFr: 'Les questions indirectes demandent l’ordre affirmatif : Sujet (the concert) + Verbe (starts).',
        explanationDari: 'در سؤالات غیرمستقیم ترتیب کلمات به صورت فاعل + فعل است.',
      },
    ],
  },
];

