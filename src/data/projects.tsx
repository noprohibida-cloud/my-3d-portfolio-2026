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
    name: "Prototypes",
    imageKey: "prototypes",
    imageSrc: "/assets/projects-screenshots/prototypes/affiche-bleue.jpg",
    description: "L'exemple occitan — Exposition 2023",
    gradient: ["#0d0e1f", "#2D3069"],
    url: "/prototypes",
    tech: [],
    internal: true,
  },
  {
    name: "BlockMed Pro",
    imageKey: "blockmedpro",
    description: "Healthcare that pays you back",
    gradient: ["#00a3ff", "#1446fe"],
    url: "https://www.blockmedpro.com/",
    tech: [],
  },
  {
    name: "MoonVault",
    imageKey: "moonvault",
    description: "Secure DeFi Staking Vault",
    gradient: ["#6142ff", "#8c3a61"],
    url: "https://moonvault-token-frontend.vercel.app/",
    tech: [],
  },
  {
    name: "Flow XO",
    imageKey: "flowxo",
    description: "Automate with AI Chatbots",
    gradient: ["#67c18e", "#02b1cb"],
    url: "https://flowxo.com/",
    tech: [],
  },
  {
    name: "Golden Years",
    imageKey: "goldenyears",
    description: "Luxury Gold-Themed NFTs",
    gradient: ["#281f0f", "#fcba00"],
    url: "https://golden-years-website.vercel.app/",
    tech: [],
  },
  {
    name: "Hope Ledger",
    imageKey: "hopeledger",
    description: "Transparent Crypto Funding",
    gradient: ["#5374bf", "#2b3ab2"],
    url: "https://hopeledger.vercel.app/",
    tech: [],
  },
];
