// ─── Skills (used by animated-background keyboard — do not remove) ─────────────

export enum SkillNames {
  JS = "js", TS = "ts", HTML = "html", CSS = "css",
  REACT = "react", VUE = "vue", NEXTJS = "nextjs", TAILWIND = "tailwind",
  NODEJS = "nodejs", EXPRESS = "express", POSTGRES = "postgres", MONGODB = "mongodb",
  GIT = "git", GITHUB = "github", PRETTIER = "prettier", NPM = "npm",
  FIREBASE = "firebase", WORDPRESS = "wordpress", LINUX = "linux", DOCKER = "docker",
  NGINX = "nginx", AWS = "aws", VIM = "vim", VERCEL = "vercel",
}

export type Skill = {
  id: number;
  name: string;
  label: string;
  shortDescription: string;
  color: string;
  icon: string;
};

export const SKILLS: Record<SkillNames, Skill> = {
  [SkillNames.JS]: { id: 1, name: "js", label: "JavaScript", shortDescription: "sprinkling chaos and callbacks since '95 🌀🚀", color: "#f0db4f", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  [SkillNames.TS]: { id: 2, name: "ts", label: "TypeScript", shortDescription: "JavaScript's overachiever with a helmet on 🪖🔒", color: "#007acc", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  [SkillNames.HTML]: { id: 3, name: "html", label: "HTML", shortDescription: "the internet's grandparent still handing out tags 📜🔥", color: "#e34c26", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  [SkillNames.CSS]: { id: 4, name: "css", label: "CSS", shortDescription: "fashion week for divs, with unexpected plot twists 🧵✨", color: "#563d7c", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
  [SkillNames.REACT]: { id: 5, name: "react", label: "React", shortDescription: "hooks on hooks on hooks—state of constant suspense 🎣⚛️", color: "#61dafb", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  [SkillNames.VUE]: { id: 6, name: "vue", label: "Vue", shortDescription: "frontend zen garden with reactive bonsai vibes 🟢😌", color: "#41b883", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" },
  [SkillNames.NEXTJS]: { id: 7, name: "nextjs", label: "Next.js", shortDescription: "SSR sorcery with a sprinkle of router drama 👑🪄", color: "#fff", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
  [SkillNames.TAILWIND]: { id: 8, name: "tailwind", label: "Tailwind", shortDescription: "utility drip so strong it bends time-to-ship ⏩🌪️", color: "#38bdf8", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" },
  [SkillNames.NODEJS]: { id: 9, name: "nodejs", label: "Node.js", shortDescription: "JavaScript's backend cosplay, event loop edition 🔄🟢", color: "#6cc24a", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  [SkillNames.EXPRESS]: { id: 10, name: "express", label: "Express", shortDescription: "middlewares on a diet—minimal, spicy, fast 🛤️💨", color: "#fff", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
  [SkillNames.POSTGRES]: { id: 11, name: "postgres", label: "PostgreSQL", shortDescription: "relational powerhouse with elephant memory 🐘💾", color: "#336791", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
  [SkillNames.MONGODB]: { id: 12, name: "mongodb", label: "MongoDB", shortDescription: "document hoarder with flexible vibes 🗂️🍃", color: "#336791", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  [SkillNames.GIT]: { id: 13, name: "git", label: "Git", shortDescription: "time travel for code, with merge plot twists ⏳🌀", color: "#f1502f", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  [SkillNames.GITHUB]: { id: 14, name: "github", label: "GitHub", shortDescription: "PR central where branches learn to play nice 🐙🤝", color: "#000000", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
  [SkillNames.PRETTIER]: { id: 15, name: "prettier", label: "Prettier", shortDescription: "auto-format fairy that hushes lint fights 🧹✨", color: "#f7b93a", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prettier/prettier-original.svg" },
  [SkillNames.NPM]: { id: 16, name: "npm", label: "NPM", shortDescription: "the OG package plug—mind the dependency maze 📦🧭", color: "#fff", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg" },
  [SkillNames.FIREBASE]: { id: 17, name: "firebase", label: "Firebase", shortDescription: "rapid backend-in-a-box; watch for the vendor vines 🔥🎒", color: "#ffca28", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" },
  [SkillNames.WORDPRESS]: { id: 18, name: "wordpress", label: "WordPress", shortDescription: "CMS elder with a million plugins and opinions 🧓🔌", color: "#007acc", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg" },
  [SkillNames.LINUX]: { id: 19, name: "linux", label: "Linux", shortDescription: "kernel kingdom for terminal goblins 🧙‍♂️🐧", color: "#fff", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" },
  [SkillNames.DOCKER]: { id: 20, name: "docker", label: "Docker", shortDescription: "container Tetris that actually stacks right 🐳📦", color: "#2496ed", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
  [SkillNames.NGINX]: { id: 21, name: "nginx", label: "NginX", shortDescription: "reverse proxy sprinter with cache-for-days 🏎️🌀", color: "#008000", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg" },
  [SkillNames.AWS]: { id: 22, name: "aws", label: "AWS", shortDescription: "cloud buffet—powerful, but don't lose your plate 🌐⚡", color: "#ff9900", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/aws/aws-original.svg" },
  [SkillNames.VIM]: { id: 23, name: "vim", label: "Vim", shortDescription: "modal wizardry; escape key sold separately 🧙‍♂️🚪", color: "#e34c26", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vim/vim-original.svg" },
  [SkillNames.VERCEL]: { id: 24, name: "vercel", label: "Vercel", shortDescription: "deploy, hydrate, touch grass—the triangle's got you 🚀🌿", color: "#6cc24a", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg" },
};

// ─── Experience ────────────────────────────────────────────────────────────────

export type Experience = {
  id: number;
  period: string;
  shortYear: string;
  title: string;
  company: string;
  location: string;
  image: string;
  // Termes à mettre en valeur dans le texte (entreprises, partenaires, institutions)
  highlights: string[];
  description: string[];
  // Compétences mobilisées — affichées comme des tuiles d'opérateurs TouchDesigner
  skills: string[];
};

export const EXPERIENCE: Experience[] = [
  {
    id: 1,
    period: "2022 — 2023",
    shortYear: "2022 — 2023",
    title: "GRAPHISTE — SCÉNOGRAPHE",
    company: "Université de Montpellier — DCSPH",
    location: "Montpellier",
    image: "/assets/experience/prototypes.png",
    highlights: [
      "Université de Montpellier",
      "Direction de la Culture Scientifique et du Patrimoine Historique",
      "PATSTEC",
      "Prototypes",
    ],
    description: [
      "J'ai eu la chance de collaborer pendant l'année scolaire 2022—2023 avec l'Université de Montpellier, au sein de la Direction de la Culture Scientifique et du Patrimoine Historique, dans le cadre d'un contrat de service civique et pour répondre aux missions du programme national et public PATSTEC.",
      "Le fait notable de ce contrat avec l'Université de Montpellier a été la conception et le montage in situ de l'exposition itinérante Prototypes, de l'expérimentation à l'innovation.",
    ],
    skills: ["Signalétique", "Motion Design", "Typographie", "Print", "Installation", "Photographie", "Médiation culturelle"],
  },
  {
    id: 2,
    period: "2024 — 2025",
    shortYear: "2024 — 2025",
    title: "GRAPHISTE — MONTEUR",
    company: "Jamais Assez Toujours Trop",
    location: "Montpellier",
    image: "/assets/experience/jatt.jpg",
    highlights: [
      "Jamais Assez Toujours Trop",
      "JATT",
    ],
    description: [
      "J'ai rejoint le pôle graphisme et direction artistique du média web pour jeunes artistes indépendants Jamais Assez Toujours Trop (JATT) à la fin d'année 2024.",
      "Cette expérience m'a permis de renforcer davantage ma capacité à travailler en équipe, au contact et au service d'artistes talentueux, mais aussi en autonomie.",
    ],
    skills: ["Graphisme", "Motion Design", "Montage vidéo", "Direction artistique", "Identité visuelle", "Branding"],
  },
  {
    id: 3,
    period: "Juin — Août 2025",
    shortYear: "2025",
    title: "GRAPHISTE 3D — DESIGNER TEXTILE — SCÉNOGRAPHE",
    company: "Orbe",
    location: "Paris",
    image: "/assets/experience/orbe.jpg",
    highlights: [
      "Orbe",
      "Perception(s)",
      "Contour Progressif",
      "Mylène Benoit",
    ],
    description: [
      "J'ai été contacté pendant l'été 2025 par le collectif d'artistes parisien Orbe, pour assister la conception et la mise en place de l'environnement sensoriel et interactif itinérant Perception(s), en collaboration avec la compagnie Contour Progressif — Mylène Benoit.",
      "Conceptualisation scénographique conjuguant textile, aménagement spatial et expérience utilisateur.",
    ],
    skills: ["CLO 3D", "Scénographie", "Design textile", "Modélisation 3D", "TouchDesigner", "Installation interactive"],
  },
];

// ─── Formation ──────────────────────────────────────────────────────────────────

export const FORMATION = {
  degree: "Master Création Numérique",
  parcours: "Images Animées et Technologies Interactives",
  school: "Université Paul Valéry",
  period: "2024 — 2026",
};

// ─── Tools ─────────────────────────────────────────────────────────────────────

export const TOOLS: Record<string, string[]> = {
  "3D & Motion":  ["Blender", "Cinema 4D", "ZBrush", "CLO 3D", "After Effects", "Cavalry"],
  "Temps réel":   ["TouchDesigner", "Unity", "Unreal Engine", "Arduino"],
  "Post-prod":    ["DaVinci Resolve", "Ableton Live", "Nuke", "Photoshop"],
  "Code":         ["JavaScript", "Python", "C#"],
};

// ─── Theme disclaimers ─────────────────────────────────────────────────────────

export const themeDisclaimers = {
  light: [
    "Warning: Light mode emits a gazillion lumens of pure radiance!",
    "Caution: Light mode ahead! Please don't try this at home.",
    "Only trained professionals can handle this much brightness. Proceed with sunglasses!",
    "Brace yourself! Light mode is about to make everything shine brighter than your future.",
    "Flipping the switch to light mode... Are you sure your eyes are ready for this?",
  ],
  dark: [
    "Light mode? I thought you went insane... but welcome back to the dark side!",
    "Switching to dark mode... How was life on the bright side?",
    "Dark mode activated! Thanks you from the bottom of my heart, and my eyes too.",
    "Welcome back to the shadows. How was life out there in the light?",
    "Dark mode on! Finally, someone who understands true sophistication.",
  ],
};