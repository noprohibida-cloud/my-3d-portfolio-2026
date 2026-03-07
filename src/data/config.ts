const config = {
  title: "HUGO TRAVER - PORTFOLIO",
  description: {
    long: "Portfolio de Hugo Traver, technical artist et designer interactif spécialisé en création numérique, art procédural, direction artistique et développement web interactif. Découvrez mes projets mêlant TouchDesigner, Blender, GSAP et technologies web.",
    short:
      "Hugo Traver — technical artist, designer interactif et développeur créatif en création numérique.",
  },
  keywords: [
    "Hugo Traver",
    "portfolio",
    "technical artist",
    "designer interactif",
    "création numérique",
    "art procédural",
    "direction artistique",
    "TouchDesigner",
    "Blender",
    "développeur créatif",
    "web interactif",
    "GSAP",
    "React",
    "Next.js",
    "Tailwind CSS",
    "TypeScript",
    "Spline",
    "Framer Motion",
    "3D",
    "motion design",
    "installations interactives",
    "generative art",
  ],
  author: "hugo traver",
  email: "hugo.trvr@gmail.com",
  site: "https://hugotraver.dev",
  githubUsername: "TON-PSEUDO-GITHUB",
  get ogImg() {
    return this.site + "/assets/seo/og-image.png";
  },
  social: {
    upwork: "",
    linkedin: "https://www.linkedin.com/in/TON-PROFIL/",
    github: "https://github.com/TON-PSEUDO/",
  },
};
export { config };