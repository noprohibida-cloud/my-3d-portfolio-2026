// ─── data/constants.ts ────────────────────────────────────────────────────────

export const EXPERIENCE = [
  {
    id: 1,
    period: "2022 — 2023",
    shortYear: "2022 — 2023",
    title: "GRAPHISTE ⋆ SCÉNOGRAPHE",
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
      { label: "RECHERCHE SCIENTIFIQUE",     category: "contexte" },
    ],
  },
  {
    id: 2,
    period: "2024 — 2025",
    shortYear: "2024 — 2025",
    title: "GRAPHISTE ⋆ MONTEUR",
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
    period: "2025",
    shortYear: "2025",
    title: "GRAPHISTE 3D ⋆ SCÉNOGRAPHE \nDESIGNER TEXTILE",
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
    period: "2017 – 2020",
    shortPeriod: "2017–2020",
    institution: "Université Paul Valéry – Montpellier 3",
    location: "Montpellier",
    degree: "LICENCE LETTRES MODERNES",
    mention: "PARCOURS MÉTIERS DE L'ÉCRIT ET DE LA CULTURE",
    description: [
      "Formation initiale en lettres modernes, à l'université publique, qui a cultivé ma sensibilité au langage, aux récits et à la narration, et aux commentaires d'œuvres d'art. \n\nUne partie de nos enseignements professionnalisants portait sur les métiers du livre et de la culture.",
      "Cette période a également été l'occasion pour moi d'acquérir une méthodologie de recherche rigoureuse, ainsi qu'un cadre analytique et épistémologique qui ne me quitte plus."
    ],
  },

  // ── 02 · Master Lettres ───────────────────────────────────────────────────
  {
    id: 2,
    index: "02",
    period: "2020 – 2022",
    shortPeriod: "2020–2022",
    institution: "Université Paul Valéry – Montpellier 3",
    location: "Montpellier",
    degree: "MASTER LETTRES",
    mention: "PARCOURS LITTÉRATURE GÉNÉRALE ET COMPARÉE",
    description: [
      "Poursuite en master de ma formation en lettres modernes, dans le cadre duquel j'ai pu approfondir les outils recueillis en licence au travers des enseignements pluraux que j'ai pu suivre. \n\nCe premier diplôme de master a été l'occasion pour moi d'établir un premier contact avec les différents agents de la recherche académique et universitaire.",
      
      "Le succès de mon mémoire de première année, sur deux auteurs décadents et mystiques de la Belle Époque, aurait dû me conduire à une carrière en recherche littéraire. \n\nJ'en ai décidé autrement.",
    ],
    publication: {
      label: "MÉMOIRE DE MASTER PUBLIÉ SUR DUMAS",
      url:   "https://dumas.ccsd.cnrs.fr/dumas-03379646",
      title: "La fabrique du corps chez Rachilde et Jean Lorrain [1884-1901]",
    },
  },

  // ── 03 · DN MADE ──────────────────────────────────────────────────────────
  {
    id: 4,
    index: "03",
    period: "2023 — 2024",
    shortPeriod: "2023—2024",
    institution: "Montpellier",
    location: "Montpellier",
    degree: "DNMADE",
    mention: "PARCOUS PARCOURS NARRATIONS, MOTION DESIGN ET DESIGN D'INTERACTION",
    description: [
      "Après une introduction pratique aux outils du design graphique et d'interaction dans la cadre de mon contrat avec l'Université de Montpellier, j'ai voulu formaliser mes compétences au moyen d'un diplôme professionnalisant. \n\nJ'ai été reçu en première année de DN MADe NUMÉRIQUE, au lycée Jean Monnet, à Montpellier.",
      "La formation étant en deçà de mes attentes, j'ai décidé de candidater au Master Création Numérique de l'Université Paul Valéry dans l'objectif de suivre des enseignements plus approfondis et techniques.",
    ],
  },

  // ── 04 · Master Création Numérique ──────────────────────────────
  {
    id: 6,
    index: "04",
    period: "2024 — 2026",
    shortPeriod: "2024—2026",
    institution: "Université Paul Valéry — Montpellier 3",
    location: "Montpellier",
    degree: "MASTER CRÉATION NUMÉRIQUE",
    mention: "IMAGES ANIMÉES & TECHNOLOGIES INTERACTIVES",
    description: [
      "Première année enrichissante de Master en création numérique qui m'a permis d'approfondir davantage mes connaissances et ma pratique des logiciels de modélisation et d'animation 3D, de rendu temps réel et de programmation. \n\nJ'ai pu développer un goût pour la co-gestion de projets et la direction artistique.",
      "Ma seconde année dans ce master a orienté ma pratique personnelle vers le design d'interaction en temps réel, le développement d'outils et d'interfaces immersives et la création d'images génératives et procédurales appliquées au live coding et au VJing.",
    ],
  },

] as const;