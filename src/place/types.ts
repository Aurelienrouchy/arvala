export const DJ_TAGS = [
  'dj:house',
  'dj:electro',
  'dj:hiphop',
  'dj:techno',
  'dj:disco',
  'dj:afrobeat',
  'dj:rap',
  'dj:rnb',
  'dj:trap',
  'dj:afrohouse',
  'dj:amapiano',
  'dj:electronic',
  'dj:pop',
  'dj:tech-house',
  'dj:trance',
  'dj:afropop',
  'dj:deephouse',
  'dj:progressivehouse',
  'dj:soul',
  'dj:afrobeats',
  'dj:afrotech',
  'dj:afrotronica',
  'dj:ambient',
  'dj:bass',
  'dj:dancehall',
  'dj:electrodisco',
  'dj:funk',
  'dj:jungle',
  'dj:melodictechno'
] as const

export const CONCERT_TAGS = [
  'gig:indie',
  'gig:rap',
  'gig:alternative',
  'gig:pop',
  'gig:rock',
  'gig:hiphop',
  'gig:electronic',
  'gig:electro',
  'gig:indierock',
  'gig:postpunk',
  'gig:rnb',
  'gig:indiepop',
  'gig:punk',
  'gig:soul',
  'gig:dance',
  'gig:chansonfrançaise',
  'gig:house',
  'gig:singersongwriter',
  'gig:folk',
  'gig:techno',
  'gig:french_pop',
  'gig:funk',
  'gig:jazz',
  'gig:darkwave',
  'gig:experimental',
  'gig:hyperpop',
  'gig:metal',
  'gig:neosoul',
  'gig:poprock'
] as const

const EVENT_TYPES = [
  'deep deep house',
  'deep house',
  'afro house',
  'house',
  'melodic house',
  'tech house',
  'disco house',
  'electro house',
  'funk',
  'detroit techno',
  'deep techno',
  'downtempo',
  'techno',
  'soul',
  'hip hop',
  'jazz',
  'rap',
  'trap',
  'r&b',
  'electro',
  'dark wave',
  'minimal synth',
  'metal',
  'acid techno',
  'industrial',
  'pop',
  'dance',
  'melodic house & techno',
  'reggaeton',
  'pop rock',
  'hardcore',
  'hardtek',
  'frenchcore',
  'disco',
  'micro house',
  'german techno',
  'industrial techno',
  'hard groove',
  'hard trance',
  'hard techno',
  'trance',
  'psytrance',
  'acidcore',
  'gabber',
  'minimal techno',
  'progressive psytrance',
  'progressive trance',
  'bass',
  'drum & bass',
  'dubstep',
  'electronica',
  'breakbeat',
  'ebm',
  'club',
  'ambient',
  'salsa',
  'afrobeat',
  'uk garage',
  'minimal house',
  'post-punk',
  'punk',
  'noise',
  'acid house',
  'dancehall',
  'tribal house',
  'progressive house',
  'neorave',
  'dub',
  'reggae',
  'hardstyle',
  'alternative dance',
  'world music',
  'indie rock',
  'new wave',
  'ghettotech',
  'italo disco',
  'new rave',
  'baile funk',
  'jersey club',
  'eurodance',
  'rock',
  'brazilian',
  'dark psytrance',
  'indie dance',
  'goth',
  'synthwave',
  'bass house',
  'deep tech',
  'samba',
  'axé',
  'mpb',
  'forró',
  'chicago house',
  'grime',
  'experimental',
  'dub techno',
  'drill',
  'jungle',
  'blues',
  'garage',
  'synthpop',
  'classical',
  'edm',
  'k-pop',
  'psychedelic rock',
  'ibm',
  'pagode',
  'footwork',
  'idm',
  'riddim'
]

const SHOTGUN_PLACE_TYPES = [
  'Techno',
  'Electro',
  'House',
  'LGBTQ+',
  'Solidarity',
  'Hip-Hop',
  'Rap',
  'Fantasy',
  'Inclusion',
  'Eco-Friendly',
  'Libertine',
  'Afrobeat',
  'Latin Music',
  'Rock',
  'Jazz',
  'K-Pop',
  'Funk'
]

