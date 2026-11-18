import { ProjectItem, KpiMetric, SuccessStory, BlogPost } from '../types';

export const KPI_METRICS: KpiMetric[] = [
  {
    id: 'kpi-1',
    value: '155+',
    numberValue: 155,
    suffix: '+',
    label: 'Projets Clés Livrés',
    subtext: 'Films primés, séries, documentaires & plateformes numériques',
    iconName: 'clapperboard',
    trend: '+24% cette année'
  },
  {
    id: 'kpi-2',
    value: '3.4M',
    numberValue: 3.4,
    suffix: 'M',
    label: 'Audience Atteinte',
    subtext: 'Spectateurs en salles, festivals et utilisateurs actifs de nos apps',
    iconName: 'users',
    trend: 'Afrique & Diaspora'
  },
  {
    id: 'kpi-3',
    value: '48+',
    numberValue: 48,
    suffix: '+',
    label: 'Récompenses & Prix',
    subtext: 'FESPACO, Cannes Diaspora, TechAfrique Innovation Awards',
    iconName: 'award',
    trend: 'Excellence créative'
  },
  {
    id: 'kpi-4',
    value: '14+',
    numberValue: 14,
    suffix: '+',
    label: 'Pays de Diffusion',
    subtext: 'Réseaux de cinémas, plateformes OTT et déploiements cloud',
    iconName: 'globe',
    trend: 'Sénégal & International'
  },
  {
    id: 'kpi-5',
    value: '99.9%',
    numberValue: 99.9,
    suffix: '%',
    label: 'Disponibilité Tech',
    subtext: 'Haute performance sur nos infrastructures web et applications',
    iconName: 'cpu',
    trend: 'SLA Cloud Garanti'
  },
  {
    id: 'kpi-6',
    value: '120+',
    numberValue: 120,
    suffix: '+',
    label: 'Talents Locaux Formés',
    subtext: 'Jeunes cinéastes, développeurs et designers sénégalais propulsés',
    iconName: 'sparkles',
    trend: 'Impact social & Teranga'
  }
];

