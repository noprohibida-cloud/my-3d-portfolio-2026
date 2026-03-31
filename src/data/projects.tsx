export type SimpleProject = {
  name: string;
  imageKey: string;
  imageSrc?: string;
  description: string;
  gradient: [string, string];
  url: string;
  tech: string[];
  hasModal?: boolean;
  internal?: boolean;
};

export const PROJECTS: SimpleProject[] = [
  {
    name: "PROTOTYPES",
    imageKey: "prototypes",
    imageSrc: "C:/Users/hugot/Desktop/PORTFOLIO-DEV/public/assets/projects-screenshots/prototypes/header-jaune.png",
    description: "Exposition itinérante imaginée et mise en place en collaboration l'Université de Montpellier et plus d'une trentaire de laboratoires partenaires.",
    gradient: ["#0d0e1f", "#2D3069"],
    url: "/prototypes",
    tech: [],
    internal: true,
  },
  {
    name: "ALGORAVE",
    imageKey: "blockmedpro",
    description: "Performance live coding et VJing publique, spectacle musical et algorithmique porté par notre collectif étudiant, HTMEL. ",
    gradient: ["#00a3ff", "#1446fe"],
    url: "https://www.blockmedpro.com/",
    tech: [],
  },
  {
    name: "TOTL",
    imageKey: "moonvault",
    description: "Jeu immersif MR (réalité mixte) d'horreur et d'énigmes, développé sur Unity pour Meta Quest 3.",
    gradient: ["#6142ff", "#8c3a61"],
    url: "https://moonvault-token-frontend.vercel.app/",
    tech: [],
  },
  {
    name: "NOCTILUCA",
    imageKey: "flowxo",
    description: "Performance musicale immersive et interactive, programmée sur TouchDesigner et Ableton, sur le phénomène des phytoplanctons bioluminescents.",
    gradient: ["#67c18e", "#02b1cb"],
    url: "https://flowxo.com/",
    tech: [],
  },
  {
    name: "BIO—ACTVT",
    imageKey: "goldenyears",
    description: "Prévisualisation d'une performance live techno et VJing fictive mais réaliste en termes d'enjeux techniques et scénographiques, développée sur TouchDesigner et Unreal Engine.",
    gradient: ["#281f0f", "#fcba00"],
    url: "https://golden-years-website.vercel.app/",
    tech: [],
  },
  {
    name: "ASTROFISH",
    imageKey: "hopeledger",
    description: "Transparent Crypto Funding",
    gradient: ["#5374bf", "#2b3ab2"],
    url: "https://hopeledger.vercel.app/",
    tech: [],
  },
];
