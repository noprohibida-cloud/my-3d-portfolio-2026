// ─── data/constants.ts ────────────────────────────────────────────────────────

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
      { text: "PATSTEC", color: "#A1313F" },
      { text: "Prototypes, de l'expérimentation à l'innovation. L'exemple occitan", color: "#5e74b5" },
      { text: "2022–2023", color: "#f3d35e" },
    ],
    description: [
      "J'ai eu la chance de collaborer pendant l'année scolaire 2022–2023 avec l'Université de Montpellier, au sein de la Direction de la Culture Scientifique et du Patrimoine Historique, dans le cadre d'un contrat de service civique et pour répondre aux missions du programme national et public PATSTEC.",
      "La fruit de cette collaboration avec l'Université de Montpellier a été, entre autres, la conception et le montage de l'exposition itinérante et publique : Prototypes, de l'expérimentation à l'innovation. L'exemple occitan.",
    ],
    skills: [
      { label: "SCÉNOGRAPHIE",               category: "technique" },
      { label: "GRAPHISME",                  category: "technique" },
      { label: "MÉDIATION SCIENTIFIQUE",     category: "technique" },
      { label: "PATRIMONIALISATION",         category: "outil" },
      { label: "RECHERCHE DOCUMENTAIRE",     category: "outil" },
      { label: "RECHERCHE SCIENTIFIQUE",     category: "contexte" },
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
      { text: "2024", color: "#f3d35e" },
      { text: "pôle graphisme et direction artistique", color: "#f3d35e" },
      { text: "travailler en équipe", color: "#f3d35e" },
      { text: "en autonomie", color: "#f3d35e" },
    ],
    description: [
      "J'ai rejoint le pôle graphisme et direction artistique du média web pour jeunes artistes indépendants : Jamais Assez Toujours Trop (JATT), à la fin d'année 2024.",
      "Cette expérience m'a permis de renforcer davantage ma capacité à travailler en équipe, au contact et au service d'artistes talentueux, mais aussi en autonomie et à distance physique des autres membres de l'équipe.",
    ],
    skills: [
      { label: "DIRECTION ARTISTIQUE",  category: "technique" },
      { label: "GRAPHISME ÉDITORIAL",   category: "technique" },
      { label: "MONTAGE VIDÉO",         category: "technique" },
      { label: "MOTION DESIGN",         category: "technique" },
      { label: "TOURNAGE ET CAPTATION", category: "outil" },
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
      { text: "environnement sensoriel et interactif itinérant", color: "#f3d35e" },
      { text: "design d'interaction", color: "#f3d35e" },
      { text: "graphiste 3D", color: "#f3d35e" },
      { text: "designer textile et d'interaction", color: "#f3d35e" },
    ],
    description: [
      "J'ai été contacté pendant l'été 2025 par le collectif d'artistes parisien Orbe, pour assister la conception et la mise en place de l'environnement sensoriel et interactif itinérant Perception(s), en collaboration avec la compagnie Contour Progressif — Mylène Benoit.",
      "Cette expérience m'a permis de professionnaliser et aiguiser plus encore ma pratique du design d'interaction. Mes compétences de graphiste 3D (CLO 3D / Marvelous Designer) et de designer textile et d'interaction ont elles aussi été largement mobilisées.",
    ],
    skills: [
      { label: "SCÉNOGRAPHIE",            category: "technique" },
      { label: "DESIGN TEXTILE",          category: "technique" },
      { label: "MODÉLISATION 3D",         category: "technique" },
      { label: "DESIGN D'INTERACTION",    category: "technique" },
      { label: "CLO 3D",      category: "outil" },
    ],
  },
];

// ─── FORMATIONS ───────────────────────────────────────────────────────────────
// Consignes appliquées :
// - Service Civique supprimé
// - Licence Lettres Modernes : parcours "Métiers du livre et de l'écrit"
// - Master Lettres ajouté avec lien DUMAS
// - Master Création Numérique : un seul bloc pour M1 + M2, "en cours" supprimé
// - Ponts conservés pour la narration de parcours
// - Status "terminé" / "en cours" : plus affichés dans le rendu (géré côté composant)

