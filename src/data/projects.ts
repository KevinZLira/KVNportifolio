export type ProjectCategory =
  | "DESIGN"
  | "VIDEO"
  | "MOTION"
  | "BRANDING"
  | "EXPERIMENTAL";

export interface Project {
  id: string; // "007"
  slug: string;
  title: string;
  subtitle: string;
  category: ProjectCategory;
  year: number;
  tools: string[];
  description: string;
  accent: string;
  images: string[];
  videos: string[];
  behanceUrl?: string;
  sections?: { slug: string; title: string; images: string[]; behanceUrl: string; tools: string[] }[];
}

// Imported from Kevin Lira’s public Behance projects. Years are publication years.
export const projects: Project[] = [
  {
    "id": "001",
    "slug": "prateleira-infinita",
    "title": "Prateleira Infinita - RD Saúde",
    "year": 2026,
    "category": "BRANDING",
    "subtitle": "Identidade visual para a Prateleira Infinita da RD Saúde",
    "tools": [
      "PHOTOSHOP",
      "ILLUSTRATOR"
    ],
    "description": "Projeto de identidade visual para a Prateleira Infinita da RD Saúde.",
    "accent": "#6dffa8",
    "images": [
      "/projects/prateleira-infinita/01.webp",
      "/projects/prateleira-infinita/02.webp",
      "/projects/prateleira-infinita/03.webp",
      "/projects/prateleira-infinita/04.webp",
      "/projects/prateleira-infinita/05.webp",
      "/projects/prateleira-infinita/06.webp",
      "/projects/prateleira-infinita/07.webp",
      "/projects/prateleira-infinita/08.webp"
    ],
    "behanceUrl": "https://www.behance.net/gallery/247317797/Prateleira-Infinita-RD-Saude",
    "videos": [
      "https://www-ccv.adobe.io/v1/player/ccv/8x8e5snz5SD/embed?api_key=behance1&bgcolor=%23191919"
    ]
  },
  {
    "id": "002",
    "slug": "pc-scifi",
    "title": "PC Scifi",
    "year": 2025,
    "category": "DESIGN",
    "subtitle": "Modelagem e renderização 3D de um computador sci-fi",
    "tools": [
      "BLENDER"
    ],
    "description": "Projeto de design de produto e modelagem 3D de um computador com estética de ficção científica.",
    "accent": "#ff2ec4",
    "images": [
      "/projects/pc-scifi/02.webp",
      "/projects/pc-scifi/03.webp",
      "/projects/pc-scifi/04.webp"
    ],
    "behanceUrl": "https://www.behance.net/gallery/231515391/PC-Scifi",
    "videos": [
      "https://www-ccv.adobe.io/v1/player/ccv/LAg5yVHDei4/embed?api_key=behance1&bgcolor=%23191919"
    ]
  },
  {
    "id": "003",
    "slug": "lunoboy",
    "title": "Lunoboy",
    "year": 2025,
    "category": "DESIGN",
    "subtitle": "Conceito de console portátil retrofuturista",
    "tools": [],
    "description": "Projeto pessoal que explora a estética retrofuturista e a experiência de uso em jogos portáteis. O LunoBoy foi desenhado do zero, combinando formas nostálgicas com detalhes de cores marcantes.",
    "accent": "#ffd23f",
    "images": [
      "/projects/lunoboy/02.webp",
      "/projects/lunoboy/03.webp"
    ],
    "behanceUrl": "https://www.behance.net/gallery/231514841/Lunoboy",
    "videos": [
      "https://www-ccv.adobe.io/v1/player/ccv/EAVUSm2-L9t/embed?api_key=behance1&bgcolor=%23191919",
      "https://www-ccv.adobe.io/v1/player/ccv/6kxczPDrHVm/embed?api_key=behance1&bgcolor=%23191919"
    ]
  },
  {
    "id": "004",
    "slug": "better-experience-for-3ds",
    "title": "Better experience for 3DS",
    "year": 2025,
    "category": "DESIGN",
    "subtitle": "Render de um Nintendo 3DS personalizado",
    "tools": [
      "BLENDER"
    ],
    "description": "Render de um 3DS personalizado, inspirado nos acessórios extras que ampliavam a experiência do Game Boy.",
    "accent": "#6dffa8",
    "images": [
      "/projects/better-experience-for-3ds/01.webp",
      "/projects/better-experience-for-3ds/02.webp",
      "/projects/better-experience-for-3ds/03.webp"
    ],
    "behanceUrl": "https://www.behance.net/gallery/231478009/Better-experience-for-3DS",
    "videos": [
      "https://www-ccv.adobe.io/v1/player/ccv/5_5cSeXXDMq/embed?api_key=behance1&bgcolor=%23191919"
    ]
  },
  {
    "id": "005",
    "slug": "design-grafico-exploracoes",
    "title": "Design gráfico — Explorações",
    "year": 2023,
    "category": "DESIGN",
    "subtitle": "CHROMA, Medusa × Perseu, Aristóteles e Affliction",
    "tools": [],
    "description": "Uma coleção de quatro explorações em design gráfico: CHROMA, Medusa × Perseu, Aristóteles e Affliction.",
    "accent": "#ff2ec4",
    "images": [
      "/projects/chroma/01.webp",
      "/projects/chroma/02.webp",
      "/projects/medusa-perseu/01.webp",
      "/projects/medusa-perseu/02.webp",
      "/projects/aristoteles/01.webp",
      "/projects/aristoteles/02.webp",
      "/projects/affliction/01.webp",
      "/projects/affliction/02.webp"
    ],
    "videos": [],
    "sections": [
      {
        "slug": "chroma",
        "title": "Design - CHROMA",
        "images": [
          "/projects/chroma/01.webp",
          "/projects/chroma/02.webp"
        ],
        "behanceUrl": "https://www.behance.net/gallery/185238925/Design-CHROMA",
        "tools": []
      },
      {
        "slug": "medusa-perseu",
        "title": "Medusa X Perseu - Design",
        "images": [
          "/projects/medusa-perseu/01.webp",
          "/projects/medusa-perseu/02.webp"
        ],
        "behanceUrl": "https://www.behance.net/gallery/185237697/Medusa-X-Perseu-Design",
        "tools": []
      },
      {
        "slug": "aristoteles",
        "title": "Aristóteles e seu pensamento empírico - Design",
        "images": [
          "/projects/aristoteles/01.webp",
          "/projects/aristoteles/02.webp"
        ],
        "behanceUrl": "https://www.behance.net/gallery/185196543/Aristoteles-e-seu-pensamento-empirico-Design",
        "tools": []
      },
      {
        "slug": "affliction",
        "title": "Affliction - Design Brutalista",
        "images": [
          "/projects/affliction/01.webp",
          "/projects/affliction/02.webp"
        ],
        "behanceUrl": "https://www.behance.net/gallery/185194855/Affliction-Design-Brutalista",
        "tools": [
          "ILLUSTRATOR"
        ]
      }
    ]
  }
];

export const categories: (ProjectCategory | "ALL")[] = ["ALL", ...new Set(projects.map((p) => p.category))];

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug || p.sections?.some((section) => section.slug === slug));
}

export function getAdjacentProjects(slug: string) {
  const project = getProjectBySlug(slug);
  const idx = projects.findIndex((p) => p === project);
  const prev = projects[(idx - 1 + projects.length) % projects.length];
  const next = projects[(idx + 1) % projects.length];
  return { prev, next };
}
