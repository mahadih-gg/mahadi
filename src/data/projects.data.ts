import type { Project } from "@/types/project.type";

export const projects: Project[] = [
  {
    slug: "horizon-shorts",
    title: "Horizon",
    titleLines: ["Horizon", "Shorts"],
    tags: ["Responsive Frontends", "Web Development"],
    description:
      "The most engaging shoppable video solution for websites & apps",
    color: "#1a1a2e",
    accent: "#4a6fa5",
    heroDescription:
      "Horizon Shorts is a super-engagement platform for short-form video. It lets brands and publishers manage, distribute, and measure short-form content in their websites and apps via configurable entry points, a video library, campaigns, and UGC (polls, comments, reports).",
    visitUrl: "https://horizonexp.com",
    heroImage: "/assets/images/projects/horizon/base.webp",
    showcaseImages: [
      "/assets/images/projects/horizon/s1.webp",
      "/assets/images/projects/horizon/s2.webp",
      "/assets/images/projects/horizon/s3.webp",
      "/assets/images/projects/horizon/s4.webp",
      "/assets/images/projects/horizon/s5.webp",
      "/assets/images/projects/horizon/s6.webp",
      "/assets/images/projects/horizon/s7.webp",
    ],
    sections: [
      {
        title: "Project Overview",
        paragraphs: [
          "Horizon Shorts is the admin and management frontend for the Horizon short-form video product. It provides a single dashboard for content (Library, Uploads, Channels), distribution (Entry Points), campaigns and ads, UGC (Polls, Comments, Reports), and experience customization (Theme, Shorts Player, Settings). It works with a GraphQL backend and supports multi-tenant workspaces and role-based access (System Admin, Tenant Admin, Publisher, Moderator).",
          "The platform is built for placing short-form video experiences anywhere—websites, mobile apps, and platforms like Shopify—via embeddable entry points. Publishers configure entry point type (e.g. RECTANGLE, CIRCLE, BLOCK), size (COMPACT, STANDARD, BOLD, BLOCK_OF_2/4), content and recommendation rules, then use the Launch flow to get platform-specific embed code (e.g. Web, Shopify, Mobile) for play.horizonexp.com or a custom embed URL.",
        ],
      },
      {
        title: "Design & Frontend Approach",
        paragraphs: [
          "The app is a Next.js 15 (App Router) SPA with React 19, Tailwind CSS, Radix UI primitives, and Motion for animations. It uses a structured design system (semantic colors, spacing, typography, and animation tokens) and keeps route-specific UI in each route's components/ folder while sharing layout and primitives from src/components/.",
        ],
        features: [
          {
            title: "Fully responsive UI",
            description:
              "Breakpoints from xs (475px) through 4xl (2560px), with 3xl (1600px) used for side nav and key layouts; mobile-first and fluid typography/spacing.",
          },
          {
            title: "Consistent, component-driven frontend",
            description:
              "Radix UI (dialogs, tabs, dropdowns, accordions, etc.), shared src/components/ui/ primitives, and shorts-ui feature components (e.g. VideoPreview, DesignerComponents, polls, ads) for a consistent, maintainable UI.",
          },
          {
            title: "Scalable design system",
            description:
              "Tailwind theme with primary/secondary/muted/success/warning/error palettes, custom keyframes and animations (shimmer, fade, slide, scale, bounce), focus rings, and scrollbar utilities; design tokens support theming and future white-label use.",
          },
        ],
        showcase: true,
      },
      {
        title: "Architecture-Level Description",
        paragraphs: [
          "Horizon Shorts is organized as a feature-domain Next.js App Router application where each major area—Library, Entry Points, Campaigns, UGC, and Experience—owns its route tree and co-located components. Shared shells, navigation, and UI primitives live in src/components/, while feature-specific logic stays close to the routes that use it.",
          "The frontend communicates with a GraphQL backend that powers multi-tenant workspaces, role-based access (System Admin, Tenant Admin, Publisher, Moderator), and embeddable distribution flows. Publishers configure entry points, content rules, and launch settings in the dashboard, then generate platform-specific embed code for web, Shopify, and mobile surfaces.",
          "This separation keeps the admin experience scalable: shared design tokens and Radix-based primitives ensure visual consistency, while domain modules can evolve independently as new short-form video capabilities are added.",
        ],
      },
    ],
  },
  {
    slug: "gamestories",
    title: "GameStories",
    titleLines: ["GameStories"],
    tags: ["EdTech", "AI", "Web Development"],
    description: "AI-powered interactive reading adventures for kids",
    color: "#1a1028",
    accent: "#7c3aed",
    heroDescription:
      "GameStories is an innovative educational platform that transforms reading practice into interactive storytelling adventures. Designed for students from grades 1–8, the platform allows children to create unique characters, generate AI-powered stories, and experience their adventures as playable game scenes. By blending storytelling, language practice, and gamified gameplay, GameStories encourages children to build stronger reading skills while exploring their creativity and imagination.",
    visitUrl: "https://gamestories.com",
    heroImage: "/assets/images/projects/gamestories/base.webp",
    showcaseImages: [
      "/assets/images/projects/gamestories/s1.webp",
      "/assets/images/projects/gamestories/s2.webp",
      "/assets/images/projects/gamestories/s3.webp",
    ],
    sections: [
      {
        title: "Turning Reading Into Interactive Adventures",
        paragraphs: [
          "GameStories was created to make reading practice feel as exciting as playing a video game. Instead of traditional text-based exercises, children can create their own characters, generate personalized stories, and watch those stories transform into interactive experiences. This approach encourages students to stay engaged while improving essential language skills.",
          "The platform combines storytelling, gameplay mechanics, and AI-powered content generation to create a learning environment where imagination and education work together. Each story adapts to the child's reading level, allowing students to progress at their own pace while practicing vocabulary, comprehension, spelling, and grammar.",
        ],
      },
      {
        title: "AI-Powered Storytelling and Game Experiences",
        paragraphs: [
          "Using advanced AI technology, GameStories converts written narratives into interactive gameplay moments. Children can rescue characters, solve challenges, and complete missions inside the stories they create. This unique blend of storytelling and gameplay transforms reading practice into an immersive experience that motivates kids to continue learning while having fun.",
        ],
        features: [
          {
            title: "AI-generated stories",
            description:
              "Stories that adapt to each child's reading level.",
          },
          {
            title: "Interactive game mechanics",
            description:
              "Story scenes transform into playable experiences.",
          },
          {
            title: "Creative character creation",
            description:
              "Encourages imagination and writing skills.",
          },
        ],
        showcase: true,
      },
      {
        title: "Designed for Learning, Creativity, and Safe Exploration",
        paragraphs: [
          "GameStories provides a safe and educational environment where children can develop reading skills through creative storytelling and interactive play. The platform supports multiple devices and accessibility features, allowing students to read comfortably on phones, tablets, or computers. With parental tools and standards-aligned language practice, GameStories ensures that children not only enjoy the experience but also build strong academic foundations.",
        ],
      },
    ],
  },
  {
    slug: "litzone",
    title: "LitZone",
    titleLines: ["LitZone"],
    tags: ["EdTech", "Sports", "Web Development"],
    description: "A gamified sports learning platform for kids",
    color: "#0f1a14",
    accent: "#16a34a",
    heroDescription:
      "LitZone is an innovative educational platform designed to transform children's love of sports into a powerful learning experience. Built for students aged 8–14, the platform combines sports news, real player statistics, quizzes, and gamified competitions to improve reading comprehension, math skills, and overall engagement with learning. Through an interactive fantasy-style system, students build teams, complete challenges, and earn rewards while exploring real-world sports content.",
    visitUrl: "https://litzone.com",
    heroImage: "/assets/images/projects/litzone/base.webp",
    showcaseImages: [
      "/assets/images/projects/litzone/s1.webp",
      "/assets/images/projects/litzone/s2.webp",
      "/assets/images/projects/litzone/s3.webp",
      "/assets/images/projects/litzone/s4.webp",
    ],
    sections: [
      {
        title: "The Vision Behind LitZone",
        paragraphs: [
          "LitZone was created to address a common challenge in education: keeping students engaged with reading and academic practice. Many children are naturally passionate about sports, so the platform leverages that interest to build stronger learning habits. By integrating real sports news, statistics, and player stories into reading material, LitZone makes educational content feel exciting and relevant for young learners.",
          "The platform is designed for families, teachers, and after-school programs, providing a safe and engaging environment where students can explore sports while improving their literacy and analytical thinking. With multiple reading levels and curriculum-aligned activities, LitZone ensures that students of different abilities can participate and grow at their own pace.",
        ],
      },
      {
        title: "Interactive Learning Through Sports",
        paragraphs: [
          "LitZone blends sports entertainment with academic learning through a gamified experience inspired by fantasy sports. Students can build their own teams, design jerseys and logos, follow real players, and compete with classmates or friends. Each article read and quiz completed contributes to their team's success, encouraging consistent engagement with educational content.",
        ],
        features: [
          {
            title: "Multi-level sports news articles",
            description:
              "Designed to match different reading abilities.",
          },
          {
            title: "Interactive math and statistics challenges",
            description:
              "Based on real player performance.",
          },
          {
            title: "Gamified learning system",
            description:
              "Students build teams, earn rewards, and compete with friends.",
          },
        ],
        showcase: true,
      },
      {
        title: "Safe, Engaging, and Designed for Young Learners",
        paragraphs: [
          "LitZone prioritizes safety, accessibility, and meaningful engagement for children. The platform follows strict privacy and security standards such as COPPA and FERPA compliance, ensuring a secure environment for students. With no inappropriate ads, no chat systems, and carefully curated content, LitZone provides a trusted learning platform for parents and educators. The combination of sports excitement, educational content, and gamification makes learning both fun and impactful.",
        ],
      },
    ],
  },
  {
    slug: "beauty-care-bd",
    title: "Beauty Care",
    titleLines: ["Beauty", "Care BD"],
    tags: ["E-commerce", "Responsive Frontends", "Web Development"],
    description:
      "Bangladesh's trusted online beauty shop for original skincare, haircare, makeup, and body care",
    color: "#0a1628",
    accent: "#0d9488",
    heroDescription:
      "Beauty Care BD is a production-ready single-vendor e-commerce storefront for beauty.com.bd. It delivers a full shopping experience—product discovery, campaigns and flash sales, cart and checkout, bKash and cash-on-delivery payments, customer accounts, order tracking, and SEO/analytics—powered by a headless REST API and CMS-driven site settings.",
    visitUrl: "https://beauty.com.bd",
    heroImage: "/assets/images/projects/beauty-care-bd/base.webp",
    showcaseImages: [
      "/assets/images/projects/beauty-care-bd/s1.webp",
      "/assets/images/projects/beauty-care-bd/s2.webp",
      "/assets/images/projects/beauty-care-bd/s3.webp",
      "/assets/images/projects/beauty-care-bd/s4.webp",
      "/assets/images/projects/beauty-care-bd/s5.webp",
      "/assets/images/projects/beauty-care-bd/s6.webp",
    ],
    sections: [
      {
        title: "Project Overview",
        paragraphs: [
          "Beauty Care BD is the customer-facing storefront for a single-vendor beauty retailer in Bangladesh. The site covers the full commerce journey: homepage merchandising (hero sliders, campaigns, brand carousels, new arrivals, popular, discounted, and flash-sale sections), nested category and brand browsing, product detail pages with variations and reviews, search, blogs, and CMS policy pages (terms, privacy, refund).",
          "Checkout is built around a slide-out cart with address selection, coupon application, delivery options, and payment via Cash on Delivery or bKash (with redirect flow and success/fail result pages). Customer accounts support OTP phone login, guest checkout, Google/Facebook social sign-in (NextAuth bridged to the backend), profile management, wishlist, saved addresses, order history, and shipment tracking. Site branding, metadata, and legal content are driven by backend settings and CMS pages.",
        ],
      },
      {
        title: "Design & Frontend Approach",
        paragraphs: [
          "The app is a Next.js 16 App Router storefront with React 19, Tailwind CSS v4, shadcn/ui (New York style) on Radix UI primitives, Motion and Swiper for motion/carousels, and Lottie for payment feedback. A semantic design system uses teal primary (#0d9488), success/warning/danger palettes, custom radius tokens, and dark-mode-ready CSS variables in globals.css. Layout combines a sticky navbar with category bar, mobile bottom navigation, account sheet, and dynamically loaded cart/auth modals for a fast, app-like mobile experience.",
        ],
        features: [
          {
            title: "Mobile-first commerce UI",
            description:
              "Responsive breakpoints including xs (390px), fluid product grids and carousels, sticky product bar on scroll, mobile bottom nav, and account/cart sheets optimized for one-handed shopping.",
          },
          {
            title: "Component-driven storefront",
            description:
              "Shared src/components/ui/ primitives (dialogs, sheets, tabs, forms), feature components for products, cart, auth, and account flows, and route-co-located page content (e.g. category and product pages) for maintainable, consistent UI.",
          },
          {
            title: "Performance-oriented UX",
            description:
              "Optimistic cart updates, TanStack Query with localStorage persistence for global data, dynamic imports for heavy client modules (cart, auth, campaigns), and skeleton/loading states across homepage, search, and product routes.",
          },
        ],
        showcase: true,
      },
      {
        title: "Architecture-Level Description",
        paragraphs: [
          "The storefront is organized as a feature-domain Next.js App Router application: catalog routes (category, brand, product, search), marketing routes (campaign, flash-sale, blogs), account routes under (account)/, and payment result pages. Shared shells—navbar, category bar, footer, providers—live in src/components/global/, while API access is centralized in src/lib/api/ with typed modules for products, cart, checkout, orders, campaigns, and settings.",
          "Client requests go through a Next.js BFF layer: browser calls /api/v1/* which proxies to NEXT_PUBLIC_API_BASE_URL, while dedicated route handlers cover cart mutations, checkout summary, coupons, and auth. State is split between Zustand stores (cart, addresses, coupons, auth modal) and TanStack Query hooks for server data. NextAuth handles Google/Facebook OAuth and exchanges provider tokens with the backend social-login endpoint.",
          "SEO and growth are first-class: dynamic metadata from CMS settings, JSON-LD for Organization, WebSite, Product, Article, Event, and CollectionPage, a Google Merchant product feed at /merchant-feed.xml, GA4/GTM ecommerce events (view_item, add_to_cart, begin_checkout, purchase), and Facebook Pixel. This keeps the storefront scalable as new merchandising, payment, or account features are added without rewriting the core shell.",
        ],
      },
    ],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getAllProjectSlugs(): string[] {
  return projects
    .filter((project) => project.sections.length > 0 && project.heroImage)
    .map((project) => project.slug);
}