export const VIGNETTE_PROJECTS: ProjectItem[] = [
  {
    id: 'p-1',
    title: 'Dakar Noir: Les Ombres du Plateau',
    category: 'cinema',
    categoryLabel: 'Cinéma & Fiction',
    badge: 'Long-métrage • 4K HDR',
    year: '2025',
    shortDesc: 'Un thriller psychologique haletant dans les artères nocturnes de la capitale sénégalaise.',
    fullDesc: 'Une immersion visuelle à couper le souffle, récompensée pour sa cinématographie nocturne et sa bande originale associant percussions traditionnelles sabar et textures synthwave.',
    client: 'TONSS Films & Coproduction Internationale',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80',
    trailerVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    rating: '9.4/10',
    duration: '112 min',
    directorOrLead: 'Mamadou Tonss Sow',
    impactMetric: '850K Spectateurs'
  },
  {
    id: 'p-2',
    title: 'SunuPass: Billeterie & Streaming Événementiel',
    category: 'mobile',
    categoryLabel: 'Solution Mobile & Cloud',
    badge: 'App Mobile iOS & Android',
    year: '2025',
    shortDesc: 'L’application de référence pour réserver vos places de concert, cinéma et festivals à Dakar.',
    fullDesc: 'Développée avec React Native, Node.js et intégration Wave & Orange Money pour une transaction ultra-rapide en moins de 3 clics avec QR codes hors-ligne.',
    client: 'Ministère de la Culture & Collectifs d’Artistes',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
    appDownloadUrl: 'https://sunupass.tonss.sn',
    appPlatform: 'iOS & Android',
    rating: '4.9 ★ (12K avis)',
    techStack: ['Flutter / React Native', 'Golang Engine', 'Orange Money & Wave API', 'PostgreSQL'],
    directorOrLead: 'Lead Tech : Aïssatou Ba',
    impactMetric: '140K+ Téléchargements'
  },
  {
    id: 'p-3',
    title: 'L’Éveil du Baobab Sacré',
    category: 'audiovisuel',
    categoryLabel: 'Documentaire Patrimoine',
    badge: 'Documentaire Immersif 4K',
    year: '2024',
    shortDesc: 'Une fresque historique explorant les traditions orales et les sanctuaires naturels du Sénégal.',
    fullDesc: 'Film documentaire tourné sur 18 mois au Sine-Saloum et en Casamance avec des caméras RED Monstro 8K et prise de son binaurale 3D.',
    client: 'UNESCO & Fondation Culture Sénégal',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
    trailerVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    rating: '9.8/10',
    duration: '78 min',
    directorOrLead: 'Fatou Kiné Diop',
    impactMetric: 'Sélection Officielle FESPACO'
  },
  {
    id: 'p-4',
    title: 'WariFlow: ERP & Trésorerie pour Médias Africains',
    category: 'tech',
    categoryLabel: 'Plateforme Web & SaaS',
    badge: 'SaaS Multi-Tenant Cloud',
    year: '2025',
    shortDesc: 'Plateforme de gestion budgétaire, de droits d’auteurs et de paie pour les équipes de production.',
    fullDesc: 'Suite logicielle web conçue sur mesure pour les réalités économiques des productions audiovisuelles en Afrique de l’Ouest avec multi-devises CFA/EUR/USD.',
    client: 'Groupes Médias & Maisons de Production UEMOA',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    appDownloadUrl: 'https://wariflow.tonss.sn',
    appPlatform: 'Web & SaaS',
    rating: '99.98% Uptime',
    techStack: ['Next.js', 'FastAPI', 'Redis', 'Docker Cloud'],
    directorOrLead: 'Architecte : Ousmane Ndiaye',
    impactMetric: '35+ Studios Équipés'
  },
  {
    id: 'p-5',
    title: 'Teranga 2088: Métropole Afrofuturiste',
    category: 'cinema',
    categoryLabel: 'Cinéma Sci-Fi',
    badge: 'Court-métrage VFX & 3D',
    year: '2025',
    shortDesc: 'Quand l’architecture néo-soudanaise rencontre l’intelligence artificielle dans un Dakar du XXIIe siècle.',
    fullDesc: 'Projet hybride alliant prises de vues réelles et décors virtuels générés en temps réel sous Unreal Engine 5.3 avec captation volumétrique.',
    client: 'Institut Français & TONSS Studios',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    trailerVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    rating: '9.6/10',
    duration: '28 min',
    directorOrLead: 'Ibrahima Diallo',
    impactMetric: 'Prix Spécial du Jury Numérique'
  },
  {
    id: 'p-6',
    title: 'Kourel VR: Immersion aux Rythmes Sabar',
    category: 'tech',
    categoryLabel: 'Expérience WebGL & VR',
    badge: 'WebXR 3D Interactif',
    year: '2025',
    shortDesc: 'Une application spatiale permettant d’apprendre et mixer en temps réel les instruments traditionnels.',
    fullDesc: 'Application WebGL 3D avec spatialisation audio WebAudio API, jouable directement dans le navigateur ou sur casque VR Oculus Quest & Apple Vision.',
    client: 'Conservatoire National de Musique de Dakar',
    image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=1200&q=80',
    appDownloadUrl: 'https://kourelvr.tonss.sn',
    appPlatform: 'VR & WebGL',
    rating: '60 FPS 4K WebXR',
    techStack: ['Three.js', 'WebAudio API', 'WebXR', 'GLSL Shaders'],
    directorOrLead: 'Creative Coder : Cheikh Fall',
    impactMetric: '45K Visiteurs Uniques'
  }
];

