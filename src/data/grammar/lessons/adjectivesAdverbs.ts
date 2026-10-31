import { GrammarLesson } from '../../../types/grammar';

export const ADJECTIVES_ADVERBS_LESSONS: GrammarLesson[] = [
  // 29. Comparatives & Superlatives
  {
    id: 'lesson-comparatives-superlatives',
    moduleId: 'mod-adjectives',
    unitNumber: 29,
    level: 'A2',
    titleEn: 'Comparatives & Superlatives',
    titleFr: 'Comparatifs & Superlatifs (-er/more, -est/most, as...as)',
    titleDari: 'صفت‌های تفضیلی و عالی و ساختار as...as',
    summaryEn:
      'Learn comparative endings (-er vs more), irregulars (good/better/best, far/further), equative "as...as", and double comparatives ("the more, the better").',
    summaryFr:
      'Les terminaisons du comparatif, les irréguliers, la structure d’égalité "as...as" et les comparatifs parallèles ("the more, the better").',
    summaryDari:
      'قواعد صفت‌های مقایسه‌ای و عالی، بی‌قاعده‌ها و ساختار هرچه بیشتر... بهتر.',
    sources: {
      murphyUnits: [105, 106, 107, 108],
      azarChapters: [19],
      description: 'Murphy Units 105–108; Azar Ch 19',
    },
    rules: [
      {
        id: 'radj-1',
        ruleEn: 'One-syllable adjectives take -er / -est (fast -> faster). Adjectives of 2+ syllables take more / most (interesting -> more interesting).',
        ruleFr: 'Les adjectifs courts (1 syllabe) prennent -er/-est. Les longs (2+ syllabes) prennent more/most.',
        ruleDari: 'صفت‌های تک‌سیلابی er/est و صفت‌های چندسیلابی more/most می‌گیرند.',
        exampleEn: 'Health is more important than money.',
        exampleFr: 'La santé est plus importante que l’argent.',
        exampleDari: 'سلامتی از پول مهم‌تر است.',
      },
      {
        id: 'radj-2',
        ruleEn: 'Double comparative: "The + comparative, the + comparative" shows proportional increase.',
        ruleFr: 'Double comparatif : "The more you read, the more you learn" (Plus tu lis, plus tu apprends).',
        ruleDari: 'ساختار The + صفت تفضیلی... the + صفت تفضیلی برای بیان تناسب افزایشی.',
        exampleEn: 'The sooner we leave, the earlier we will arrive.',
        exampleFr: 'Plus tôt nous partons, plus tôt nous arriverons.',
        exampleDari: 'هرچه زودتر برویم، زودتر خواهیم رسید.',
      },
    ],
    exercises: [
      {
        id: 'ex-29-1',
        type: 'multiple-choice',
        promptEn: 'Choose the correct comparative structure:',
        promptFr: 'Choisissez la bonne structure comparative :',
        promptDari: 'ساختار مقایسه‌ای درست را انتخاب کنید:',
        sourceRef: 'Murphy Unit 106',
        sentence: 'The harder you train, ___ you become.',
        options: ['the stronger', 'the more strong', 'stronger', 'more strong'],
        correctAnswer: 'the stronger',
        explanationEn: 'Parallel double comparative: "The harder..., the stronger...".',
        explanationFr: 'Double comparatif proportionnel : "The harder..., the stronger...".',
        explanationDari: 'در این ساختار از the stronger استفاده می‌شود.',
      },
    ],
  },

  // 30. -ed vs -ing Adjectives
  {
    id: 'lesson-ed-ing-adjectives',
    moduleId: 'mod-adjectives',
    unitNumber: 30,
    level: 'B1',
    titleEn: 'Participial Adjectives: -ed vs -ing',
    titleFr: 'Adjectifs en -ed vs -ing (Bored vs Boring)',
    titleDari: 'صفت‌های فاعلی و مفعولی: تفاوت bored با boring',
    summaryEn:
      'Never confuse them again: -ed describes how a person FEELS (bored), while -ing describes the CAUSE or characteristic of the thing (boring).',
    summaryFr:
      'Ne les confondez plus : -ed décrit le sentiment ressenti par la personne (bored), tandis que -ing décrit la cause ou l’effet produit (boring).',
    summaryDari:
      'پسوند ed احساس فرد را نشان می‌دهد و ing ویژگی یا علت آن احساس را توصیف می‌کند.',
    sources: {
      murphyUnits: [98],
      azarChapters: [11],
      description: 'Murphy Unit 98; Azar Chart 11-7',
    },
    comparison: {
      titleEn: 'I am bored vs It is boring',
      titleFr: 'Je m’ennuie (-ed) vs C’est ennuyeux (-ing)',
      titleDari: 'من حوصله‌ام سر رفته در مقابل این چیز کسل‌کننده است',
      itemA: {
        name: '-ed Adjectives (The Feeling / Receiver)',
        form: 'bored, interested, fascinated, confused, terrified',
        conceptEn: 'Describes the emotion or sensation experienced by a sentient being.',
        conceptFr: 'Décrit l’émotion, la sensation ou le sentiment éprouvé par une personne.',
        conceptDari: 'بیانگر حس درونی و عاطفی که فرد تجربه می‌کند.',
        exampleEn: 'I was so bored during the lecture that I almost fell asleep.',
        exampleFr: 'Je m’ennuyais tellement pendant le cours que j’ai failli m’endormir.',
        exampleDari: 'در طول سخنرانی آن‌قدر حوصله‌ام سر رفت که نزدیک بود خوابم ببرد.',
      },
      itemB: {
        name: '-ing Adjectives (The Cause / Emitter)',
        form: 'boring, interesting, fascinating, confusing, terrifying',
        conceptEn: 'Describes the property, event, or object that CAUSES the emotion.',
        conceptFr: 'Décrit la chose, l’événement ou la personne qui PROVOQUE cette émotion.',
        conceptDari: 'توصیف ویژگی یا چیزی که باعث ایجاد آن حس در دیگران می‌شود.',
        exampleEn: 'The lecture was so boring that many students left early.',
        exampleFr: 'Le cours était tellement ennuyeux que beaucoup d’étudiants sont partis.',
        exampleDari: 'سخنرانی آن‌قدر کسل‌کننده بود که بسیاری از دانشجویان زودتر رفتند.',
      },
      keyContrastEn:
        'A person is bored because the movie is boring. If you say "I am boring", it means you are a dull, uninteresting person!',
      keyContrastFr:
        'On est bored (ennuyé) parce que le film est boring (ennuyeux). Dire "I am boring" signifie que vous êtes une personne rase-motte !',
      keyContrastDari:
        'اگر بگویید I am boring یعنی من آدم کسل‌کننده‌ای هستم؛ پس برای حس خودتان بگویید I am bored.',
    },
    rules: [
      {
        id: 'red-1',
        ruleEn: 'Be careful with "interested" and "interesting". Use interested IN something, never interested at.',
        ruleFr: 'Utilisez toujours "interested in", et distinguez "I am interested" de "This is interesting".',
        ruleDari: 'همیشه از interested in استفاده کنید و آن را با interesting اشتباه نگیرید.',
        exampleEn: 'She is very interested in modern architecture.',
        exampleFr: 'Elle s’intéresse beaucoup à l’architecture contemporaine.',
        exampleDari: 'او به معماری مدرن بسیار علاقه‌مند است.',
      },
    ],
    exercises: [
      {
        id: 'ex-30-1',
        type: 'multiple-choice',
        promptEn: 'Choose the correct adjective:',
        promptFr: 'Choisissez le bon adjectif :',
        promptDari: 'صفت مناسب را انتخاب کنید:',
        sourceRef: 'Murphy Unit 98',
        sentence: 'The documentary about climate change was deeply ___. Everyone felt motivated to act.',
        options: ['inspiring', 'inspired', 'inspiration', 'inspire'],
        correctAnswer: 'inspiring',
        explanationEn: 'The documentary is the CAUSE that generated feelings in people, so it was "inspiring" (-ing form).',
        explanationFr: 'Le documentaire est la cause inspiratrice, il était donc "inspiring".',
        explanationDari: 'مستند عامل ایجاد انگیزه بوده، پس باید از inspiring استفاده شود.',
      },
    ],
  },

  // 31. So vs Such, Too vs Enough
  {
    id: 'lesson-so-such-too-enough',
    moduleId: 'mod-adjectives',
    unitNumber: 31,
    level: 'B1',
    titleEn: 'So vs Such, Too vs Enough',
    titleFr: 'So vs Such, Too vs Enough (Intensifieurs)',
    titleDari: 'تفاوت so با such و too با enough',
    summaryEn:
      'Distinguish: "so + adjective" (so hot) vs "such + a/an + adjective + noun" (such a hot day); "too" (excessive negative) precedes the adjective, while "enough" follows it (warm enough).',
    summaryFr:
      'Distinguez : so + adjectif (so cold) vs such + a/an + nom (such a cold day) ; "too" précède l’adjectif, "enough" le suit.',
    summaryDari:
      'کاربرد so با صفت، such با اسم، قرار گرفتن too قبل از صفت و enough بعد از صفت.',
    sources: {
      murphyUnits: [102, 103],
      azarChapters: [19],
      description: 'Murphy Units 102 & 103; Azar Charts 19-2, 19-4',
    },
    comparison: {
      titleEn: 'so vs such',
      titleFr: 'So (tellement) vs Such (un tel / de tels)',
      titleDari: 'so در مقابل such',
      itemA: {
        name: 'SO (+ Adjective / Adverb)',
        form: 'so + adjective / adverb',
        conceptEn: 'Directly modifies an adjective or adverb with NO noun directly following it.',
        conceptFr: 'Modifie directement un adjectif ou adverbe SANS nom après lui.',
        conceptDari: 'مستقیماً قبل از صفت یا قید بدون آمدن اسم بعد از آن می‌آید.',
        exampleEn: 'The weather is so beautiful today!',
        exampleFr: 'Le temps est tellement beau aujourd’hui !',
        exampleDari: 'هوا امروز خیلی زیباست!',
      },
      itemB: {
        name: 'SUCH (+ [a/an] + Adjective + Noun)',
        form: 'such + (a/an) + adjective + noun',
        conceptEn: 'Modifies a whole noun phrase containing a noun.',
        conceptFr: 'Porte sur un groupe nominal complet contenant un nom.',
        conceptDari: 'قبل از یک گروه اسمی کامل حاوی اسم قرار می‌گیرد.',
        exampleEn: 'It is such a beautiful day today!',
        exampleFr: 'C’est une si belle journée aujourd’hui !',
        exampleDari: 'امروز چه روز زیبایی است!',
      },
      keyContrastEn:
        'so + adjective (so good). such + a + adjective + noun (such a good film).',
      keyContrastFr:
        'so + adjectif (so nice). such + a + adjectif + nom (such a nice person).',
      keyContrastDari:
        'با so فقط صفت می‌آید؛ با such حتماً ترکیب صفت و اسم همراه می‌شود.',
    },
    rules: [
      {
        id: 'rso-1',
        ruleEn: 'Position of "enough": Adjective + ENOUGH (warm enough), but ENOUGH + Noun (enough money).',
        ruleFr: 'Place de "enough" : Adjectif + ENOUGH (old enough), mais ENOUGH + Nom (enough time).',
        ruleDari: 'کلمه enough بعد از صفت (warm enough) اما قبل از اسم (enough time) قرار می‌گیرد.',
        exampleEn: 'He isn’t old enough to drive, and he doesn’t have enough money for a car.',
        exampleFr: 'Il n’est pas assez âgé pour conduire, et n’a pas assez d’argent.',
        exampleDari: 'او به اندازه کافی بزرگ نشده که رانندگی کند و پول کافی برای ماشین ندارد.',
        isAlert: true,
      },
    ],
    exercises: [
      {
        id: 'ex-31-1',
        type: 'multiple-choice',
        promptEn: 'Choose between so and such:',
        promptFr: 'Choisissez entre so et such :',
        promptDari: 'بین so و such گزینه درست را انتخاب کنید:',
        sourceRef: 'Murphy Unit 102',
        sentence: 'I’ve never met ___ friendly people in my entire life.',
        options: ['such', 'so', 'so much', 'such a'],
        correctAnswer: 'such',
        explanationEn: '"Friendly people" is a plural noun phrase, so "such" (without "a" for plural) is required.',
        explanationFr: '"Friendly people" est un groupe nominal pluriel, il faut "such" (sans article a).',
        explanationDari: 'چون people اسم جمع است، از such بدون a استفاده می‌شود.',
      },
    ],
  },
];

