export interface Project {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  image: string;
  irisColor: string;
  irisColorHex: number;
  problem: string;
  process: string;
  outcome: string;
}

export const projects: Project[] = [
  {
    id: "velocity",
    slug: "velocity",
    name: "Velocity",
    tagline: "A next-gen digital experience for the Mercedes-Benz EQ lineup",
    image: "/media/project-1.png",
    irisColor: "#1a4fff",
    irisColorHex: 0x1a4fff,
    problem:
      "Mercedes-Benz needed a digital presence that matched the ambition of their EQ electric vehicle lineup — something that felt as advanced as the cars themselves.",
    process:
      "We mapped the full user journey from discovery to configuration, then built a WebGL-powered experience that lets visitors explore the EQ lineup in real-time 3D. Every interaction was choreographed to mirror the sensation of driving.",
    outcome:
      "Launched to 40+ markets simultaneously. 3.2x increase in configuration completion rate. Shortlisted for two FWA awards.",
  },
  {
    id: "drape",
    slug: "drape",
    name: "Drape",
    tagline: "A swipe-first styling app that learns your aesthetic",
    image: "/media/project-2.png",
    irisColor: "#c47a1a",
    irisColorHex: 0xc47a1a,
    problem:
      "Fashion discovery apps were either overwhelming catalogs or passive feeds. Drape needed to feel like a personal stylist — opinionated, fast, and progressively smarter.",
    process:
      "We designed a swipe-based discovery loop with a preference model that updates in real-time. The visual language prioritized the garment over the brand, using full-bleed imagery and minimal chrome.",
    outcome:
      "280k downloads in the first month. 4.8 App Store rating. Featured in Wired's Apps That Actually Get Better Over Time.",
  },
];
