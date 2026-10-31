import { GrammarLesson } from '../../../types/grammar';

export const GERUNDS_LESSONS: GrammarLesson[] = [
  // 23. Gerund vs Infinitive
  {
    id: 'lesson-gerund-vs-infinitive',
    moduleId: 'mod-gerunds',
    unitNumber: 23,
    level: 'B1',
    titleEn: 'Verb + Gerund (-ing) vs Verb + Infinitive (to...)',
    titleFr: 'Gérondif (-ing) vs Infinitif (to...)',
    titleDari: 'فعل با اسم مصدر (-ing) در مقابل مصدر با to',
    summaryEn:
      'Learn which English verbs are strictly followed by the gerund (-ing) and which require the full infinitive (to + verb).',
    summaryFr:
      'Apprenez quels verbes sont obligatoirement suivis du gérondif (-ing) et lesquels exigent l’infinitif (to + verbe).',
    summaryDari:
      'افعالی که بعد از آنها اسم مصدر (-ing) می‌آید در مقابل افعالی که با to همراه می‌شوند.',
    sources: {
      murphyUnits: [53, 54, 55],
      azarChapters: [14],
      description: 'Murphy Units 53–55; Azar Charts 14-1 to 14-4',
    },
    chart: {
      title: 'Common Verbs: Gerund vs Infinitive (Murphy & Azar)',
      titleFr: 'Classification des Verbes Principaux',
      titleDari: 'جدول دسته‌بندی افعال نیازمند ing و to',
      headers: ['Modèle', 'Verbes Fréquents', 'Exemple'],
      rows: [
        {
          col1: 'Followed strictly by -ING',
          col2: 'enjoy, avoid, consider, mind, postpone, suggest, practice, admit, finish',
          notes: 'I enjoy reading novels. (NOT: enjoy to read)',
          notesFr: 'Toujours en -ing après ces verbes.',
        },
        {
          col1: 'Followed strictly by TO + Verb',
          col2: 'decide, hope, promise, refuse, manage, offer, agree, afford, tend',
          notes: 'She decided to study medicine. (NOT: decided studying)',
          notesFr: 'Toujours to + infinitif après ces verbes.',
        },
        {
          col1: 'Followed by either with NO meaning difference',
          col2: 'begin, start, continue, intend',
          notes: 'It started to rain = It started raining.',
          notesFr: 'Les deux sont interchangeables sans nuance.',
        },
      ],
    },
    rules: [
      {
        id: 'rg-1',
        ruleEn: 'The verb "suggest" NEVER takes an infinitive with "to". Use suggest + -ing or suggest that someone (should) do.',
        ruleFr: 'Le verbe "suggest" ne prend JAMAIS d’infinitif. Dites "suggest doing" ou "suggest that...".',
        ruleDari: 'فعل suggest هرگز با to نمی‌آید. فقط suggest + ing یا suggest that.',
        exampleEn: 'He suggested going to the cinema. (NOT: suggested to go)',
        exampleFr: 'Il a suggéré d’aller au cinéma.',
        exampleDari: 'او پیشنهاد داد به سینما برویم.',
        isAlert: true,
      },
    ],
    exercises: [
      {
        id: 'ex-23-1',
        type: 'multiple-choice',
        promptEn: 'Choose the correct verbal complement:',
        promptFr: 'Choisissez le bon complément de verbe :',
        promptDari: 'مکمل مناسب فعل را انتخاب کنید:',
        sourceRef: 'Murphy Unit 53',
        sentence: 'Have you finished ___ your presentation for tomorrow?',
        options: ['preparing', 'to prepare', 'prepare', 'prepared'],
        correctAnswer: 'preparing',
        explanationEn: 'The verb "finish" is strictly followed by the gerund (-ing form).',
        explanationFr: 'Le verbe "finish" est obligatoirement suivi du gérondif en -ing.',
        explanationDari: 'بعد از فعل finish حتماً باید شکل ing دار فعل (preparing) بیاید.',
      },
    ],
  },

  // 24. Verbs with Meaning Shift
  {
    id: 'lesson-verbs-meaning-change',
    moduleId: 'mod-gerunds',
    unitNumber: 24,
    level: 'B2',
    titleEn: 'Verbs with Meaning Shift: Remember, Stop, Try, Regret',
    titleFr: 'Verbes à Double Sens : Stop, Remember, Try, Regret',
    titleDari: 'افعالی که با تغییر فرم، معنایشان تغییر می‌کند',
    summaryEn:
      'Crucial contrast: stop doing (quit an activity) vs stop to do (pause in order to do something); remember doing (memory of past) vs remember to do (don’t forget a duty).',
    summaryFr:
      'Distinction fondamentale : stop doing (cesser une activité) vs stop to do (s’arrêter pour faire autre chose) ; remember doing (souvenir) vs remember to do (ne pas oublier).',
    summaryDari:
      'تغییر معنا با stop doing (ترک یک کار) در مقابل stop to do (توقف به قصد انجام کاری دیگر).',
    sources: {
      murphyUnits: [56, 57, 58],
      azarChapters: [14],
      description: 'Murphy Units 56–58; Azar Chart 14-5',
    },
    comparison: {
      titleEn: 'stop doing vs stop to do',
      titleFr: 'Arrêter de faire vs S’arrêter pour faire',
      titleDari: 'دست کشیدن از کار در مقابل توقف برای انجام کاری',
      itemA: {
        name: 'Stop + Gerund (-ing)',
        form: 'stop + verb-ing',
        conceptEn: 'To terminate, cease, or quit an ongoing activity permanently or temporarily.',
        conceptFr: 'Mettre fin, interrompre ou abandonner une activité.',
        conceptDari: 'پایان دادن، قطع کردن یا ترک کردن یک فعالیت.',
        exampleEn: 'He stopped smoking five years ago. (He doesn’t smoke anymore).',
        exampleFr: 'Il a arrêté de fumer il y a cinq ans (il ne fume plus).',
        exampleDari: 'او پنج سال پیش سیگار کشیدن را متوقف کرد.',
      },
      itemB: {
        name: 'Stop + Infinitive (to do)',
        form: 'stop + to + verb',
        conceptEn: 'To interrupt what you were doing IN ORDER TO do a different action.',
        conceptFr: 'Interrompre ce que vous étiez en train de faire AFIN DE réaliser une autre action.',
        conceptDari: 'کاری که می‌کردید را متوقف می‌کنید تا کار دیگری انجام دهید.',
        exampleEn: 'While driving on the highway, he stopped to buy a bottle of water.',
        exampleFr: 'Pendant qu’il conduisait, il s’est arrêté pour acheter une bouteille d’eau.',
        exampleDari: 'در حین رانندگی توقف کرد تا یک بطری آب بخرد.',
      },
      keyContrastEn:
        'stop doing = quit that action. stop to do = halt one thing in order to perform another.',
      keyContrastFr:
        'stop doing = cesser cette action. stop to do = faire une pause dans le but de faire cette action.',
      keyContrastDari:
        'stop doing یعنی ترک آن کار؛ stop to do یعنی توقف به هدف انجام آن کار.',
    },
    rules: [
      {
        id: 'rvm-1',
        ruleEn: 'Remember to do = remember a task before doing it. Remember doing = recall a past memory after it occurred.',
        ruleFr: 'Remember to do = penser à accomplir une tâche. Remember doing = avoir le souvenir d’un fait passé.',
        ruleDari: 'remember to do یعنی فراموش نکن کاری را انجام دهی؛ remember doing یعنی به یاد آوردن خاطره‌ای از گذشته.',
        exampleEn: 'Please remember to lock the door! vs I remember locking the door before leaving.',
        exampleFr: 'Pense à fermer la porte à clé ! vs Je me rappelle avoir fermé la porte.',
        exampleDari: 'یادت باشد در را قفل کنی! در مقابل یادم می‌آید که در را قفل کردم.',
      },
    ],
    exercises: [
      {
        id: 'ex-24-1',
        type: 'multiple-choice',
        promptEn: 'Choose the correct form based on the meaning:',
        promptFr: 'Choisissez la bonne forme selon le sens recherché :',
        promptDari: 'بر اساس معنای مورد نظر فرم درست را انتخاب کنید:',
        sourceRef: 'Murphy Unit 56',
        sentence: 'I clearly remember ___ my passport in the desk drawer this morning.',
        options: ['putting', 'to put', 'put', 'have put'],
        correctAnswer: 'putting',
        explanationEn: 'The speaker is recalling a vivid past memory ("I clearly remember"), which requires the gerund ("putting").',
        explanationFr: 'Le locuteur évoque un souvenir passé précis ("je me rappelle distinctement"), ce qui exige le gérondif ("putting").',
        explanationDari: 'گوینده خاطره‌ای در گذشته را به یاد می‌آورد، پس به gerund (putting) نیاز است.',
      },
    ],
  },

  // 25. Preposition + Gerund
  {
    id: 'lesson-prepositions-gerund',
    moduleId: 'mod-gerunds',
    unitNumber: 25,
    level: 'B1',
    titleEn: 'Prepositions + Gerund (-ing)',
    titleFr: 'Prépositions + Gérondif (-ing) & Piège du "To"',
    titleDari: 'حروف اضافه با اسم مصدر و دام کلمه To',
    summaryEn:
      'Universal rule: after ANY preposition, a verb must be in the -ing form. Be careful when "to" is a preposition (look forward to seeing you)!',
    summaryFr:
      'Règle absolue : après TOUTE préposition, un verbe prend obligatoirement -ing. Attention aux cas où "to" est une préposition !',
    summaryDari:
      'قانون طلایی: بعد از هر حرف اضافه‌ای فعل حتماً باید ing بگیرد. توجه ویژه به کلمه to وقتی حرف اضافه است!',
    sources: {
      murphyUnits: [60, 61, 62],
      azarChapters: [14],
      description: 'Murphy Units 60–62; Azar Chart 14-2',
    },
    rules: [
      {
        id: 'rpg-1',
        ruleEn: 'Whenever a verb follows a preposition (in, on, at, about, for, of, without, instead of), it MUST end in -ing.',
        ruleFr: 'Dès qu’un verbe suit une préposition, il se termine OBLIGATOIREMENT par -ing.',
        ruleDari: 'هرگاه فعلی بعد از یک حرف اضافه بیاید، حتماً باید به صورت ing دار باشد.',
        exampleEn: 'She succeeded by working hard every single day. (NOT: by to work / by work)',
        exampleFr: 'Elle a réussi en travaillant dur chaque jour.',
        exampleDari: 'او با سخت کار کردن در هر روز موفق شد.',
      },
      {
        id: 'rpg-2',
        ruleEn: 'In phrases like "look forward to", "object to", and "be used to", "to" is a preposition, so use -ing!',
        ruleFr: 'Dans "look forward to" ou "object to", "to" est une préposition : le verbe qui suit prend donc -ing !',
        ruleDari: 'در عباراتی مانند look forward to کلمه to حرف اضافه است و بعد از آن باید ing بیاید.',
        exampleEn: 'I look forward to hearing from you soon. (NOT: look forward to hear)',
        exampleFr: 'Au plaisir de vous lire bientôt.',
        exampleDari: 'مشتاقانه منتظر شنیدن پاسخ شما هستم.',
        isAlert: true,
      },
    ],
    exercises: [
      {
        id: 'ex-25-1',
        type: 'multiple-choice',
        promptEn: 'Choose the correct form for the professional email closing:',
        promptFr: 'Choisissez la bonne formule pour clôturer un e-mail professionnel :',
        promptDari: 'فرم مناسب را برای پایان ایمیل کاری انتخاب کنید:',
        sourceRef: 'Murphy Unit 60',
        sentence: 'We look forward to ___ you at the upcoming summit.',
        options: ['meeting', 'meet', 'to meet', 'met'],
        correctAnswer: 'meeting',
        explanationEn: 'In "look forward to", "to" is a preposition, so it must be followed by a gerund ("meeting").',
        explanationFr: 'Dans "look forward to", "to" est une préposition suivie du gérondif ("meeting").',
        explanationDari: 'در عبارت look forward to کلمه to حرف اضافه است و باید با meeting همراه شود.',
      },
    ],
  },
];

