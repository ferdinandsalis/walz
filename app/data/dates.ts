// location
// years?

export const dates = [
  {
    title: 'Schulbeginn 🏫',
    startDate: new Date('2023-09-04'),
    description: undefined,
  },
  {
    title: 'Theateraufführung',
    startDate: new Date('2023-10-06'),
    startTime: '19:00',
    type: 'internal',
    description: 'Der Jahrgang Theta spielt „Einer flog übers Kuckucksnest“',
  },
  {
    title: 'Tag der offenen Tür',
    startDate: new Date('2023-10-07'),
    startTime: '15:00',
    links: [
      {
        title: 'Flyer Tag der offenen Tür 2023',
        href: '/downloads/flyer-tatue-2023.pdf',
        download: true,
      },
    ],
    type: 'internal',
    description:
      'Die Walz stellt sich vor! Du kannst bei Workshops in Fremdsprachen, Projektpräsentationen und vielem mehr unseren Arbeitsalltag und die Besonderheiten der Walz kennenlernen. Gerne führt dich auch ein Walzist oder eine Walzistin durch die Gebäude und beantwortet deine Fragen. Um 18:00 findet dann eine Theateraufführung in unserem Theatersaal statt: Der Jahrgang Theta zeigt „Einer flog übers Kuckucksnest“.',
  },
  {
    title: 'Theateraufführung',
    startDate: new Date('2023-10-07'),
    startTime: '18:00',
    type: 'internal',
    description: 'Der Jahrgang Theta spielt „Einer flog übers Kuckucksnest“',
  },
  {
    title: 'Theateraufführung',
    startDate: new Date('2023-11-16'),
    startTime: '18:00 und 19:30',
    type: 'internal',
    description: `
Wir möchten Sie herzlich ins Theater einladen:
Eines Tages ist er einfach da: Lucas. Niemand weiß, wer er ist, woher er kommt.
Misstrauisch beobachten die Inselbewohner den Fremden und hängen ihm
jede Schandtat an, die auf der Insel passiert. Eine Hetzjagd beginnt.
Eine Theaterproduktion des Jahrgangs Psi 3.
`,
  },
  {
    title: 'Infoabend',
    startDate: new Date('2023-11-23'),
    startTime: '19:00',
    type: 'internal',
    links: [
      {
        title: 'Aufnahme',
        href: '/aufnahme',
      },
    ],
    description:
      'Interessierten Eltern stellen wir das pädagogische Konzept und das Programm der Walz vor, die Aufnahmevoraussetzungen und der Ablauf des Aufnahmetags wird erklärt und die Schulbeiträge werden erläutert. Natürlich bleibt auch Zeit für Fragen und Gespräche. Interessierte Jugendliche können selbstverständlich mitkommen.',
  },
  {
    title: 'Schattentheater',
    startDate: new Date('2023-12-19'),
    startTime: '18:00',
    type: 'internal',
    description: `
Wir laden herzlich zu einer Inszenierung für Kinder und Junggebliebene ein:

Menschenschattentheater vor und hinter der Leinwand, in seiner Schlichtheit magisch und zauberhaft – gleich einem riesigen, lebendig gewordenen Bilderbuch aus Scherenschnitten.

Unter der Leitung des Regisseurs und Theaterpädagogen Jürgen Matzat werden die Jugendlichen des jüngsten Walz-Jahrgangs Beta 1 diese Produktion erarbeiten.

Mit fachkundiger Begleitung werden fantasievolle Kostüme und eindrucksvolle Dia-Projektionen kreiert. Das Stück ist für Kinder ab 6 Jahren geeignet – daher beginnen wir schon um 18:00 Uhr.
`,
  },
  {
    title: 'Theateraufführung: Mord, Betrug und andere Kavaliersdelikte',
    startDate: new Date('2024-01-31'),
    startTime: '19:00',
    type: 'internal',
    description: `
Ein theaterkrimineller Abend, entstanden in der Werkstatt des Jahrgangs Alpha.
`,
  },
  {
    title: 'Theateraufführung: Mord, Betrug und andere Kavaliersdelikte',
    startDate: new Date('2024-02-01'),
    startTime: '19:00',
    type: 'internal',
    description: `
Ein theaterkrimineller Abend, entstanden in der Werkstatt des Jahrgangs Alpha.
`,
  },
  {
    title: 'Infoabend',
    startDate: new Date('2024-02-21'),
    startTime: '19:00',
    type: 'internal',
    description:
      'Interessierten Eltern stellen wir das pädagogische Konzept und das Programm der Walz vor, die Aufnahmevoraussetzungen und der Ablauf des Aufnahmetags wird erklärt und die Schulbeiträge werden erläutert. Natürlich bleibt auch Zeit für Fragen und Gespräche. Interessierte Jugendliche können selbstverständlich mitkommen.',
    links: [
      {
        title: 'Aufnahme',
        href: '/aufnahme',
      },
    ],
  },
  {
    title: 'Aufnahmetag Gamma',
    startDate: new Date('2024-03-02'),
    startTime: '10:00',
    type: 'internal',
    description: 'Der Aufnahmetag für den Jahrgang Gamma findet statt.',
  },
  {
    title: 'Lebenswerkstatt Walz. Eine Walz-Karriere in Stationen.',
    startDate: new Date('2024-04-25'),
    startTime: '18:00',
    type: 'internal',
    description: 'Kunstausstellung und Theater-Bites in kurzen Szenen.',
  },
  {
    title: 'Wanderzirkus Wunderland - Junge Straßenkünstler:innen unterwegs',
    startDate: new Date('2024-06-10'),
    endDate: new Date('2024-06-14'),
    type: 'internal',
    description:
      'Die Betas touren mit ihrer Straßentheater-Show im Waldviertel. Auftrittsorte folge.',
  },
  {
    title: 'Wanderzirkus Wunderland Abschlussshow im MQ',
    startDate: new Date('2024-06-17'),
    startTime: '15:30',
    endTime: '16:30',
    type: 'internal',
    description:
      'Die Straßentheater-Show 2024 findet wie jedes Jahr ihr großes Finale im MQ in Wien.',
  },
  {
    title: 'Abschluss 🎓',
    startDate: new Date('2024-06-27'),
    description: undefined,
  },
]