export const BAR_TYPES = [
  {
    slug: 'bar-a-biere',
    main: 'BAR',
    sub: 'BEER_BAR'
  },
  {
    slug: 'bar-brasserie',
    main: 'BAR',
    sub: 'BRASSERIE'
  },
  {
    slug: 'bar-a-cocktail',
    main: 'BAR',
    sub: 'COCKTAIL_BAR'
  },
  {
    slug: 'bar-a-tapas',
    main: 'BAR',
    sub: 'TAPAS_BAR'
  },
  {
    slug: 'bar-asiatique',
    main: 'BAR',
    sub: 'ASIA_BAR'
  },
  {
    slug: 'bar-latino',
    main: 'BAR',
    sub: 'LATINO_BAR'
  },
  {
    slug: 'bar-dansant',
    main: 'BAR',
    sub: 'NIGHT_BAR'
  },
  {
    slug: 'club',
    main: 'NIGHT_CLUB',
    sub: ''
  },
  {
    slug: 'bar-a-spectacles',
    main: 'BAR',
    sub: 'LIVE_BAR'
  },
  {
    slug: 'pub',
    main: 'BAR',
    sub: 'PUB'
  },
  {
    slug: 'bar-sportif',
    main: 'BAR',
    sub: 'SPORTS_BAR'
  },
  {
    slug: 'cafe-concert',
    main: 'CAFE',
    sub: 'LIVE_MUSIC_CAFE'
  },
  {
    slug: 'bar-de-quartier',
    main: 'BAR',
    sub: 'NEIGHBORHOOD_BAR'
  },
  {
    slug: 'bar-etudiant',
    main: 'BAR',
    sub: 'STUDENT_BAR'
  },
  {
    slug: 'bar-italien',
    main: 'BAR',
    sub: 'ITALIAN_BAR'
  },
  {
    slug: 'cafe',
    main: 'CAFE',
    sub: ''
  },
  {
    slug: 'bar-chic',
    main: 'BAR',
    sub: 'LOUNGE'
  },
  {
    slug: 'bar-a-vin',
    main: 'BAR',
    sub: 'WINE_BAR'
  },
  {
    slug: 'bar-alternatif',
    main: 'BAR',
    sub: 'ALT_BAR'
  },
  {
    slug: 'bar-espagnol',
    main: 'BAR',
    sub: 'SPANISH_BAR'
  },
  {
    slug: 'salon-de-the',
    main: 'CAFE',
    sub: 'TEA_ROOM'
  },
  {
    slug: 'bar-a-spiritueux',
    main: 'BAR',
    sub: 'ALCOOL_BAR'
  },
  {
    slug: 'bar-dhotel',
    main: 'BAR',
    sub: 'HOTEL_BAR'
  },
  {
    slug: 'rooftop',
    main: 'BAR',
    sub: 'ROOFTOP_BAR'
  },
  {
    slug: 'sympa-pour-travailler',
    main: 'CAFE',
    sub: 'WORKING_CAFE'
  },
  {
    slug: 'bar-cache',
    main: 'BAR',
    sub: 'HIDDEN_BAR'
  },
  {
    slug: 'bar-hip-hop',
    main: 'BAR',
    sub: 'HIP_HOP_BAR'
  },
  {
    slug: 'brasserie-artisanale',
    main: 'BAR',
    sub: 'ARTISANALE_BAR'
  },
  {
    slug: 'bar-karaoke',
    main: 'BAR',
    sub: 'KARAOKE'
  },
  {
    slug: 'bar-gaming',
    main: 'BAR',
    sub: 'GAME_BAR'
  },
  {
    slug: 'bar-a-jeux',
    main: 'BAR',
    sub: 'GAME_BAR'
  },
  {
    slug: 'irish-pub',
    main: 'BAR',
    sub: 'IRISH_PUB'
  },
  {
    slug: 'bar-insolite',
    main: 'BAR',
    sub: 'INSOLITE_BAR'
  },
  {
    slug: 'guinguette',
    main: 'BAR',
    sub: 'GUINGUETTE'
  },
  {
    slug: 'speakeasy',
    main: 'BAR',
    sub: 'SPEAKEASY'
  },
  {
    slug: 'bar-a-musique',
    main: 'BAR',
    sub: 'MUSIC_BAR'
  },
  {
    slug: 'bar-ecossais',
    main: 'BAR',
    sub: 'SCOTT_BAR'
  },
  {
    slug: 'coffee-shop',
    main: 'CAFE',
    sub: 'COFFEE_SHOP'
  },
  {
    slug: 'bar-a-shooters',
    main: 'BAR',
    sub: 'SHOT_BAR'
  },
  {
    slug: 'bar-jazz',
    main: 'BAR',
    sub: 'JAZZ_CLUB'
  },
  {
    slug: 'bar-a-chicha',
    main: 'BAR',
    sub: 'HOOKAH_LOUNGE'
  },
  {
    slug: 'comedy-club',
    main: 'CULTURE',
    sub: 'COMEDY_CLUB'
  },
  {
    slug: 'bar-lgbtqi',
    main: 'BAR',
    sub: 'GAY_BAR'
  },
  {
    slug: 'peniche',
    main: 'BAR',
    sub: 'BOAT_BAR'
  },
  {
    slug: 'beer-hall',
    main: 'BAR',
    sub: 'BEER_BAR'
  },
  {
    slug: 'bar-a-billards',
    main: 'BAR',
    sub: 'POOL_BAR'
  },
  {
    slug: 'caveau',
    main: 'BAR',
    sub: 'CAVE_BAR'
  },
  {
    slug: 'bar-a-rhum',
    main: 'BAR',
    sub: 'RHUM_BAR'
  },
  {
    slug: 'bar-indie',
    main: 'BAR',
    sub: 'INDIE_BAR'
  },
  {
    slug: 'bar-a-cidre',
    main: 'BAR',
    sub: 'CIDRE_BAR'
  },
  {
    slug: 'bar-associatif',
    main: 'BAR',
    sub: 'ASSO_BAR'
  },
  {
    slug: 'bar-pmu',
    main: 'BAR',
    sub: 'PMU'
  },
  {
    slug: 'soiree-privee',
    main: 'NIGHT_CLUB',
    sub: ''
  }
]
