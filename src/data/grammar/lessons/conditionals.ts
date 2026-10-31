import { GrammarLesson } from '../../../types/grammar';

export const CONDITIONALS_LESSONS: GrammarLesson[] = [
  // 13. Zero & First Conditional
  {
    id: 'lesson-conditionals-zero-first',
    moduleId: 'mod-conditionals',
    unitNumber: 13,
    level: 'A2',
    titleEn: 'Real Conditionals: Zero & First',
    titleFr: 'Conditionnel Zéro (Vérités) & Premier Conditionnel (Futur Réel)',
    titleDari: 'شرطی نوع صفر و شرطی نوع اول',
    summaryEn:
      'Learn how to express universal truths (Zero Conditional) and real, realistic future possibilities (First Conditional).',
    summaryFr:
      'Exprimez les lois scientifiques et habitudes (Conditionnel 0) ainsi que les possibilités réelles du futur (Premier Conditionnel).',
    summaryDari:
      'بیان حقایق علمی همیشگی (شرطی صفر) و احتمال‌های واقعی و ممکن در آینده (شرطی نوع اول).',
    sources: {
      murphyUnits: [38],
      azarChapters: [20],
      description: 'Murphy Unit 38; Azar Charts 20-1, 20-2',
    },
    formula: {
      affirmative: 'Zero: If + Present Simple, Present Simple  |  First: If + Present Simple, will + verb',
      negative: "If it doesn't rain, we will go out.",
      question: 'What will you do if it rains tomorrow?',
      notesFr: 'NE METTEZ JAMAIS "will" dans la proposition avec "if" !',
      notesDari: 'هرگز در قسمتی که if وجود دارد از will استفاده نکنید!',
    },
    comparison: {
      titleEn: 'Zero Conditional vs First Conditional',
      titleFr: 'Conditionnel Zéro (Général) vs Premier Conditionnel (Spécifique Futur)',
      titleDari: 'شرطی صفر در مقابل شرطی اول',
      itemA: {
        name: 'Zero Conditional (Facts / Nature)',
        form: 'If + Present Simple -> Present Simple',
        conceptEn: 'Automatic universal result: whenever X happens, Y always happens.',
        conceptFr: 'Résultat universel automatique : chaque fois que X arrive, Y se produit toujours.',
        conceptDari: 'نتیجه همیشگی و علمی: هر زمان شرط برقرار شود، همیشه نتیجه رخ می‌دهد.',
        exampleEn: 'If you heat ice, it melts into water.',
        exampleFr: 'Si on chauffe de la glace, elle fond en eau.',
        exampleDari: 'اگر یخ را گرم کنید، به آب تبدیل می‌شود.',
      },
      itemB: {
        name: 'First Conditional (Real Future Situation)',
        form: 'If + Present Simple -> will + base verb',
        conceptEn: 'A specific real situation in the future that is likely or possible.',
        conceptFr: 'Une situation concrète dans le futur qui est tout à fait possible ou probable.',
        conceptDari: 'یک موقعیت مشخص و محتمل در آینده که امکان رخ دادن دارد.',
        exampleEn: 'If I pass my exam tomorrow, I will celebrate with my friends.',
        exampleFr: 'Si je réussis mon examen demain, je ferai la fête avec mes amis.',
        exampleDari: 'اگر فردا در امتحان قبول شوم، با دوستانم جشن خواهم گرفت.',
      },
      keyContrastEn:
        'Zero = always true in general. First = a specific real test or possibility in the future.',
      keyContrastFr:
        'Zéro = vrai en tout temps. Premier = un événement particulier envisagé dans le futur.',
      keyContrastDari:
        'صفر برای حقیقت همیشگی است، اول برای یک اتفاق محتمل در آینده.',
    },
    rules: [
      {
        id: 'rc-rule-1',
        ruleEn: 'Never use "will" in the IF-clause of a First Conditional sentence.',
        ruleFr: 'N’utilisez jamais "will" dans la proposition introduite par "if".',
        ruleDari: 'در قسمتی از جمله که بعد از if می‌آید نباید will بیاید.',
        exampleEn: 'If it rains tomorrow, we will stay at home. (NOT: If it will rain)',
        exampleFr: 'S’il pleut demain, nous resterons à la maison.',
        exampleDari: 'اگر فردا باران ببارد، در خانه می‌مانیم.',
        isAlert: true,
      },
    ],
    exercises: [
      {
        id: 'ex-13-1',
        type: 'multiple-choice',
        promptEn: 'Choose the correct form for the if-clause:',
        promptFr: 'Choisissez la bonne forme dans la proposition en if :',
        promptDari: 'فرم مناسب را برای بخش شرطی انتخاب کنید:',
        sourceRef: 'Murphy Unit 38',
        sentence: 'If you ___ hard this term, you will easily succeed.',
        options: ['study', 'will study', 'studied', 'are studying'],
        correctAnswer: 'study',
        explanationEn: 'In a First Conditional sentence, the if-clause uses the Present Simple ("study"), never will.',
        explanationFr: 'Dans le premier conditionnel, la proposition avec "if" prend le Présent Simple ("study"), jamais will.',
        explanationDari: 'در شرطی نوع اول بعد از if فعل در زمان حال ساده (study) می‌آید.',
      },
    ],
  },

  // 14. Second & Third Conditionals
  {
    id: 'lesson-conditionals-second-third',
    moduleId: 'mod-conditionals',
    unitNumber: 14,
    level: 'B1',
    titleEn: 'Unreal Conditionals: Second & Third',
    titleFr: 'Conditionnels Irréels : Deuxième (Présent) & Troisième (Passé)',
    titleDari: 'شرطی‌های غیرواقعی: نوع دوم و سوم',
    summaryEn:
      'Explore hypothetical present/future dreams (Second: If I had... I would) vs counterfactual past regrets (Third: If I had known... I would have).',
    summaryFr:
      'Explorez les rêves et hypothèses présentes (2e : If I were you) vs les regrets passés irrémédiables (3e : If I had known).',
    summaryDari:
      'فرض‌های خیالی در زمان حال (نوع دوم) در مقابل حسرت‌ها و اتفاقات گذشته که قابل تغییر نیستند (نوع سوم).',
    sources: {
      murphyUnits: [39, 40],
      azarChapters: [20],
      description: 'Murphy Units 39 & 40; Azar Charts 20-3, 20-4',
    },
    formula: {
      affirmative: '2nd: If + Past Simple, would + base verb  |  3rd: If + had + V3, would have + V3',
      negative: "If I didn't love you, I wouldn't be here. | If she hadn't missed the train, she wouldn't have been late.",
      question: 'What would you do if you won a million dollars?',
      notesFr: 'Dans le 2e conditionnel, l’usage formel privilégie "If I WERE you" plutôt que "If I was you".',
      notesDari: 'در شرطی نوع دوم به طور رسمی برای همه فاعل‌ها از were استفاده می‌شود (If I were you).',
    },
    comparison: {
      titleEn: 'Second Conditional (Imaginary Present) vs Third Conditional (Unchangeable Past)',
      titleFr: 'Deuxième (Hypothèse Présente) vs Troisième (Regret Passé)',
      titleDari: 'شرطی نوع دوم در مقابل نوع سوم',
      itemA: {
        name: 'Second Conditional (Present/Future Unreal)',
        form: 'If + Past Simple -> would + base verb',
        conceptEn: 'Contrary to fact right now, or very unlikely in the future. A dream or hypothetical advice.',
        conceptFr: 'Contraire à la réalité actuelle ou très improbable. Rêve ou conseil imaginaire.',
        conceptDari: 'خلاف واقع در حال حاضر، یا بسیار بعید در آینده؛ خواب و خیال یا نصیحت.',
        exampleEn: 'If I were the president, I would invest heavily in green energy.',
        exampleFr: 'Si j’étais président, j’investirais massivement dans l’énergie verte.',
        exampleDari: 'اگر من رئیس جمهور بودم، سرمایه‌گذاری زیادی روی انرژی پاک می‌کردم.',
      },
      itemB: {
        name: 'Third Conditional (Past Unreal / Counterfactual)',
        form: 'If + had + past participle -> would have + past participle',
        conceptEn: 'Looking back at a past event that did NOT happen. It is completely unchangeable.',
        conceptFr: 'Retour sur un événement passé qui ne s’est PAS produit. Absolument irréversible.',
        conceptDari: 'نگاه به اتفاقی در گذشته که رخ نداده است و گذشته دیگر قابل بازگشت نیست.',
        exampleEn: 'If you had told me earlier, I would have helped you yesterday.',
        exampleFr: 'Si tu me l’avais dit plus tôt, je t’aurais aidé hier (mais tu ne me l’as pas dit).',
        exampleDari: 'اگر زودتر به من گفته بودی، دیروز کمکت می‌کردم (اما نگفتی).',
      },
      keyContrastEn:
        '2nd Conditional imagines a different NOW. 3rd Conditional imagines a different PAST.',
      keyContrastFr:
        'Le 2e imagine un PRÉSENT différent. Le 3e imagine un PASSÉ différent.',
      keyContrastDari:
        'شرطی نوع دوم حال متفاوت و نوع سوم گذشته متفاوتی را متصور می‌شود.',
    },
    rules: [
      {
        id: 'rct-1',
        ruleEn: 'Use "If I were you, I would..." to give thoughtful personal advice.',
        ruleFr: 'Utilisez "If I were you, I would..." pour donner un conseil avisé.',
        ruleDari: 'عبارت If I were you, I would برای نصیحت کردن به کار می‌رود.',
        exampleEn: 'If I were you, I would consult a doctor immediately.',
        exampleFr: 'Si j’étais vous, je consulterais un médecin immédiatement.',
        exampleDari: 'اگر جای شما بودم فوراً به پزشک مراجعه می‌کردم.',
      },
    ],
    exercises: [
      {
        id: 'ex-14-1',
        type: 'multiple-choice',
        promptEn: 'Choose the correct form for this past hypothetical:',
        promptFr: 'Choisissez la bonne forme pour cette hypothèse passée :',
        promptDari: 'فرم درست را برای این فرض در گذشته انتخاب کنید:',
        sourceRef: 'Murphy Unit 40',
        sentence: 'If we ___ an umbrella, we wouldn’t have gotten completely soaked.',
        options: ['had taken', 'took', 'would take', 'have taken'],
        correctAnswer: 'had taken',
        explanationEn: 'The result is "wouldn\'t have gotten" (Third Conditional), so the if-clause requires the Past Perfect ("had taken").',
        explanationFr: 'La conséquence est au conditionnel passé ("wouldn\'t have gotten"), il faut donc le Past Perfect ("had taken").',
        explanationDari: 'در شرطی نوع سوم بخش if به گذشته کامل (had taken) نیاز دارد.',
      },
    ],
  },

  // 15. Wishes & Regrets
  {
    id: 'lesson-wishes-regrets',
    moduleId: 'mod-conditionals',
    unitNumber: 15,
    level: 'B2',
    titleEn: 'Wishes & Regrets (I wish / If only)',
    titleFr: 'Souhaits & Regrets (I wish / If only)',
    titleDari: 'بیان حسرت و آرزو با I wish و If only',
    summaryEn:
      'Master the step-back-in-time rule: I wish I knew (present regret), I wish I had known (past regret), and I wish you would stop (annoying behavior).',
    summaryFr:
      'La règle du recul temporel : I wish I knew (regret présent), I wish I had known (regret passé) et I wish you would (comportement agaçant).',
    summaryDari:
      'قاعده بازگشت یک مرحله به عقب در زمان برای بیان آرزوها در حال و گذشته.',
    sources: {
      murphyUnits: [41],
      azarChapters: [20],
      description: 'Murphy Unit 41; Azar Chart 20-8',
    },
    chart: {
      title: 'The Three Tenses After "I wish" (Murphy & Azar)',
      titleFr: 'Les Trois Temps Après "I wish"',
      titleDari: 'سه زمان بعد از ساختار I wish',
      headers: ['Type de Souhait', 'Structure du Verbe', 'Exemple et Nuance'],
      rows: [
        {
          col1: 'Wish about Present (Situation actuelle différente)',
          col2: 'I wish + Past Simple',
          notes: 'I wish I had more free time. (Reality: I am very busy now)',
          notesFr: 'On regrette la réalité présente.',
        },
        {
          col1: 'Wish about Past (Regret rétrospectif)',
          col2: 'I wish + had + past participle',
          notes: 'I wish I had studied harder for that test. (Reality: I failed)',
          notesFr: 'On regrette ce qui s’est passé.',
        },
        {
          col1: 'Complaint about Behavior (Comportement agaçant)',
          col2: 'I wish + would + base verb',
          notes: 'I wish you would stop interrupting me when I speak!',
          notesFr: 'On veut que quelqu’un d’autre change.',
        },
      ],
    },
    rules: [
      {
        id: 'rw-1',
        ruleEn: 'NEVER use "I wish I would" about yourself. Use "I wish I could" instead.',
        ruleFr: 'Ne dites JAMAIS "I wish I would" pour vous-même. Utilisez "I wish I could".',
        ruleDari: 'هرگز برای خودتان I wish I would نگویید، به جایش از I wish I could استفاده کنید.',
        exampleEn: 'I wish I could play the piano. (NOT: I wish I would play)',
        exampleFr: 'J’aimerais savoir jouer du piano.',
        exampleDari: 'کاش بلد بودم پیانو بزنم.',
        isAlert: true,
      },
    ],
    exercises: [
      {
        id: 'ex-15-1',
        type: 'multiple-choice',
        promptEn: 'Choose the correct form to express a past regret:',
        promptFr: 'Choisissez la bonne forme pour un regret passé :',
        promptDari: 'فرم مناسب برای بیان حسرت گذشته را انتخاب کنید:',
        sourceRef: 'Murphy Unit 41',
        sentence: 'I feel sick today. I wish I ___ so much cake yesterday evening.',
        options: ["hadn't eaten", "didn't eat", "wouldn't eat", "haven't eaten"],
        correctAnswer: "hadn't eaten",
        explanationEn: 'Regrets about the past require "wish + had + past participle" (Past Perfect).',
        explanationFr: 'Un regret concernant un fait passé exige "wish + had not + participe passé".',
        explanationDari: 'حسرت خوردن در مورد گذشته نیاز به گذشته کامل دارد.',
      },
    ],
  },

  // 16. Unless, As long as, In case
  {
    id: 'lesson-unless-in-case',
    moduleId: 'mod-conditionals',
    unitNumber: 16,
    level: 'B1',
    titleEn: 'Alternatives to If: Unless & In Case',
    titleFr: 'Alternatives à If : Unless (À moins que) & In Case (Au cas où)',
    titleDari: 'جایگزین‌های If: کلمات Unless و In Case',
    summaryEn:
      'Learn the precise meanings: "unless" means "except if / if not", while "in case" means doing a precaution in advance.',
    summaryFr:
      'Distinguez "unless" (à moins que / si... ne... pas) et "in case" (prendre une précaution par avance).',
    summaryDari:
      'تفاوت unless (مگر اینکه) با in case (برای احتیاط و پیشگیری).',
    sources: {
      murphyUnits: [114, 115],
      azarChapters: [17, 20],
      description: 'Murphy Units 114 & 115; Azar Chart 20-7',
    },
    comparison: {
      titleEn: 'in case vs if (Precaution vs Reaction)',
      titleFr: 'In case (Précaution anticipée) vs If (Réaction différée)',
      titleDari: 'in case برای احتیاط از قبل در مقابل if برای واکنش بعد از وقوع',
      itemA: {
        name: 'in case (Precaution beforehand)',
        form: 'do action X in case Y happens',
        conceptEn: 'You do action X FIRST as a safety precaution, whether Y happens or not.',
        conceptFr: 'Vous faites l’action X D’ABORD par précaution, que Y arrive ou non.',
        conceptDari: 'ابتدا کار X را برای احتیاط انجام می‌دهید، چه اتفاق Y بیفتد چه نیفتد.',
        exampleEn: "I'll take an umbrella in case it rains. (I carry it with me from home).",
        exampleFr: "Je prends un parapluie au cas où il pleuvrait (je le prends dès maintenant).",
        exampleDari: 'چتری برمی‌دارم مبادا باران ببارد (همین الان با خودم می‌برم).',
      },
      itemB: {
        name: 'if (Conditional Reaction)',
        form: 'do action X only IF Y happens',
        conceptEn: 'You will only do action X AFTER Y happens.',
        conceptFr: 'Vous ne ferez l’action X QUE SI l’événement Y se produit.',
        conceptDari: 'شما فقط زمانی کار X را انجام می‌دهید که اتفاق Y بیفتد.',
        exampleEn: "I'll open the umbrella if it rains. (I will not open it if it doesn't rain).",
        exampleFr: "J'ouvrirai le parapluie s'il pleut (je ne l'ouvre que s'il se met à pleuvoir).",
        exampleDari: 'اگر باران ببارد چتر را باز خواهم کرد.',
      },
      keyContrastEn:
        '"In case" is insurance beforehand. "If" is an action contingent upon the condition.',
      keyContrastFr:
        '"In case" est une précaution anticipée. "If" est une action subordonnée à la condition.',
      keyContrastDari:
        'in case پیشگیری از قبل و if اقدام پس از رخ دادن شرط است.',
    },
    rules: [
      {
        id: 'ru-1',
        ruleEn: '"Unless" means "if not". Do not use a double negative with unless.',
        ruleFr: '"Unless" signifie "sauf si" ou "si... ne... pas". Évitez la double négation.',
        ruleDari: 'کلمه unless به معنای if not است و نباید با فعل منفی ترکیب شود.',
        exampleEn: "We'll be late unless we hurry. (= if we don't hurry)",
        exampleFr: 'Nous serons en retard à moins de nous dépêcher.',
        exampleDari: 'ما دیر می‌رسیم مگر اینکه عجله کنیم.',
      },
    ],
    exercises: [
      {
        id: 'ex-16-1',
        type: 'multiple-choice',
        promptEn: 'Choose the correct connective:',
        promptFr: 'Choisissez le bon connecteur :',
        promptDari: 'حرف ربط درست را انتخاب کنید:',
        sourceRef: 'Murphy Unit 114',
        sentence: "Write down my phone number ___ you forget it later.",
        options: ['in case', 'if', 'unless', 'provided that'],
        correctAnswer: 'in case',
        explanationEn: 'Writing down the phone number is a precautionary measure done right now in case of future forgetting.',
        explanationFr: 'Noter le numéro est une précaution immédiate ("au cas où").',
        explanationDari: 'یادداشت کردن شماره یک اقدام احتیاطی از قبل (in case) است.',
      },
    ],
  },
];