export const DETAILED_PROJECTS: ProjectItem[] = [
  {
    id: 'det-1',
    title: 'Dakar Horizons: La Renaissance Cinématographique & Numérique',
    category: 'cinema',
    categoryLabel: 'Production Majeure • Fiction Cinématographique',
    badge: 'Coproduction Internationale • 8K Master',
    year: '2024 - 2025',
    shortDesc: 'Une œuvre emblématique de TONSS Production mêlant narration cinématographique poignante et diffusion multi-écrans.',
    fullDesc: 'Tourné entre Saint-Louis, Dakar et les îles de la Madeleine, Dakar Horizons raconte les destins croisés de trois jeunes innovateurs sénégalais entre héritage familial maritime et révolution des télécommunications. Le projet a nécessité le développement d’un pipeline de post-production hybride sur mesure par nos ingénieurs pour synchroniser rushes 8K et effets visuels.',
    client: 'Fondation Sud Cinéma & TV5 Monde',
    image: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=1000&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1400&q=80',
    trailerVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    rating: '9.9/10 Critique',
    duration: '124 min • Sortie Salle & VOD',
    techStack: ['Caméras ARRI Alexa Mini LF', 'Mastering Dolby Atmos', 'DaVinci Resolve Studio 19', 'Pipeline Cloud TONSS-Sync'],
    directorOrLead: 'Réalisation : Mamadou Tonss Sow & Mariama Guèye',
    impactMetric: 'Diffusé dans 14 pays • 1.2M entrées & streams'
  },
  {
    id: 'det-2',
    title: 'NinkiNanka OS & Mobile: La Transmission Culturelle Digitalisée',
    category: 'mobile',
    categoryLabel: 'Tech & Application Éducative Interactive',
    badge: 'Mobile App • AR Augmenté & Audio 3D',
    year: '2025',
    shortDesc: 'Une application mobile ludo-éducative célébrant la mythologie ouest-africaine à travers la 3D et le récit interactif.',
    fullDesc: 'Conçu par l’équipe tech de TONSS Production en collaboration avec des historiens et conteurs de l’Institut Fondamental d’Afrique Noire (IFAN). L’application combine des scènes animées de qualité studio de cinéma avec un moteur de jeu temps réel optimisé pour smartphones à bande passante modérée.',
    client: 'Ministère de l’Éducation & Partenaires Internationaux',
    image: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?auto=format&fit=crop&w=1000&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1400&q=80',
    appDownloadUrl: 'https://ninkinanka.tonss.sn',
    appPlatform: 'Cross-Platform',
    rating: '4.95 ★ sur les stores',
    techStack: ['Flutter 3.22', 'Rust Core WebAssembly', 'ARCore & ARKit', 'Firebase & Node.js'],
    directorOrLead: 'Lead Dev : Oumar Sall | Direction Artistique : Seynabou Kane',
    impactMetric: '220K Utilisateurs Actifs Mensuels'
  },
  {
    id: 'det-3',
    title: 'Gorée Memory Hub: Archive Numérique & Visite Virtuelle 360°',
    category: 'tech',
    categoryLabel: 'Plateforme Web Interactive & VR',
    badge: 'Expérience Web 3D & Archive 4K',
    year: '2024',
    shortDesc: 'La première plateforme immersive haute fidélité documentant l’île de Gorée et son histoire universelle.',
    fullDesc: 'Une numérisation photogrammétrique ultra-précise de l’île de Gorée couplée à des témoignages audio restaurés par intelligence artificielle et des courts documentaires réalisés par les équipes cinématographiques de TONSS.',
    client: 'Ville de Gorée & Conseil National du Numérique',
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1000&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1400&q=80',
    appDownloadUrl: 'https://goreememory.tonss.sn',
    appPlatform: 'VR & WebGL',
    rating: 'Sélection Webby Awards 2025',
    techStack: ['WebGL / Three.js', 'LiDAR & Photogrammétrie 3D', 'Next.js 15', 'Edge CDN Dakar/Paris'],
    directorOrLead: 'Superviseur VFX : Papa Demba | Lead Web : Aminata Traoré',
    impactMetric: '650K Visites Interactives mondiales'
  },
  {
    id: 'det-4',
    title: 'AfroBeat Engine: Studio de Production Audio & Master Cloud',
    category: 'tech',
    categoryLabel: 'Logiciel Audio & Intelligence Artificielle',
    badge: 'Station Audio Numérique Web (DAW)',
    year: '2025',
    shortDesc: 'Un environnement de mixage et mastering cloud dédié aux rythmes afro-urbains (Mbalax, Afrobeat, Drill Dakar).',
    fullDesc: 'Développé pour simplifier le flux de travail des compositeurs de musiques de films et des producteurs indépendants. Il intègre une bibliothèque exclusive de percussions sénégalaises échantillonnées en 96kHz/24bit et un DSP WebAssembly haute fidélité.',
    client: 'TONSS Sound Labs & Collectif Beatmakers Sénégal',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1000&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1400&q=80',
    appDownloadUrl: 'https://afrobeatengine.tonss.sn',
    appPlatform: 'Web & SaaS',
    rating: 'Latence < 4ms dans le navigateur',
    techStack: ['Web Audio API', 'C++ / Rust Audio DSP', 'Tailwind CSS', 'WebSockets Real-time Collab'],
    directorOrLead: 'Ingénieur du Son : Cheikh Tidiane | Lead Dev : Alioune Niasse',
    impactMetric: '12 500+ Pistes Composées'
  }
];

