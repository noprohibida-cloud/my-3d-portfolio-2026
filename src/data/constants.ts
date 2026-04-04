// ─── data/constants.ts ────────────────────────────────────────────────────────
// Les types SkillCategory et SkillTag sont déclarés dans experience.tsx,
// ne pas les redéclarer ici.

export const EXPERIENCE = [
  {
    id: 1,
    period: "2022 — 2023",
    shortYear: "2022 — 2023",
    title: "GRAPHISTE ▓▓▓▓▓▓ SCÉNOGRAPHE",
    company: "Université de Montpellier — DCSPH",
    location: "Montpellier",
    image: "/assets/experience/prototypes.png",
    highlights: [
      { text: "Université de Montpellier", color: "#E7314B" },
      { text: "Direction de la Culture Scientifique et du Patrimoine Historique", color: "#B25658" },
      { text: "PATSTEC", color: "#A1313F"},
      { text: "Prototypes, de l'expérimentation à l'innovation. L'exemple occitan", color: "#5e74b5"},
      { text: "2022–2023", color: "#f3d35e"},
    ],
    description: [
      "J'ai eu la chance de collaborer pendant l'année scolaire 2022–2023 avec l'Université de Montpellier, au sein de la Direction de la Culture Scientifique et du Patrimoine Historique, dans le cadre d'un contrat de service civique et pour répondre aux missions du programme national et public PATSTEC.",
      "La fruit de cette collaboration avec l'Université de Montpellier a été, entre autres, la conception et le montage de l'exposition itinérante et publique : Prototypes, de l'expérimentation à l'innovation. L'exemple occitan.",
    ],
    skills: [
      // technique — savoir-faire directs
      { label: "SCÉNOGRAPHIE",           category: "technique" },
      { label: "GRAPHISME",              category: "technique" },
      { label: "MÉDIATION SCIENTIFIQUE", category: "technique" },
      // outil — logiciels et méthodes
      { label: "CONSERVATION DU PATRIMOINE", category: "outil" },
      { label: "PATRIMONIALISATION",         category: "outil" },
      { label: "RECHERCHE DOCUMENTAIRE",     category: "outil" },
      // contexte — cadre et environnement
      { label: "RECHERCHE SCIENTIFIQUE", category: "contexte" },
      { label: "PROGRAMME PATSTEC",      category: "contexte" },
    ],
  },
  {
    id: 2,
    period: "2024 — 2025",
    shortYear: "2024 — 2025",
    title: "GRAPHISTE ▓▓▓▓▓▓ MONTEUR",
    company: "Jamais Assez Toujours Trop",
    location: "Montpellier",
    image: "/assets/experience/jatt.jpg",
    highlights: [
      { text: "Jamais Assez Toujours Trop", color: "#7960d4" },
      { text: "JATT", color: "#7960d4" },
      { text: "PATSTEC", color: "#A1313F"},
      { text: "2024", color: "#f3d35e"},
      { text: "pôle graphisme et direction artistique", color: "#f3d35e"},
      { text: "travailler en équipe", color: "#f3d35e"},
      { text: "en autonomie", color: "#f3d35e"},
    ],
    description: [
      "J'ai rejoint le pôle graphisme et direction artistique du média web pour jeunes artistes indépendants : Jamais Assez Toujours Trop (JATT), à la fin d'année 2024.",
      "Cette expérience m'a permis de renforcer davantage ma capacité à travailler en équipe, au contact et au service d'artistes talentueux, mais aussi en autonomie et à distance physique des autres membres de l'équipe.",
    ],
    skills: [
      // technique
      { label: "DIRECTION ARTISTIQUE",  category: "technique" },
      { label: "GRAPHISME ÉDITORIAL",   category: "technique" },
      { label: "MONTAGE VIDÉO",         category: "technique" },
      { label: "MOTION DESIGN",         category: "technique" },
      // outil
      { label: "TOURNAGE ET CAPTATION", category: "outil" },
      { label: "ADOBE PREMIERE",        category: "outil" },
      { label: "AFTER EFFECTS",         category: "outil" },
      // contexte
      { label: "MÉDIA INDÉPENDANT",     category: "contexte" },
      { label: "TRAVAIL À DISTANCE",    category: "contexte" },
    ],
  },
  {
    id: 3,
    period: "Juin — Août 2025",
    shortYear: "2025",
    title: "GRAPHISTE 3D ▓▓▓▓▓▓ SCÉNOGRAPHE \n DESIGNER TEXTILE",
    company: "Orbe",
    location: "Paris",
    image: "/assets/experience/orbe.jpg",
    highlights: [
      { text: "Orbe", color: "#d70a45" },
      { text: "Perception(s)", color: "#b25658" },
      { text: "Contour Progressif", color: "#b25658" },
      { text: "2025", color: "#f3d35e" },
      { text: "environnement sensoriel et interactif itinérant", color: "#f3d35e"},
      { text: "design d'interaction", color: "#f3d35e"},
      { text: "graphiste 3D", color: "#f3d35e"},
      { text: "designer textile et d'interaction", color: "#f3d35e"},
],
    description: [
      "J'ai été contacté pendant l'été 2025 par le collectif d'artistes parisien Orbe, pour assister la conception et la mise en place de l'environnement sensoriel et interactif itinérant Perception(s), en collaboration avec la compagnie Contour Progressif — Mylène Benoit.",
      "Cette expérience m'a permis de professionnaliser et aiguiser plus encore ma pratique du design d'interaction. Mes compétences de graphiste 3D (CLO 3D / Marvelous Designer) et de designer textile et d'interaction ont elles aussi été largement mobilisées.",
    ],
    skills: [
      // technique
      { label: "SCÉNOGRAPHIE",            category: "technique" },
      { label: "DESIGN TEXTILE",          category: "technique" },
      { label: "MODÉLISATION 3D",         category: "technique" },
      { label: "DESIGN D'INTERACTION",    category: "technique" },
      // outil
      { label: "CLO 3D / MARVELOUS",      category: "outil" },
      { label: "RÉDACTION DE PROJET",     category: "outil" },
      // contexte
      { label: "ART COLLECTIF",           category: "contexte" },
      { label: "DANSE CONTEMPORAINE",     category: "contexte" },
      { label: "INSTALLATION ITINÉRANTE", category: "contexte" },
    ],
  },
];

