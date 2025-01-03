type Link = { download: boolean; href: string; title: string }

export type SchoolEvent = {
  title: string
  startDate: string
  startTime: string | null
  endDate: string | null
  endTime: string | null
  description: string | null
  type: 'general' | 'internal'
  links: Link[]
}

export type SchoolEventParsed = {
  title: string
  startDate: Date
  startTime: string | null
  endDate: Date | null
  endTime: string | null
  description: string | null
  type: 'general' | 'internal'
  links: Link[]
}

export const events: SchoolEvent[] = [
  {
    title: 'Schulbeginn',
    startDate: '2024-09-02',
    startTime: null,
    endDate: null,
    endTime: null,
    description: null,
    type: 'general',
    links: [],
  },
  {
    title: 'Theateraufführung',
    startDate: '2024-10-04',
    startTime: '19:00',
    endDate: null,
    endTime: null,
    description:
      'Der Jahrgang Psi 4 spielt „Das Spiel ist aus“ von Jean-Paul Sartre.',
    type: 'internal',
    links: [],
  },
  {
    title: 'Tag der offenen Tür',
    startDate: '2024-10-05',
    startTime: '15:00',
    endDate: null,
    endTime: null,
    description:
      'Ein Nachmittag für interessierte Jugendliche, Eltern und Freund:innen zum Mitmachen und Miterleben.',
    type: 'internal',
    links: [],
  },
  {
    title: 'Theateraufführung: MEΔEA',
    startDate: '2024-11-14',
    startTime: '19:00',
    endDate: null,
    endTime: null,
    description:
      'Königstocher, Priesterin, Flüchtling, Mutter, Heilerin, Femme Fatale, Verlassene, Hexe, Zauberin, Kindsmörderin - der Mythos zeichnet viele unterschiedliche Bilder einer faszinierenden Frau. Wer ist Medea heute?',
    type: 'internal',
    links: [],
  },
  {
    title: 'Theateraufführung: MEΔEA',
    startDate: '2024-11-15',
    startTime: '19:00',
    endDate: null,
    endTime: null,
    description:
      'Königstocher, Priesterin, Flüchtling, Mutter, Heilerin, Femme Fatale, Verlassene, Hexe, Zauberin, Kindsmörderin - der Mythos zeichnet viele unterschiedliche Bilder einer faszinierenden Frau. Wer ist Medea heute?',
    type: 'internal',
    links: [],
  },
  {
    title: 'TikTok, Vapen, Liken & Zocken',
    startDate: '2024-11-19',
    startTime: '19:00',
    endDate: null,
    endTime: null,
    description:
      'Eine Podiumsdiskussion mit Expert:innen zu Suchtverhalten im Jugendalter.',
    type: 'internal',
    links: [],
  },
  {
    title: 'Infoabend',
    startDate: '2024-11-21',
    startTime: '19:00',
    endDate: null,
    endTime: null,
    description:
      'Interessierten Eltern stellen wir das pädagogische Konzept und das Programm der Walz vor, die Aufnahmevoraussetzungen und der Ablauf des Aufnahmetags wird erklärt und die Schulbeiträge werden erläutert. Natürlich bleibt auch Zeit für Fragen und Gespräche. Interessierte Jugendliche können selbstverständlich mitkommen.',
    type: 'internal',
    links: [],
  },
  {
    title: 'Schattentheater: Die Schneekönigin',
    startDate: '2024-12-18',
    startTime: '18:00',
    endDate: null,
    endTime: null,
    description:
      'Der Jahrgang Gamma inszeniert “Die Schneekönigin” : Wenn nach einer kalten Winternacht Eisblumen die Fenster schmücken, war die Schneekönigin unterwegs - erzählt die Großmutter Gerda und Kai. Da wissen die beiden Freunde noch nicht, dass die Schneekönigin ihr Leben schon bald verändern wird. Sie entführt Kai in ihr Schloss im hohen Norden Gerda macht sich auf den Weg ihren Freund zu retten und besteht dabei viele Abenteuer!\n\nDas Stück ist für Kinder ab 6 Jahren geeignet.\n\nAufgrund des großen Andrangs bitten wir um Anmeldung bei barbara.brunner@walz.at. Wir freuen uns auf Ihr Kommen und einen unvergesslichen Theaterabend mit Ihnen und Ihren Kindern!',
    type: 'internal',
    links: [],
  },
  {
    title: "Gestrandet - eine Eigenproduktion der Betas",
    startDate: '2025-01-29',
    startTime: '19:00',
    endDate: null,
    endTime: null,
    description: 'Infos folgen',
    type: 'internal',
    links: [],
  },
  {
    title: "Gestrandet - eine Eigenproduktion der Betas",
    startDate: '2025-01-30',
    startTime: '19:00',
    endDate: null,
    endTime: null,
    description: 'Infos folgen',
    type: 'internal',
    links: [],
  },
  {
    title: 'Infoabend',
    startDate: '2025-02-19',
    startTime: null,
    endDate: null,
    endTime: null,
    description:
      'Interessierten Eltern stellen wir das pädagogische Konzept und das Programm der Walz vor, die Aufnahmevoraussetzungen und der Ablauf des Aufnahmetags wird erklärt und die Schulbeiträge werden erläutert. Natürlich bleibt auch Zeit für Fragen und Gespräche. Interessierte Jugendliche können selbstverständlich mitkommen.',
    type: 'internal',
    links: [],
  },
  {
    title: 'Lebenswerkstatt Walz',
    startDate: '2025-05-15',
    startTime: null,
    endDate: null,
    endTime: null,
    description: 'Eine Walzkarriere in Stationen',
    type: 'internal',
    links: [],
  },
  {
    title: 'Schulende',
    startDate: '2025-06-26',
    startTime: null,
    endDate: null,
    endTime: null,
    description: null,
    type: 'general',
    links: [],
  },
]
