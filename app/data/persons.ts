export type Person = {
  name: string
  position?: string | null
  email?: string | null
  phone?: string | null
  image?: string | null
  website?: string | null
  roles?: string[]
}

export const persons: Person[] = [
  {
    name: 'Renate Chorherr',
    position: 'Gründerin und Leiterin',
    email: 'renate.chorherr@walz.at',
    phone: null,
    image: '/images/staff/Renate_Chorherr-v3.jpg',
    roles: ['leadership', 'principal'],
  },
  {
    name: 'Agnes Chorherr',
    position: 'Organisation und Koordination',
    email: 'agnes.chorherr@walz.at',
    phone: '01/804 29 39 - DW 1012',
    image: '/images/staff/Agnes_Chorherr.jpg',
    roles: ['leadership'],
  },

  {
    name: 'Georg Smolle',
    position: 'Mentor des Jahrgangs Phi 5',
    email: 'georg.smolle@walz.at',
    phone: '01/804 29 39 - DW 1019',
    image: '/images/staff/Georg_Smolle.jpg',
    roles: ['mentor'],
  },
  {
    name: 'Michaela Pichler',
    position: 'Mentorin des Jahrgangs Theta 4',
    email: 'michaela.pichler@walz.at',
    phone: '01/804 29 39 - DW 1015',
    image: '/images/staff/Michaela_Pichler.jpg',
    roles: ['mentor'],
  },
  {
    name: 'Tamara Galhuber',
    position: 'Mentorin des Jahrgangs Psi 3',
    email: 'tamara.galhuber@walz.at',
    phone: '01/804 29 39 - DW 1020',
    image: '/images/staff/Tamara_Galhuber.jpg',
    roles: ['mentor'],
  },
  {
    name: 'Valentin Rendl',
    position: 'Mentor des Jahrgangs Alpha 2',
    email: 'valentin.rendl@walz.at',
    phone: '01/804 29 39 - DW 1018',
    image: '/images/staff/Valentin_Rendl.jpg',
    roles: ['mentor'],
  },
  {
    name: 'Max Seifert',
    position: 'Mentor des Jahrgangs Beta 1',
    email: 'max.seifert@walz.at',
    phone: '01/804 29 39 - DW 1022',
    image: '/images/staff/Max_Seifert.jpg',
    roles: ['mentor'],
  },

  {
    name: 'Brigitte Fasching',
    position: 'Leiterin der Administration',
    email: 'brigitte.fasching@walz.at',
    phone: '01/804 29 39 - DW 1014',
    image: '/images/staff/Brigitte_Fasching-v2.jpg',
    roles: ['administrator'],
  },
  {
    name: 'Frauke Rätz',
    position: 'Verwaltungsassistentin',
    email: 'frauke.raetz@walz.at',
    phone: '01/804 29 39 - DW 1013',
    image: '/images/staff/Frauke_Raetz-v2.jpg',
    roles: ['administrator'],
  },
  {
    name: 'Barbara Brunner',
    position: 'Projektorganisation',
    email: 'barbara.brunner@walz.at',
    phone: '01/804 29 39 - DW 1021',
    image: '/images/staff/Barbara_Brunner.jpg',
    roles: ['administrator'],
  },
  {
    name: 'Paul Hellmich',
    position: 'Hausarbeiter',
    image: null,
    email: null,
    phone: null,
    roles: ['administrator'],
  },
  {
    name: 'Anita Jahn',
    position: 'Köchin',
    email: null,
    phone: '01/804 29 39 - DW 1000',
    image: '/images/staff/Anita_Jahn.jpg',
    roles: ['administrator'],
  },
  {
    name: 'Valentin Schuster',
    position: 'Büro Hilfskraft',
    image: '/images/staff/Valentin_Schuster.jpg',
    email: null,
    phone: null,
    roles: ['administrator'],
  },
  {
    name: 'Ewa Szota',
    position: 'Reinigungskraft',
    email: null,
    phone: null,
    image: null,
    roles: ['administrator'],
  },
  {
    name: 'Dimitrichka Vasileva',
    position: 'Reinigungskraft',
    image: '/images/staff/Dimi_Vasileva.jpg',
    email: null,
    phone: null,
    roles: ['administrator'],
  },
  {
    name: 'Ivan Zivanovic',
    position: 'Systemadministrator',
    email: 'ivan.zivanovic@walz.at',
    phone: '01/804 29 39 - 1017',
    image: '/images/staff/Ivan_Zivanovic.jpg',
    roles: ['administrator'],
  },

  {
    name: 'Jenny Tschürtz',
    position: 'Psychotherapeutin in Ausbildung unter Supervision',
    image: '/images/staff/Jenny_Tschuertz.jpg',
    email: null,
    phone: null,
    website: null,
    roles: ['therapeut'],
  },
  {
    name: 'Stephanie Rapp',
    position: 'Psychologin',
    image: '/images/staff/Stephanie_Rapp.jpg',
    email: null,
    phone: null,
    website: null,
    roles: ['therapeut'],
  },
  {
    name: 'Sabine Kaiser',
    position: 'Bewegungspädagogin',
    email: null,
    phone: null,
    image: '/images/staff/Sabine_Kaiser.jpg',
    website: 'www.isib.org',
    roles: ['therapeut'],
  },
  {
    name: 'Gabriele Kerbler',
    position: 'Therapeutic Touch',
    image: '/images/staff/Gabriele_Kerbler.jpg',
    email: null,
    phone: null,
    website: null,
    roles: ['therapeut'],
  },

  {
    name: 'Doris Bernhuber',
    position: 'Junior-Company',
    image: '/images/staff/Doris_Bernhuber.jpg',
    email: null,
    phone: null,
    website: null,
    roles: ['project leader'],
  },
  {
    name: 'David Botros',
    position: 'Projektbegleitung, Philosophie, Psychologie',
    image: '/images/staff/David_Botros.jpg',
    email: null,
    phone: null,
    website: null,
    roles: ['project leader'],
  },
  {
    name: 'Lea Büchele',
    position: 'Outdoor',
    image: '/images/staff/Lea_Buechele.jpg',
    email: null,
    phone: null,
    website: 'http://www.leasophiebuechele.com',
    roles: ['project leader'],
  },
  {
    name: 'Cecilia Capodiferro',
    position: 'Spanisch, Projektbegleitung Mas de Noguera',
    image: '/images/staff/Cecilia_Capodiferro.jpg',
    email: null,
    phone: null,
    website: null,
    roles: ['project leader'],
  },
  {
    name: 'Simon Dietz',
    position: 'Outdoor',
    image: null,
    email: null,
    phone: null,
    website: null,
    roles: ['project leader'],
  },
  {
    name: 'Helmut Habiger',
    position: 'Design',
    image: null,
    email: null,
    phone: null,
    website: null,
    roles: ['project leader'],
  },
  {
    name: 'Caroline Hacker',
    position: 'Junior Company',
    image: null,
    email: null,
    phone: null,
    website: null,
    roles: ['project leader'],
  },
  {
    name: 'Georg Hellmich',
    position: 'Sport, Geschichte',
    image: '/images/staff/Georg_Hellmich.jpg',
    email: null,
    phone: null,
    website: null,
    roles: ['project leader'],
  },
  {
    name: 'Reka Horvath',
    position: 'Mathematik',
    image: '/images/staff/Reka_Horvath.jpg',
    email: null,
    phone: null,
    website: null,
    roles: ['project leader'],
  },
  {
    name: 'Valentin Jahn',
    position: 'Medienarbeit',
    image: null,
    email: null,
    phone: null,
    website: null,
    roles: ['project leader'],
  },
  {
    name: 'Bernadette Maria Leitner',
    position: 'Tanz und Choreographie',
    email: null,
    phone: null,
    image: null,
    website: 'https://bernadettemarialeitner.com',
    roles: ['project leader'],
  },
  {
    name: 'Juan Martinez Tomás',
    position: 'Spanisch',
    email: null,
    phone: null,
    image: '/images/staff/Juan_Martinez.jpg',
    website: null,
    roles: ['project leader'],
  },
  {
    name: 'Anna Maschik',
    position: 'Spanisch, Schreibcoaching',
    image: '/images/staff/Anna_Maschik.jpg',
    email: null,
    phone: null,
    website: null,
    roles: ['project leader'],
  },
  {
    name: 'Jürgen Matzat',
    position: 'Theater',
    email: null,
    phone: null,
    image: '/images/staff/Juergen_Matzat.jpg',
    website: 'http://www.matz-art.at',
    roles: ['project leader'],
  },
  {
    name: 'Ilona Neuffer-Hoffmann',
    position: 'Kunstgeschichte',
    email: null,
    phone: null,
    image: '/images/staff/Ilona_Neuffer.jpg',
    website: null,
    roles: ['project leader'],
  },
  {
    name: 'Maria Niel',
    position: 'Outdoor',
    image: '/images/staff/Maria_Niel.jpg',
    email: null,
    phone: null,
    website: 'http://www.marianiel.at',
    roles: ['project leader'],
  },
  {
    name: 'Petra Pfann',
    position: 'Ernährungsberatung',
    email: null,
    phone: null,
    image: null,
    website: 'http://petrapfann.at/',
    roles: ['project leader'],
  },
  {
    name: 'Cécile Prévost',
    position: 'Französisch',
    email: null,
    phone: null,
    image: '/images/staff/Cecile_Prevost.jpg',
    website: null,
    roles: ['project leader'],
  },

  {
    name: 'Doro Redelsteiner',
    position: 'Kostüm- und Bühnenausstattung',
    email: null,
    phone: null,
    image: '/images/staff/Doro_Redelsteiner.jpg',
    website: null,
    roles: ['project leader'],
  },
  {
    name: 'Anika Radl',
    position: 'Biologie',
    email: null,
    phone: null,
    image: '/images/staff/Anika_Radl.jpg',
    website: null,
    roles: ['project leader'],
  },
  {
    name: 'Marianne Ruthner-Schöftner',
    position: 'Musik',
    email: null,
    phone: null,
    image: '/images/staff/Marianne_Rutner-Schoeftner.jpg',
    website: 'https://www.marianne-schoeftner.at/',
    roles: ['project leader'],
  },
  {
    name: 'Jasna Sandic',
    position: 'Chemie',
    email: null,
    phone: null,
    image: null,
    website: null,
    roles: ['project leader'],
  },
  {
    name: 'Andrea Schuster',
    position: 'Skills & Mathematikunterstützung',
    email: null,
    phone: null,
    image: '/images/staff/Andrea_Schuster.jpg',
    website: null,
    roles: ['project leader'],
  },
  {
    name: 'Julia Silber',
    position: 'VWA, EDV',
    email: null,
    phone: null,
    image: '/images/staff/Julia_Silber.jpg',
    website: null,
    roles: ['project leader'],
  },
  {
    name: 'Lea Sumey',
    position: 'Deutsch',
    image: '/images/staff/Lea_Sumey.jpg',
    email: null,
    phone: null,
    website: null,
    roles: ['project leader'],
  },
  {
    name: 'Anja Tanner',
    position: 'Köchin',
    image: '/images/staff/Anja_Tanner.jpg',
    email: null,
    phone: null,
    website: null,
    roles: ['project leader'],
  },
  {
    name: 'Wolfram Weh',
    position: 'Kunst',
    email: null,
    phone: null,
    image: '/images/staff/Wolfram_Weh.jpg',
    website: 'http://www.wolfram-weh.at',
    roles: ['project leader'],
  },
  {
    name: 'Harald Wilfing',
    position: 'Biologie',
    email: null,
    phone: null,
    image: '/images/staff/Harald_Wilfing.jpg',
    website: null,
    roles: ['project leader'],
  },
]