// ─── FORMATIONS ───────────────────────────────────────────────────────────────
// Consommé par components/sections/formations.tsx
// Chronologie : Lettres Modernes → Service Civique → DN MADE → Master 1 → Master 2

export const FORMATIONS = [

  // ── 01 · Lettres Modernes (Licence) ───────────────────────────────────────
  {
    id: 1,
    index: "01",
    period: "2019 — 2022",
    shortPeriod: "2019—2022",
    status: "terminé" as const,
    institution: "Université Paul Valéry — Montpellier 3",
    location: "Montpellier",
    degree: "LICENCE LETTRES MODERNES",
    mention: "LANGUE, LITTÉRATURE & CIVILISATION",
    description: [
      "Formation en lettres modernes qui a nourri une sensibilité aux langages, à la narration et à la construction du sens — des outils qui traversent encore aujourd'hui ma pratique du design et des dispositifs interactifs.",
      "Cette période a également été l'occasion de développer une méthodologie de recherche rigoureuse, dont le mémoire de fin de licence témoigne.",
    ],
    publication: {
      label: "Mémoire de licence — DUMAS",
      url:   "https://dumas.ccsd.cnrs.fr/",  // ← remplacer par l'URL exacte
      title: "Titre du mémoire à compléter", // ← à compléter
    },
  },

  // ── Pont : Lettres → Service Civique ──────────────────────────────────────
  {
    id: 2,
    index: "——",
    period: "",
    shortPeriod: "",
    status: "pont" as const,
    institution: "",
    location: "",
    degree: "",
    annotation: "Première bifurcation — vers la médiation et la création",
  },

  // ── 02 · Service Civique ───────────────────────────────────────────────────
  {
    id: 3,
    index: "02",
    period: "2022 — 2023",
    shortPeriod: "2022—2023",
    status: "terminé" as const,
    institution: "Université de Montpellier — DCSPH",
    location: "Montpellier",
    degree: "SERVICE CIVIQUE",
    mention: "MÉDIATION SCIENTIFIQUE & PATRIMOINE",
    description: [
      "Contrat de service civique au sein de la Direction de la Culture Scientifique et du Patrimoine Historique, dans le cadre du programme national PATSTEC. Mission articulée autour de la scénographie, du graphisme et de la médiation pour le grand public.",
      "Cette expérience a été le véritable point de basculement : confronté à des enjeux concrets de conception visuelle et d'installation, j'ai confirmé une appétence que mes études de lettres avaient pressentie sans encore l'outiller.",
    ],
  },

  // ── Pont : Service Civique → DN MADE ──────────────────────────────────────
  {
    id: 4,
    index: "——",
    period: "",
    shortPeriod: "",
    status: "pont" as const,
    institution: "",
    location: "",
    degree: "",
    annotation: "Décision de bifurcation vers le design numérique",
  },

  // ── 03 · DN MADE — mise à niveau ──────────────────────────────────────────
  {
    id: 5,
    index: "03",
    period: "2023 — 2024",
    shortPeriod: "2023—2024",
    status: "terminé" as const,
    institution: "Montpellier",            // ← préciser l'établissement si tu veux
    location: "Montpellier",
    degree: "DN MADE",
    mention: "MENTION NUMÉRIQUE",
    description: [
      "Année de DN MADE suivie après le service civique pour formaliser les bases du design graphique, de la typographie et de la culture numérique. Une mise à niveau choisie, non contrainte : ayant largement atteint le niveau requis, j'ai pu candidater directement en Master Création Numérique à l'Université Paul Valéry.",
      "Ce passage a posé le socle technique qui manquait à ma formation théorique en lettres — une complémentarité que j'assume pleinement comme trajectoire singulière.",
    ],
    annotation: "MISE À NIVEAU — TREMPLIN VERS LE MASTER",
  },

  // ── Pont : DN MADE → Master ───────────────────────────────────────────────
  {
    id: 6,
    index: "——",
    period: "",
    shortPeriod: "",
    status: "pont" as const,
    institution: "",
    location: "",
    degree: "",
    annotation: "Admission directe en Master Création Numérique",
  },

  // ── 04 · Master 1 ─────────────────────────────────────────────────────────
  {
    id: 7,
    index: "04",
    period: "2024 — 2025",
    shortPeriod: "2024—2025",
    status: "terminé" as const,
    institution: "Université Paul Valéry — Montpellier 3",
    location: "Montpellier",
    degree: "MASTER 1",
    mention: "CRÉATION NUMÉRIQUE — IMAGES ANIMÉES & TECHNOLOGIES INTERACTIVES",
    description: [
      "Première année de master au sein du département Arts, Pratiques et Poétiques. Travail approfondi sur les installations interactives, la 3D temps réel et les outils de création générative — TouchDesigner, Blender, Unity, After Effects.",
    ],
  },

  // ── 05 · Master 2 — en cours ──────────────────────────────────────────────
  {
    id: 8,
    index: "05",
    period: "2025 — 2026",
    shortPeriod: "2025—2026",
    status: "en cours" as const,
    institution: "Université Paul Valéry — Montpellier 3",
    location: "Montpellier",
    degree: "MASTER 2",
    mention: "CRÉATION NUMÉRIQUE — IMAGES ANIMÉES & TECHNOLOGIES INTERACTIVES",
    description: [
      "Seconde année de master, articulée autour d'un contrat d'alternance pour l'année scolaire 2025–2026. Poursuite des recherches autour des dispositifs immersifs, de la réalité mixte et du design d'interaction.",
      "L'objectif est de professionnaliser ma pratique au contact d'un studio ou d'une structure de création numérique, tout en consolidant un corpus théorique lié aux nouveaux médias.",
    ],
  },

] as const;