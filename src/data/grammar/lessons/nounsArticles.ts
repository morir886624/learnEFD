import { GrammarLesson } from '../../../types/grammar';

export const NOUNS_ARTICLES_LESSONS: GrammarLesson[] = [
  // 26. Countable vs Uncountable Nouns
  {
    id: 'lesson-countable-uncountable',
    moduleId: 'mod-nouns',
    unitNumber: 26,
    level: 'A2',
    titleEn: 'Countable vs Uncountable Nouns',
    titleFr: 'Noms Dénombrables vs Indénombrables (Advice, Furniture...)',
    titleDari: 'اسامی قابل شمارش در مقابل غیرقابل شمارش',
    summaryEn:
      'Learn the famous English uncountable nouns that are countable in many other languages (advice, news, luggage, information, furniture).',
    summaryFr:
      'Repérez les faux amis indénombrables en anglais (advice, information, luggage, furniture) qui ne prennent jamais de "s" ni de "a/an".',
    summaryDari:
      'یادگیری اسامی غیرقابل شمارش مشهور در انگلیسی که در سایر زبان‌ها قابل شمارش هستند.',
    sources: {
      murphyUnits: [69, 70, 71],
      azarChapters: [7],
      description: 'Murphy Units 69–71; Azar Charts 7-2 to 7-4',
    },
    chart: {
      title: 'Famous Uncountable Nouns in English (Murphy & Azar)',
      titleFr: 'Les Noms Indénombrables Pièges en Anglais',
      titleDari: 'اسامی غیرقابل شمارش گمراه‌کننده',
      headers: ['Nom en Anglais', 'Traduction', 'Comment Dire "Un/Une"'],
      rows: [
        {
          col1: 'advice',
          col2: 'conseils (indénombrable)',
          notes: 'a piece of advice (NOT: an advice)',
          notesFr: 'Jamais "an advice" !',
        },
        {
          col1: 'information',
          col2: 'informations (indénombrable)',
          notes: 'a piece of information (NOT: informations)',
          notesFr: 'Pas de "s" à information.',
        },
        {
          col1: 'furniture',
          col2: 'meubles (indénombrable)',
          notes: 'an item of furniture (NOT: a furniture)',
          notesFr: 'Désigne l’ensemble du mobilier.',
        },
        {
          col1: 'luggage / baggage',
          col2: 'bagages (indénombrable)',
          notes: 'a piece of luggage (NOT: luggages)',
          notesFr: 'Jamais de "s" à luggage.',
        },
        {
          col1: 'news',
          col2: 'nouvelles (singulier !)',
          notes: 'The news is good! (takes singular verb is)',
          notesFr: 'Finit par "s" mais est singulier !',
        },
      ],
    },
    rules: [
      {
        id: 'rnu-1',
        ruleEn: 'Uncountable nouns CANNOT take "a" or "an", and NEVER have a plural "-s".',
        ruleFr: 'Les noms indénombrables ne prennent JAMAIS "a/an" ni de "-s" au pluriel.',
        ruleDari: 'اسامی غیرقابل شمارش هرگز a/an نمی‌گیرند و جمع بسته نمی‌شوند.',
        exampleEn: 'Can you give me some advice? (NOT: an advice / advices)',
        exampleFr: 'Peux-tu me donner un conseil ?',
        exampleDari: 'می‌توانی به من نصیحتی بکنی؟',
        isAlert: true,
      },
    ],
    exercises: [
      {
        id: 'ex-26-1',
        type: 'multiple-choice',
        promptEn: 'Choose the correct phrasing:',
        promptFr: 'Choisissez la formulation correcte :',
        promptDari: 'عبارت درست را انتخاب کنید:',
        sourceRef: 'Murphy Unit 70',
        sentence: 'Could you give me a useful ___ about traveling in Europe?',
        options: ['piece of advice', 'advice', 'advices', 'piece of advices'],
        correctAnswer: 'piece of advice',
        explanationEn: '"Advice" is uncountable, so you must say "a piece of advice", never "an advice".',
        explanationFr: '"Advice" est indénombrable : on dit "a piece of advice", jamais "an advice".',
        explanationDari: 'چون advice غیرقابل شمارش است، باید گفت a piece of advice.',
      },
    ],
  },

  // 27. Articles: A / An, The, and Zero Article
  {
    id: 'lesson-articles-a-the-zero',
    moduleId: 'mod-nouns',
    unitNumber: 27,
    level: 'B1',
    titleEn: 'Articles: A/An, The & Zero Article',
    titleFr: 'Les Articles : A/An (Indéfini), The (Défini) & Article Zéro',
    titleDari: 'حروف تعریف: a/an، the و عدم استفاده از حرف تعریف',
    summaryEn:
      'Master the definite vs indefinite article, when to use NO article (generalizations), and geographical conventions (rivers vs lakes).',
    summaryFr:
      'Maîtrisez "the" vs "a/an", sachez quand ne mettre AUCUN article (généralités) et les conventions géographiques.',
    summaryDari:
      'کاربرد the در برابر a/an، موارد عدم نیاز به حرف تعریف برای تعمیم و اسامی جغرافیایی.',
    sources: {
      murphyUnits: [72, 73, 74, 75, 77, 78],
      azarChapters: [7],
      description: 'Murphy Units 72–78; Azar Charts 7-6 to 7-8',
    },
    rules: [
      {
        id: 'rart-1',
        ruleEn: 'Do NOT use "the" when speaking about things or people in general with plural or uncountable nouns.',
        ruleFr: 'Ne mettez PAS "the" pour parler des choses en général avec un nom pluriel ou indénombrable.',
        ruleDari: 'هنگام صحبت کلی درباره چیزها یا افراد با اسم جمع یا غیرقابل شمارش، the نیاورید.',
        exampleEn: 'Doctors work long hours. (NOT: The doctors work...) / I love music. (NOT: the music)',
        exampleFr: 'Les médecins font de longues journées. / J’aime la musique.',
        exampleDari: 'پزشکان ساعت‌های طولانی کار می‌کنند. / من موسیقی را دوست دارم.',
        isAlert: true,
      },
      {
        id: 'rart-2',
        ruleEn: 'Use "the" with oceans, seas, rivers, mountain ranges (the Alps), and countries with plural/union names (the USA, the Netherlands).',
        ruleFr: 'Utilisez "the" avec les mers, océans, fleuves (the Seine), chaînes de montagnes (the Alps) et républiques/états pluriels.',
        ruleDari: 'با اقیانوس‌ها، دریاها، رودها، رشته‌کوه‌ها و کشورهای دارای کلمه States یا Kingdom از the استفاده کنید.',
        exampleEn: 'The Nile is the longest river. / He climbed Mount Everest (singular mountain = no the).',
        exampleFr: 'Le Nil est le plus long fleuve. / Il a gravi le Mont Everest.',
        exampleDari: 'نیل طولانی‌ترین رودخانه است.',
      },
    ],
    exercises: [
      {
        id: 'ex-27-1',
        type: 'multiple-choice',
        promptEn: 'Choose the correct article usage for a general statement:',
        promptFr: 'Choisissez l’article correct pour une vérité générale :',
        promptDari: 'حرف تعریف مناسب برای یک بیان کلی را انتخاب کنید:',
        sourceRef: 'Murphy Unit 75',
        sentence: '___ are fascinating animals that have sharp eyesight.',
        options: ['Owls', 'The owls', 'An owl of all', 'The all owls'],
        correctAnswer: 'Owls',
        explanationEn: 'When making a general statement about all owls, English uses the plural noun with NO article ("zero article").',
        explanationFr: 'Pour une généralité sur tous les hiboux, on emploie le pluriel sans article : "Owls".',
        explanationDari: 'برای بیان یک اصل کلی در مورد جغدها نیازی به حرف تعریف the نیست.',
      },
    ],
  },

  // 28. Quantifiers: Much/Many, Few/Little, Some/Any
  {
    id: 'lesson-quantifiers',
    moduleId: 'mod-nouns',
    unitNumber: 28,
    level: 'B1',
    titleEn: 'Quantifiers: Few vs A Few, Little vs A Little',
    titleFr: 'Quantifieurs : Nuance Cruciale de Few vs A Few, Little vs A Little',
    titleDari: 'کلمات کمیت: تفاوت ظریف few با a few و little با a little',
    summaryEn:
      'Learn the profound difference in attitude: "few / little" (negative: almost none) vs "a few / a little" (positive: some, sufficient).',
    summaryFr:
      'Découvrez la nuance d’esprit : "few / little" (négatif : presque aucun) vs "a few / a little" (positif : un peu, suffisant).',
    summaryDari:
      'تفاوت نگرش منفی (few/little یعنی تقریباً هیچ) با نگرش مثبت (a few/a little یعنی مقداری هرچند کم).',
    sources: {
      murphyUnits: [85, 86, 87],
      azarChapters: [7],
      description: 'Murphy Units 85–87; Azar Chart 7-5',
    },
    comparison: {
      titleEn: 'a few / a little (Positive) vs few / little (Negative)',
      titleFr: 'A few / A little (Positif) vs Few / Little (Négatif)',
      titleDari: 'دیدگاه مثبت در مقابل دیدگاه منفی در بیان کمیت',
      itemA: {
        name: 'A few / A little (Positive attitude)',
        form: 'a few (+ plural count)  |  a little (+ non-count)',
        conceptEn: 'Means "some", a modest amount, but enough to feel optimistic or pleased.',
        conceptFr: 'Signifie "quelques-uns / un peu", une petite quantité mais suffisante et positive.',
        conceptDari: 'به معنای مقداری هرچند اندک، با بار معنایی مثبت و راضی‌کننده.',
        exampleEn: "I have a few friends in the city, so I don't feel lonely.",
        exampleFr: 'J’ai quelques amis en ville, donc je ne me sens pas seul.',
        exampleDari: 'من چند دوست در شهر دارم، بنابراین احساس تنهایی نمی‌کنم.',
      },
      itemB: {
        name: 'Few / Little (Negative attitude)',
        form: 'few (+ plural count)  |  little (+ non-count)',
        conceptEn: 'Means "hardly any", nearly zero, emphasizing a lack or disappointment.',
        conceptFr: 'Signifie "presque aucun / presque pas", insistant sur le manque ou la déception.',
        conceptDari: 'به معنای تقریباً هیچ؛ تأکید بر کمبود، فقر یا ناامیدی.',
        exampleEn: 'He has few friends in the city, so he feels very lonely and isolated.',
        exampleFr: 'Il a très peu d’amis en ville, il se sent donc très seul et isolé.',
        exampleDari: 'او دوستان بسیار کمی در شهر دارد، به همین دلیل بسیار احساس تنهایی می‌کند.',
      },
      keyContrastEn:
        'With "A" = positive (some). Without "A" = negative (almost none).',
      keyContrastFr:
        'Avec "A" = positif (quelques-uns). Sans "A" = négatif (presque aucun).',
      keyContrastDari:
        'با حرف A یعنی مقداری وجود دارد (مثبت)؛ بدون A یعنی تقریباً هیچی نیست (منفی).',
    },
    rules: [
      {
        id: 'rq-1',
        ruleEn: 'Use "some" in questions when offering or requesting something expecting "yes".',
        ruleFr: 'Utilisez "some" dans les questions pour offrir ou demander poliment quelque chose.',
        ruleDari: 'در پیشنهاد دادن یا درخواست مؤدبانه در جملات سؤالی از some استفاده کنید.',
        exampleEn: 'Would you like some coffee? / Could I have some water, please?',
        exampleFr: 'Voulez-vous du café ?',
        exampleDari: 'کمی قهوه میل دارید؟',
      },
    ],
    exercises: [
      {
        id: 'ex-28-1',
        type: 'multiple-choice',
        promptEn: 'Choose the quantifier with a positive outlook:',
        promptFr: 'Choisissez le quantifieur avec une nuance positive :',
        promptDari: 'کلمه کمیت با بار مثبت را انتخاب کنید:',
        sourceRef: 'Murphy Unit 87',
        sentence: "Don't panic, we still have ___ time before the gate closes.",
        options: ['a little', 'little', 'few', 'a few'],
        correctAnswer: 'a little',
        explanationEn: '"Time" is uncountable, and "Don\'t panic" shows a reassuring, positive attitude ("a little").',
        explanationFr: '"Time" est indénombrable et "ne paniquez pas" indique une nuance positive ("a little").',
        explanationDari: 'کلمه time غیرقابل شمارش است و برای آرامش دادن نیاز به a little است.',
      },
    ],
  },
];