export const SUCCESS_STORIES: SuccessStory[] = [
  {
    id: 'ss-1',
    title: 'Digitalisation Intégrale du Festival International de Cinéma',
    client: 'Dakar Film Fest 2025',
    category: 'Cinéma & Solution Mobile',
    result: '+310% de réservations en ligne & 0 temps d’attente aux guichets',
    quote: 'TONSS Production a su combiner le regard artistique cinématographique et une infrastructure technologique robuste pour transformer notre festival en succès retentissant.',
    author: 'Khady Ndiaye',
    role: 'Déléguée Générale du Festival',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'ss-2',
    title: 'Spot Publicitaire & Campagne Tech pour Grande Banque Ouest-Africaine',
    client: 'Banque Atlantique Ouest',
    category: 'Audiovisuel & Stratégie Digitale',
    result: '4.8M de vues organiques et +45 000 ouvertures de comptes',
    quote: 'La maestria visuelle de l’équipe TONSS et leur compréhension des codes numériques africains ont fait de cette campagne la plus virale de notre histoire.',
    author: 'Ibrahima Cissé',
    role: 'Directeur Marketing & Digital',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  }
];

export const STUDIO_VALUES = [
  {
    icon: 'camera',
    title: 'Récit Cinématographique Puissant',
    description: 'Une esthétique visuelle soignée et des histoires immersives qui valorisent la richesse et la fierté des cultures africaines.'
  },
  {
    icon: 'code',
    title: 'Excellence Technologique & Code Propre',
    description: 'Conception de logiciels, applications mobiles et plateformes web performantes, scalables et pensées pour le mobile-first africain.'
  },
  {
    icon: 'sparkles',
    title: 'Hybridation Créative & R&D',
    description: 'Nous brisons les frontières entre 7e art et développement informatique pour créer des expériences transmédias uniques.'
  },
  {
    icon: 'globe',
    title: 'Rayonnement Mondial depuis Dakar',
    description: 'Ancrés au Sénégal avec l’ambition d’exporter l’imaginaire et le savoir-faire technologique africain sur tous les continents.'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    title: "Les coulisses de l'étalonnage 4K : Donner vie aux teintes de Dakar sur grand écran",
    slug: 'coulisses-etalonnage-4k-dakar',
    category: 'cinema',
    categoryLabel: 'Cinéma & Tournage',
    readTime: '5 min de lecture',
    date: '24 Sept 2026',
    author: 'Papa Demba',
    authorRole: 'Chef Opérateur & Étalonneur',
    excerpt: 'Comment notre équipe capture et sublime la lumière dorée de l’Atlantique et l’effervescence des rues dakaroises lors du mastering final.',
    content: `L'étalonnage colorimétrique est souvent perçu comme la dernière étape technique d'un film, mais chez TONSS Production, c’est là que l’âme de l’histoire prend toute sa résonance visuelle.\n\n### Capturer la lumière de l'Ouest-Africain\nLa lumière à Dakar possède une signature unique : un mélange de reflets océaniques intenses, de poussières dorées portées par l'harmattan et de contrastes urbains saisissants. Lors du tournage de nos derniers longs-métrages, nos directeurs de la photographie ont utilisé des capteurs grand format couplés à des optiques anamorphiques pour préserver cette organicité.\n\n### Le Workflow en Studio\nDans notre suite de post-production aux Parcelles Assainies, chaque plan est travaillé sur des moniteurs HDR de référence étalonnés en DCI-P3. Nous évitons les looks standardisés importés d'Hollywood pour développer une palette colorimétrique sur-mesure, respectant la véracité des tons de peau et la poésie visuelle des décors sénégalais.\n\n### L'impact pour le spectateur\nSublimer les ombres et donner de la profondeur aux ciels crépusculaires permet au spectateur de s'immerger totalement dans l'atmosphère du récit. C'est cette exigence permanente qui positionne nos productions aux standards des plus grands festivals internationaux.`,
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
    featured: true
  },
  {
    id: 'blog-2',
    title: "Architecture WebAssembly & Flutter : Comment nous propulsons Waaxtu au-delà des limites",
    slug: 'architecture-webassembly-flutter-waaxtu',
    category: 'tech',
    categoryLabel: 'Innovation & Tech',
    readTime: '7 min de lecture',
    date: '18 Sept 2026',
    author: 'Oumar Sall',
    authorRole: 'Architecte Logiciel & Lead Dev',
    excerpt: 'Plongée technique dans la conception de notre plateforme de streaming multimédia ultra-rapide optimisée pour les connexions mobiles.',
    content: `Créer des plateformes numériques en Afrique nécessite de repenser totalement les paradigmes d'architecture logicielle. Avec des connexions mobiles parfois inégales et une forte proportion d'utilisateurs sur smartphones Android, chaque kilo-octet compte.\n\n### Le défi de la performance\nPour notre plateforme Waaxtu, nous avons fait le choix audacieux d'intégrer des modules compilés en WebAssembly (WASM) écrits en Rust pour le décodage vidéo et audio côté client. Cela réduit drastiquement la charge processeur et garantit une lecture fluide même sur des appareils d'entrée de gamme.\n\n### Scalabilité Cloud & Edge Computing\nNotre backend s'appuie sur une infrastructure distribuée en edge computing avec des nœuds de diffusion à Dakar et en Europe. Grâce à une synchronisation intelligente en temps réel via des protocoles légers, l'expérience utilisateur reste instantanée, qu'on soit connecté en 5G au Plateau ou en 4G dans les régions.\n\n### L'hybridation des compétences\nChez TONSS, le dialogue permanent entre les ingénieurs logiciels et les monteurs vidéo permet de concevoir des outils sur-mesure qui répondent aux vrais besoins des créateurs de contenus.`,
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    featured: true
  },
  {
    id: 'blog-3',
    title: "Sound Design & Immersion Audio 3D : Revivre l'ambiance sonore de Dakar",
    slug: 'sound-design-immersion-audio-dakar',
    category: 'sound',
    categoryLabel: 'Son & Post-Production',
    readTime: '4 min de lecture',
    date: '10 Sept 2026',
    author: 'Cheikh Tidiane',
    authorRole: 'Ingénieur du Son & Sound Designer',
    excerpt: 'Le son binaural et la captation de terrain au cœur des marchés et des plages pour une immersion totale dans nos fictions.',
    content: `Le cinéma est autant visuel qu'auditif. Dans nos studios de mixage, nous accordons une importance capitale aux paysages sonores qui racontent l'histoire en arrière-plan.\n\n### Captation in situ\nPlutôt que d'utiliser des banques de sons génériques, nos preneurs de son parcourent les rues de Dakar, les marchés animés et le littoral pour enregistrer des ambiances authentiques en multicanal.\n\n### Mixage Dolby Atmos\nLe traitement en audio spatial permet au spectateur de localiser chaque murmure, chaque note de kora ou vrombissement de moto-jakarta, renforçant l'empathie avec les personnages.`,
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
    featured: false
  },
  {
    id: 'blog-4',
    title: "Derrière la caméra : Les secrets de tournage de nos documentaires culturels",
    slug: 'derriere-camera-secrets-tournage-documentaires',
    category: 'backstage',
    categoryLabel: 'Coulisses & Culture',
    readTime: '6 min de lecture',
    date: '02 Sept 2026',
    author: 'Aminata Traoré',
    authorRole: 'Réalisatrice & Directrice de Production',
    excerpt: 'Rencontres avec les sages, respect des traditions et agilité logistique sur le terrain : le quotidien de nos équipes de tournage.',
    content: `Tourner des documentaires historiques et culturels au Sénégal exige avant tout de l'écoute et du respect.\n\n### Préparation et immersion\nAvant même de sortir les caméras, nos équipes passent des semaines en immersion auprès des communautés pour co-construire le récit sans jamais trahir la réalité historique.\n\n### Agilité et résilience technique\nTours de batteries sous 40 degrés, tempêtes de sable ou défis logistiques sur des îles isolées : l'esprit d'équipe de TONSS fait toujours la différence.`,
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80',
    featured: false
  }
];

