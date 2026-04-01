// ─── Remplacer uniquement le tableau EXPERIENCE dans data/constants.ts ────────
// Les types SkillCategory et SkillTag sont déjà présents, ne pas les redéclarer.

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
      { text: "Prototypes, de l'expérimentation à l'innovation. L'exemple occitan.", color: "#5e74b5"},
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
      { label: "RECHERCHE SCIENTIFIQUE",        category: "contexte" },
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
    highlights: [{ text: "Jamais Assez Toujours Trop", color: "#7960d4" },
      { text: "JATT", color: "#7960d4" },
      { text: "PATSTEC", color: "#A1313F"},
      { text: "Prototypes, de l'expérimentation à l'innovation. L'exemple occitan.", color: "#5e74b5"}
    ],
    description: [
      "J'ai rejoint le pôle graphisme et direction artistique du média web pour jeunes artistes indépendants : Jamais Assez Toujours Trop (JATT), à la fin d'année 2024.",
      "Cette expérience m'a permis de renforcer davantage ma capacité à travailler en équipe, au contact et au service d'artistes talentueux, mais aussi en autonomie et à distance physique des autres membres de l'équipe.",
    ],
    skills: [
      // technique
      { label: "DIRECTION ARTISTIQUE",   category: "technique" },
      { label: "GRAPHISME ÉDITORIAL",    category: "technique" },
      { label: "MONTAGE VIDÉO",          category: "technique" },
      { label: "MOTION DESIGN",          category: "technique" },
      // outil
      { label: "TOURNAGE ET CAPTATION",  category: "outil" },
      { label: "ADOBE PREMIERE",         category: "outil" },
      { label: "AFTER EFFECTS",          category: "outil" },
      // contexte
      { label: "MÉDIA INDÉPENDANT",      category: "contexte" },
      { label: "TRAVAIL À DISTANCE",     category: "contexte" },
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
    highlights: ["Orbe", "Perception(s)", "Contour Progressif", "Mylène Benoit"],
    description: [
      "J'ai été contacté pendant l'été 2025 par le collectif d'artistes parisien Orbe, pour assister la conception et la mise en place de l'environnement sensoriel et interactif itinérant Perception(s), en collaboration avec la compagnie Contour Progressif — Mylène Benoit.",
      "Cette expérience m'a permis de professionnaliser et aiguiser plus encore ma pratique du design d'interaction. Mes compétences de graphiste 3D (CLO 3D / Marvelous Designer) et de designer textile et d'interaction ont elles aussi été largement mobilisées.",
    ],
    skills: [
      // technique
      { label: "SCÉNOGRAPHIE",           category: "technique" },
      { label: "DESIGN TEXTILE",         category: "technique" },
      { label: "MODÉLISATION 3D",        category: "technique" },
      { label: "DESIGN D'INTERACTION",   category: "technique" },
      // outil
      { label: "CLO 3D / MARVELOUS",     category: "outil" },
      { label: "RÉDACTION DE PROJET",    category: "outil" },
      // contexte
      { label: "ART COLLECTIF",          category: "contexte" },
      { label: "DANSE CONTEMPORAINE",    category: "contexte" },
      { label: "INSTALLATION ITINÉRANTE",category: "contexte" },
    ],
  },
];