// holidays
const external = [
  {
    title: 'Weihnachtsferien (Beginn)',
    startDate: new Date('2023-12-22'),
    endDate: new Date('2024-01-07'),
    description: undefined,
  },
  {
    title: 'Semesterferien (Beginn)',
    startDate: new Date('2024-02-05'),
    endDate: new Date('2024-02-11'),
    description: undefined,
  },
  {
    title: 'Osterferien (Beginn)',
    startDate: new Date('2024-03-25'),
    endDate: new Date('2024-04-07'),
    description: undefined,
  },
  {
    title: 'Staatsfeiertag',
    startDate: new Date('2024-05-01'),
    description: undefined,
  },
  {
    title: 'Christi Himmelfahrt',
    startDate: new Date('2024-05-09'),
    description: undefined,
  },
  {
    title: 'Pfingsten (Beginn)',
    startDate: new Date('2023-05-20'),
    endDate: new Date('2023-05-21'),
    description: undefined,
  },
  {
    title: 'Fronleichnam',
    startDate: new Date('2024-05-30'),
    description: undefined,
  },
  {
    title: 'Nationalfeiertag',
    startDate: new Date('2023-10-26'),
    description: undefined,
  },
  {
    title: 'Allerheiligen (Beginn)',
    startDate: new Date('2023-11-01'),
    endDate: new Date('2023-11-02'),
    description: undefined,
  },
  {
    title: 'Maria Empfägnis',
    startDate: new Date('2023-12-08'),
    description: undefined,
  },
]
