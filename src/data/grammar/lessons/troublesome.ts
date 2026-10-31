import { GrammarLesson } from '../../../types/grammar';

export const TROUBLESOME_LESSONS: GrammarLesson[] = [
  // 35. Troublesome Verbs: Raise/Rise, Set/Sit, Lay/Lie
  {
    id: 'lesson-raise-rise-lay-lie',
    moduleId: 'mod-troublesome',
    unitNumber: 35,
    level: 'B2',
    titleEn: 'Troublesome Verbs: Raise/Rise, Set/Sit, Lay/Lie',
    titleFr: 'Verbes Pièges : Raise vs Rise, Set vs Sit, Lay vs Lie',
    titleDari: 'افعال پرچالش: raise/rise, set/sit, lay/lie',
    summaryEn:
      'Betty Azar’s classic lesson on Transitive (takes an object) vs Intransitive (no object) verb pairs that confuse even native speakers.',
    summaryFr:
      'La grande leçon de Betty Azar sur les verbes transitifs (avec objet) vs intransitifs (sans objet) qui déroutent tant d’apprenants.',
    summaryDari:
      'درس کلاسیک بتی آذر درباره افعال متعدی (نیازمند مفعول) در مقابل افعال لازم (بدون مفعول).',
    sources: {
      azarChapters: [2],
      description: 'Azar Chart 2-6 (Troublesome Verbs)',
    },
    chart: {
      title: 'Transitive vs Intransitive Verbs (Azar Chart 2-6)',
      titleFr: 'Tableau des Verbes Transitifs vs Intransitifs',
      titleDari: 'جدول مقایسه افعال متعدی و لازم پرکاربرد',
      headers: ['Transitif (Prend un COD)', 'Intransitif (Sans COD)', 'Formes au Passé'],
      rows: [
        {
          col1: 'RAISE (+ object): He raised his hand.',
          col2: 'RISE (no object): The sun rises.',
          notes: 'raise, raised, raised  VS  rise, rose, risen',
          notesFr: 'Raise nécessite un objet ; Rise monte tout seul.',
        },
        {
          col1: 'SET (+ object): She set the vase on the table.',
          col2: 'SIT (no object): He sat on the sofa.',
          notes: 'set, set, set  VS  sit, sat, sat',
          notesFr: 'Set = poser un objet ; Sit = s’asseoir.',
        },
        {
          col1: 'LAY (+ object): She laid the baby in the crib.',
          col2: 'LIE (no object): He lay on the grass yesterday.',
          notes: 'lay, laid, laid  VS  lie, lay, lain',
          notesFr: 'Lay = déposer à plat ; Lie = être allongé.',
        },
      ],
    },
    rules: [
      {
        id: 'rtb-1',
        ruleEn: 'The past of the intransitive verb "lie" (to recline) is spelled "lay"! Do not confuse it with the present tense of "lay" (to put down).',
        ruleFr: 'Le passé du verbe intransitif "lie" (s’allonger) s’écrit "lay" ! À ne pas confondre avec le présent de "lay" (poser).',
        ruleDari: 'گذشته فعل lie (دراز کشیدن) کلمه lay است و با زمان حال lay (قرار دادن) فرق دارد.',
        exampleEn: 'Yesterday, exhausted, I lay down on the sofa and slept. (Past of lie)',
        exampleFr: 'Hier, épuisé, je me suis allongé sur le canapé.',
        exampleDari: 'دیروز از خستگی روی کاناپه دراز کشیدم و خوابیدم.',
        isAlert: true,
      },
    ],
    exercises: [
      {
        id: 'ex-35-1',
        type: 'multiple-choice',
        promptEn: 'Choose the correct verb (check if there is an object!):',
        promptFr: 'Choisissez le bon verbe (vérifiez la présence d’un objet !) :',
        promptDari: 'فعل مناسب را انتخاب کنید (به وجود مفعول دقت کنید):',
        sourceRef: 'Azar Chart 2-6',
        sentence: 'When the teacher entered the auditorium, all the students ___ to welcome him.',
        options: ['rose', 'raised', 'have raised', 'were raising'],
        correctAnswer: 'rose',
        explanationEn: 'The students stood up on their own (no direct object), so the intransitive verb "rise" (past: "rose") is required.',
        explanationFr: 'Les élèves se sont levés d’eux-mêmes (pas d’objet direct), il faut le verbe intransitif "rose" (passé de rise).',
        explanationDari: 'چون عمل بدون مفعول است و خود دانش‌آموزان بلند شدند، از rose استفاده می‌شود.',
      },
      {
        id: 'ex-35-2',
        type: 'multiple-choice',
        promptEn: 'Choose the transitive verb taking the object "the flag":',
        promptFr: 'Choisissez le verbe transitif qui porte sur l’objet "the flag" :',
        promptDari: 'فعل متعدی مناسب برای مفعول the flag را برگزینید:',
        sourceRef: 'Azar Chart 2-6',
        sentence: 'Every morning at sunrise, the soldiers ___ the national flag.',
        options: ['raise', 'rise', 'arise', 'rose'],
        correctAnswer: 'raise',
        explanationEn: '"The national flag" is a direct object, so the transitive verb "raise" is required.',
        explanationFr: '"The national flag" est un COD, il faut le verbe transitif "raise".',
        explanationDari: 'پرچم مفعول است، بنابراین نیاز به فعل متعدی raise است.',
      },
    ],
  },

  // 36. During vs While, For vs During, Like vs As
  {
    id: 'lesson-during-while-for-like-as',
    moduleId: 'mod-troublesome',
    unitNumber: 36,
    level: 'B1',
    titleEn: 'During vs While, For vs During, Like vs As',
    titleFr: 'During vs While, For vs During, Like vs As',
    titleDari: 'تفاوت during با while، for با during و like با as',
    summaryEn:
      'Never mix up: During (+ noun) vs While (+ clause); For (+ number of hours/years) vs During (+ named event); Like (+ noun for appearance) vs As (+ role/capacity).',
    summaryFr:
      'Ne confondez plus : During (+ nom) vs While (+ phrase) ; For (+ durée chiffrée) vs During (+ événement nommé) ; Like (+ ressemblance) vs As (+ fonction).',
    summaryDari:
      'تفاوت During با اسم در برابر While با جمله؛ For برای عدد و طول زمان در برابر During برای نام رویداد؛ Like برای تشبیه در برابر As برای عنوان و نقش.',
    sources: {
      murphyUnits: [117, 119],
      azarChapters: [17, 19],
      description: 'Murphy Units 117 & 119; Azar Charts 17-2, 19-3',
    },
    comparison: {
      titleEn: 'during + Noun vs while + Subject + Verb',
      titleFr: 'During (Pendant + Nom) vs While (Pendant que + Sujet + Verbe)',
      titleDari: 'during با اسم در مقابل while با جمله',
      itemA: {
        name: 'During (+ Noun phrase)',
        form: 'during + the movie / the meeting / the summer',
        conceptEn: 'Tells you WHEN something happened in the course of an event or named period.',
        conceptFr: 'Indique QUAND quelque chose s’est produit au cours d’un événement ou période nommée.',
        conceptDari: 'نشان می‌دهد چه زمانی در جریان یک رویداد رخ داده است.',
        exampleEn: 'I fell asleep during the lecture.',
        exampleFr: 'Je me suis endormi pendant le cours magistral.',
        exampleDari: 'در طول سخنرانی خوابم برد.',
      },
      itemB: {
        name: 'While (+ Subject + Verb clause)',
        form: 'while + Subject + Verb',
        conceptEn: 'Introduces a full time clause with subject and verb in progress.',
        conceptFr: 'Introduit une proposition complète avec sujet et verbe conjugué.',
        conceptDari: 'یک بند کامل شامل فاعل و فعل در حال انجام را معرفی می‌کند.',
        exampleEn: 'I fell asleep while the professor was lecturing.',
        exampleFr: 'Je me suis endormi pendant que le professeur donnait son cours.',
        exampleDari: 'در حالی که استاد سخنرانی می‌کرد خوابم برد.',
      },
      keyContrastEn:
        'During is a preposition (+ noun). While is a conjunction (+ clause).',
      keyContrastFr:
        'During est une préposition (+ nom). While est une conjonction (+ phrase).',
      keyContrastDari:
        'during با اسم و while با جمله می‌آید.',
    },
    rules: [
      {
        id: 'rdw-1',
        ruleEn: 'Use "for" to tell HOW LONG (numbers, duration: for 2 hours, for 5 years). Use "during" to say WHEN an event occurred (during the night).',
        ruleFr: 'Utilisez "for" pour la DURÉE CHIFFRÉE (for three days). Utilisez "during" pour dire QUAND (during the match).',
        ruleDari: 'از for برای مدت زمان عددی (for 3 days) و از during برای زمان وقوع در رویداد (during the match) استفاده کنید.',
        exampleEn: 'We watched TV for two hours yesterday, and I fell asleep during the film.',
        exampleFr: 'Nous avons regardé la télé pendant deux heures, et je me suis endormi pendant le film.',
        exampleDari: 'دو ساعت تلویزیون تماشا کردیم و در حین فیلم خوابم برد.',
      },
      {
        id: 'rdw-2',
        ruleEn: '"Like" means similar to (appearance). "As" describes a real role, profession, or job capacity.',
        ruleFr: '"Like" exprime la ressemblance (comme). "As" indique la fonction ou le métier réel (en tant que).',
        ruleDari: 'کلمه like برای شباهت و as برای نقش، شغل و عنوان واقعی به کار می‌رود.',
        exampleEn: 'He works as a doctor. (He is really a doctor) vs He acts like a doctor.',
        exampleFr: 'Il travaille comme médecin (c’est son vrai métier).',
        exampleDari: 'او به عنوان پزشک کار می‌کند (واقعاً پزشک است).',
        isAlert: true,
      },
    ],
    exercises: [
      {
        id: 'ex-36-1',
        type: 'multiple-choice',
        promptEn: 'Choose between during, while, and for:',
        promptFr: 'Choisissez entre during, while et for :',
        promptDari: 'بین during، while و for گزینه درست را انتخاب کنید:',
        sourceRef: 'Murphy Unit 119',
        sentence: 'We waited in the cold rain ___ forty-five minutes before the bus arrived.',
        options: ['for', 'during', 'while', 'since'],
        correctAnswer: 'for',
        explanationEn: '"Forty-five minutes" is a duration of time, which requires "for", not during.',
        explanationFr: '"Forty-five minutes" est une durée chiffrée, qui prend obligatoirement "for".',
        explanationDari: 'چهل و پنج دقیقه یک طول زمان عددی است، بنابراین باید از for استفاده شود.',
      },
      {
        id: 'ex-36-2',
        type: 'multiple-choice',
        promptEn: 'Choose between like and as for profession/role:',
        promptFr: 'Choisissez entre like et as pour un métier :',
        promptDari: 'برای شغل بین like و as گزینه درست را برگزینید:',
        sourceRef: 'Murphy Unit 117',
        sentence: 'She has been working ___ a financial consultant at the bank for three years.',
        options: ['as', 'like', 'same as', 'such as'],
        correctAnswer: 'as',
        explanationEn: 'When describing someone\'s official job or profession, English uses "work as", never "work like".',
        explanationFr: 'Pour désigner la profession réelle d’une personne, on utilise "as" ("work as").',
        explanationDari: 'برای بیان عنوان شغلی رسمی از as استفاده می‌شود.',
      },
    ],
  },
];

