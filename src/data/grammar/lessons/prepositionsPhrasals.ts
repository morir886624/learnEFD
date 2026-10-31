import { GrammarLesson } from '../../../types/grammar';

export const PREPOSITIONS_PHRASALS_LESSONS: GrammarLesson[] = [
  // 32. Prepositions of Time: At, On, In
  {
    id: 'lesson-prepositions-time',
    moduleId: 'mod-prepositions',
    unitNumber: 32,
    level: 'A1',
    titleEn: 'Prepositions of Time: At, On, In',
    titleFr: 'Prépositions de Temps : At, On, In (La Pyramide du Temps)',
    titleDari: 'حروف اضافه زمان: At, On, In (هرم زمان)',
    summaryEn:
      'Master the time pyramid: AT for precise clock times and moments, ON for days and dates, and IN for longer periods, months, years, and seasons.',
    summaryFr:
      'La pyramide du temps : AT pour les heures précises et moments ponctuels, ON pour les jours et dates, IN pour les mois, années et saisons.',
    summaryDari:
      'هرم زمان: at برای ساعت مشخص، on برای روزها و تاریخ‌ها، و in برای ماه‌ها، سال‌ها و فصل‌ها.',
    sources: {
      murphyUnits: [121],
      description: 'Murphy Unit 121',
    },
    chart: {
      title: 'The Time Pyramid (Murphy Unit 121)',
      titleFr: 'La Pyramide Temporelle',
      titleDari: 'هرم کاربرد حروف اضافه زمان',
      headers: ['Préposition', 'Précision Temporelle', 'Exemples'],
      rows: [
        {
          col1: 'AT (Point très précis)',
          col2: 'Heures précises, moments du jour, fêtes',
          notes: 'at 5:00, at noon, at midnight, at night, at Christmas',
          notesFr: 'at the weekend (UK) / on the weekend (US)',
        },
        {
          col1: 'ON (1 Jour / 1 Date)',
          col2: 'Jours de la semaine, dates complètes',
          notes: 'on Monday, on July 4th, on my birthday, on Friday morning',
          notesFr: 'Dès qu’il y a un jour précis, on met ON.',
        },
        {
          col1: 'IN (Période étendue)',
          col2: 'Mois, années, siècles, saisons, parties de journée',
          notes: 'in July, in 2026, in summer, in the 21st century, in the morning',
          notesFr: 'Grandes périodes englobantes.',
        },
      ],
    },
    rules: [
      {
        id: 'rpt-1',
        ruleEn: 'Do NOT use at, on, or in before words like: next, last, this, every, tomorrow, yesterday.',
        ruleFr: 'Ne mettez JAMAIS at, on, in devant : next, last, this, every, yesterday, tomorrow.',
        ruleDari: 'قبل از کلماتی مانند next، last، this و every هرگز at، on یا in نیاورید.',
        exampleEn: 'See you next Monday! (NOT: See you on next Monday) / I visited them last week.',
        exampleFr: 'À lundi prochain !',
        exampleDari: 'دوشنبه آینده می‌بینمت!',
        isAlert: true,
      },
    ],
    exercises: [
      {
        id: 'ex-32-1',
        type: 'multiple-choice',
        promptEn: 'Choose the correct time preposition:',
        promptFr: 'Choisissez la bonne préposition de temps :',
        promptDari: 'حرف اضافه زمان مناسب را انتخاب کنید:',
        sourceRef: 'Murphy Unit 121',
        sentence: 'The flight arrives in Tokyo ___ Tuesday morning ___ 6:30 AM.',
        options: ['on / at', 'in / at', 'at / on', 'on / in'],
        correctAnswer: 'on / at',
        explanationEn: 'Use "on" for a specific day part ("on Tuesday morning") and "at" for precise clock time ("at 6:30 AM").',
        explanationFr: 'On met "on" pour un jour précis (on Tuesday morning) et "at" pour une heure (at 6:30 AM).',
        explanationDari: 'برای روز از on و برای ساعت دقیق از at استفاده می‌شود.',
      },
    ],
  },

  // 33. Prepositions of Place & Movement
  {
    id: 'lesson-prepositions-place',
    moduleId: 'mod-prepositions',
    unitNumber: 33,
    level: 'A2',
    titleEn: 'Prepositions of Place: In, At, On, To, Into',
    titleFr: 'Prépositions de Lieu & Mouvement : In, At, On, To, Into',
    titleDari: 'حروف اضافه مکان و جهت: In, At, On, To, Into',
    summaryEn:
      'Understand spatial relationships: IN (inside 3D container/room/city), ON (on a 2D surface or floor), AT (at a specific address, stop, or point), and TO/INTO for movement.',
    summaryFr:
      'IN (dans un volume 3D ou une ville), ON (sur une surface ou un étage), AT (à un repère précis ou événement), TO/INTO (mouvement orienté).',
    summaryDari:
      'درک موقعیت‌های مکانی: in درون حجم، on روی سطح، at در یک نقطه یا رویداد، و to/into برای حرکت.',
    sources: {
      murphyUnits: [123, 124, 125, 126],
      description: 'Murphy Units 123–126',
    },
    rules: [
      {
        id: 'rpl-1',
        ruleEn: 'Use "at" for buildings when thinking of what takes place there (at the cinema, at university, at the station, at work).',
        ruleFr: 'Utilisez "at" pour les lieux d’activité (at the station, at work, at school, at a concert).',
        ruleDari: 'از at برای مکان‌های کاری و رویدادها استفاده کنید (at work, at school).',
        exampleEn: 'I met Sarah at the conference center yesterday.',
        exampleFr: 'J’ai rencontré Sarah au centre de conférences hier.',
        exampleDari: 'دیروز سارا را در مرکز کنفرانس دیدم.',
      },
      {
        id: 'rpl-2',
        ruleEn: 'Never use "to" before the word "home" when expressing movement.',
        ruleFr: 'Ne mettez JAMAIS "to" devant le mot "home" pour exprimer un déplacement.',
        ruleDari: 'همراه با کلمه home هنگام بیان حرکت هرگز to نیاورید.',
        exampleEn: 'I am going home now. (NOT: going to home)',
        exampleFr: 'Je rentre à la maison maintenant.',
        exampleDari: 'من الان دارم می‌روم خانه.',
        isAlert: true,
      },
    ],
    exercises: [
      {
        id: 'ex-33-1',
        type: 'multiple-choice',
        promptEn: 'Choose the correct preposition:',
        promptFr: 'Choisissez la bonne préposition :',
        promptDari: 'حرف اضافه درست را انتخاب کنید:',
        sourceRef: 'Murphy Unit 123',
        sentence: 'We arrived ___ the airport late, but the plane was still ___ the runway.',
        options: ['at / on', 'in / at', 'to / on', 'at / in'],
        correctAnswer: 'at / on',
        explanationEn: 'We arrive "at" a facility/point (the airport) and planes rest "on" a flat surface (the runway).',
        explanationFr: 'On arrive "at the airport" et les avions sont posés "on the runway".',
        explanationDari: 'برای فرودگاه از at و برای سطح باند از on استفاده می‌شود.',
      },
    ],
  },

  // 34. Phrasal Verbs Essentials
  {
    id: 'lesson-phrasal-verbs',
    moduleId: 'mod-prepositions',
    unitNumber: 34,
    level: 'B1',
    titleEn: 'Phrasal Verbs Essentials & Separability',
    titleFr: 'Les Verbes à Particule (Phrasal Verbs) & Règle du Pronom',
    titleDari: 'افعال عبارتی و قانون جداسازی با ضمایر',
    summaryEn:
      'Master the famous pronoun sandwich rule: you can say "turn off the light" or "turn the light off", but you MUST say "turn IT off" (never "turn off it"!).',
    summaryFr:
      'La règle absolue du pronom : on peut dire "turn off the radio" ou "turn the radio off", mais on DOIT dire "turn IT off" (jamais "turn off it" !).',
    summaryDari:
      'قانون مهم ضمایر: با اسم می‌توانید حرف اضافه را قبل یا بعد بیاورید، اما با ضمیر حتماً ضمیر باید وسط بیاید (turn it off).',
    sources: {
      murphyUnits: [137, 138, 139, 140],
      description: 'Murphy Units 137–140',
    },
    comparison: {
      titleEn: 'Noun object vs Pronoun object in separable phrasal verbs',
      titleFr: 'Nom vs Pronom avec les verbes séparables',
      titleDari: 'تفاوت مفعول اسمی با مفعول ضمیری',
      itemA: {
        name: 'With a Noun (Both positions allowed)',
        form: 'Verb + Particle + Noun  OR  Verb + Noun + Particle',
        conceptEn: 'You are completely free to put the noun either after the particle or in the middle.',
        conceptFr: 'Le nom peut se placer librement après la particule ou entre le verbe et la particule.',
        conceptDari: 'اسم هم می‌تواند بعد از حرف اضافه بیاید هم بین فعل و حرف اضافه.',
        exampleEn: 'She turned on the television = She turned the television on.',
        exampleFr: 'Elle a allumé la télévision (les deux sont parfaits).',
        exampleDari: 'او تلویزیون را روشن کرد.',
      },
      itemB: {
        name: 'With a Pronoun (it / them / him / her) -> MUST BE IN THE MIDDLE!',
        form: 'Verb + PRONOUN + Particle ONLY!',
        conceptEn: 'If the object is a pronoun, it MUST go between the verb and the particle. Never after!',
        conceptFr: 'Si l’objet est un pronom (it, them), il se place OBLIGATOIREMENT AU MILIEU. Jamais après !',
        conceptDari: 'اگر مفعول ضمیر باشد، حتماً باید وسط قرار بگیرد و نمی‌تواند به آخر برود.',
        exampleEn: 'She turned it on. (NEVER: She turned on it)',
        exampleFr: 'Elle l’a allumée (JAMAIS: turned on it).',
        exampleDari: 'او روشنش کرد (فقط turned it on درست است).',
      },
      keyContrastEn:
        'Pronouns (it, them) are ALWAYS in the middle of separable phrasal verbs!',
      keyContrastFr:
        'Les pronoms (it, them) se glissent TOUJOURS au milieu du verbe et de sa particule !',
      keyContrastDari:
        'ضمایر همیشه در میانه فعل عبارتی جداشدنی قرار می‌گیرند.',
    },
    rules: [
      {
        id: 'rphr-1',
        ruleEn: 'Some phrasal verbs are INSEPARABLE: look after, run into, care for. Their objects always follow the particle.',
        ruleFr: 'Certains verbes sont inséparables : look after, run into. Le complément suit toujours la particule.',
        ruleDari: 'برخی افعال عبارتی جدانشدنی هستند (مانند look after) و همیشه با هم می‌آیند.',
        exampleEn: 'Can you look after the kids? / Can you look after them? (NOT: look them after)',
        exampleFr: 'Peux-tu garder les enfants ?',
        exampleDari: 'می‌توانی از بچه‌ها مراقبت کنی؟',
        isAlert: true,
      },
    ],
    exercises: [
      {
        id: 'ex-34-1',
        type: 'multiple-choice',
        promptEn: 'Choose the correct word order with a pronoun:',
        promptFr: 'Choisissez le bon ordre des mots avec le pronom :',
        promptDari: 'ترتیب درست کلمات با ضمیر را انتخاب کنید:',
        sourceRef: 'Murphy Unit 137',
        sentence: 'It was very hot inside the room, so I took my jacket and ___.',
        options: ['took it off', 'took off it', 'take off it', 'taking off it'],
        correctAnswer: 'took it off',
        explanationEn: 'The pronoun "it" MUST go between the verb "took" and the particle "off" ("took it off").',
        explanationFr: 'Le pronom "it" doit impérativement s’intercaler entre le verbe et la particule : "took it off".',
        explanationDari: 'ضمیر it باید میان took و off قرار بگیرد.',
      },
    ],
  },
];