export const FORMATIONS = [

  // ── 01 · Licence Lettres Modernes ─────────────────────────────────────────
  {
    id: 1,
    index: "01",
    period: "2019 — 2022",
    shortPeriod: "2019—2022",
    status: "terminé" as const,
    institution: "Université Paul Valéry — Montpellier 3",
    location: "Montpellier",
    degree: "LICENCE LETTRES MODERNES",
    mention: "PARCOURS — MÉTIERS DU LIVRE ET DE L'ÉCRIT",
    description: [
      "Formation en lettres modernes qui a nourri une sensibilité aux langages, à la narration et à la construction du sens — des outils qui traversent encore aujourd'hui ma pratique du design et des dispositifs interactifs.",
      "Cette période a également été l'occasion de développer une méthodologie de recherche rigoureuse, dont le mémoire de fin de licence témoigne.",
    ],
    publication: {
      label: "Mémoire de licence — DUMAS",
      url:   "https://dumas.ccsd.cnrs.fr/",
      title: "Titre du mémoire à compléter",
    },
  },

  // ── 02 · Master Lettres ───────────────────────────────────────────────────
  {
    id: 2,
    index: "02",
    period: "2022 — 2023",
    shortPeriod: "2022—2023",
    status: "terminé" as const,
    institution: "Université Paul Valéry — Montpellier 3",
    location: "Montpellier",
    degree: "MASTER LETTRES",
    mention: "LANGUE, LITTÉRATURE & CIVILISATION",
    description: [
      "Poursuite en master de la formation en lettres modernes, avec un approfondissement des outils d'analyse littéraire, de théorie du texte et de recherche académique.",
      "Le mémoire de master, déposé sur DUMAS, constitue l'aboutissement de cette période de formation théorique avant la bifurcation vers le design numérique.",
    ],
    publication: {
      label: "Mémoire de master — DUMAS",
      url:   "https://dumas.ccsd.cnrs.fr/",
      title: "Titre du mémoire à compléter",
    },
  },

  // ── Pont ──────────────────────────────────────────────────────────────────
  {
    id: 3,
    index: "——",
    period: "",
    shortPeriod: "",
    status: "pont" as const,
    institution: "",
    location: "",
    degree: "",
    annotation: "Bifurcation vers le design numérique",
  },

  // ── 03 · DN MADE ──────────────────────────────────────────────────────────
  {
    id: 4,
    index: "03",
    period: "2023 — 2024",
    shortPeriod: "2023—2024",
    status: "terminé" as const,
    institution: "Montpellier",
    location: "Montpellier",
    degree: "DN MADE",
    mention: "MENTION NUMÉRIQUE",
    description: [
      "Année de DN MADE pour formaliser les bases du design graphique, de la typographie et de la culture numérique. Une mise à niveau choisie, non contrainte : ayant largement atteint le niveau requis, j'ai pu candidater directement en Master Création Numérique à l'Université Paul Valéry.",
      "Ce passage a posé le socle technique qui manquait à ma formation théorique en lettres — une complémentarité que j'assume pleinement comme trajectoire singulière.",
    ],
    annotation: "MISE À NIVEAU — TREMPLIN VERS LE MASTER",
  },

  // ── Pont ──────────────────────────────────────────────────────────────────
  {
    id: 5,
    index: "——",
    period: "",
    shortPeriod: "",
    status: "pont" as const,
    institution: "",
    location: "",
    degree: "",
    annotation: "Admission directe en Master Création Numérique",
  },

  // ── 04 · Master Création Numérique (M1 + M2) ──────────────────────────────
  {
    id: 6,
    index: "04",
    period: "2024 — 2026",
    shortPeriod: "2024—2026",
    status: "terminé" as const,   // "terminé" = pas d'affichage badge dans le composant
    institution: "Université Paul Valéry — Montpellier 3",
    location: "Montpellier",
    degree: "MASTER CRÉATION NUMÉRIQUE",
    mention: "IMAGES ANIMÉES & TECHNOLOGIES INTERACTIVES",
    description: [
      "Master au sein du département Arts, Pratiques et Poétiques. Travail approfondi sur les installations interactives, la 3D temps réel et les outils de création générative — TouchDesigner, Blender, Unity, After Effects.",
      "La seconde année est articulée autour d'un contrat d'alternance 2025–2026, avec poursuite des recherches autour des dispositifs immersifs, de la réalité mixte et du design d'interaction.",
    ],
  },

] as const;