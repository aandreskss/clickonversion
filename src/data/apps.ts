export type AppStatus = "live" | "beta" | "coming-soon" | "waitlist"

export interface AppFeature {
  title: string
  description: string
  icon: string
}

export interface AppPricing {
  name: string
  price: string
  period?: string
  description: string
  features: string[]
  cta: string
  highlighted?: boolean
}

export interface AppFaq {
  q: string
  a: string
}

export interface AppScreenshot {
  src: string
  alt: string
  caption?: string
}

export interface App {
  slug: string
  name: string
  tagline: string
  description: string
  longDescription: string
  status: AppStatus
  accent: string
  accentMuted: string
  accentBorder: string
  icon: string
  category: string
  features: AppFeature[]
  screenshots: AppScreenshot[]
  pricing?: AppPricing[]
  pricingNote?: string
  ctaPrimary: { label: string; href: string }
  ctaSecondary?: { label: string; href: string }
  faqs: AppFaq[]
  docsUrl?: string
  externalUrl?: string
  includedWithServices?: boolean
}

export const APPS: App[] = [
  {
    slug: "synclead",
    name: "SyncLead",
    tagline: "Your Meta Ads leads, in your pipeline — automatically.",
    description:
      "SyncLead centralizes leads from Meta Ads, tracks your pipeline with a visual kanban, and lets your team respond via WhatsApp — all in one place.",
    longDescription:
      "SyncLead was built to solve a specific problem: leads from Meta Ads disappear into spreadsheets, slow down your team, and never get proper follow-up. We built SyncLead to fix that — connecting Meta directly to your sales pipeline with real-time sync, WhatsApp notifications, and AI agents that respond before your competitors do.",
    status: "beta",
    accent: "#7885FF",
    accentMuted: "rgba(120,133,255,0.1)",
    accentBorder: "rgba(120,133,255,0.25)",
    icon: "synclead",
    category: "CRM & Lead Management",
    features: [
      {
        title: "Real-time lead sync from Meta Ads",
        description:
          "Every lead from your Meta Ads campaigns arrives in your pipeline the moment they submit a form — no manual exports, no CSV files.",
        icon: "sync",
      },
      {
        title: "Visual pipeline with kanban",
        description:
          "Drag leads through your sales stages (New → Contacted → Qualified → Converted) and never lose track of where each opportunity stands.",
        icon: "kanban",
      },
      {
        title: "WhatsApp Business integrated",
        description:
          "Send and receive messages directly inside SyncLead. Your team manages conversations without switching tools.",
        icon: "whatsapp",
      },
      {
        title: "AI agents that respond instantly",
        description:
          "Configure AI agents to greet leads on WhatsApp, qualify them, and escalate to your team — 24/7, across Claude, GPT, Gemini, and more.",
        icon: "ai",
      },
      {
        title: "Automatic lead qualification",
        description:
          "Define qualification rules and scoring profiles. SyncLead automatically categorizes leads by temperature and readiness to buy.",
        icon: "qualify",
      },
      {
        title: "Meta Conversions API (CAPI)",
        description:
          "Every confirmed sale fires a Purchase event back to Meta so your ad algorithm optimizes for real conversions, not just form fills.",
        icon: "capi",
      },
      {
        title: "Team collaboration with roles",
        description:
          "Assign leads to agents, set permissions by role (Owner, Admin, Manager, Agent), and track every interaction with a full audit log.",
        icon: "team",
      },
      {
        title: "Import leads from any source",
        description:
          "Already have leads in a spreadsheet? Import via CSV with automatic deduplication — SyncLead finds and merges duplicates before they pollute your pipeline.",
        icon: "import",
      },
    ],
    screenshots: [],
    pricing: undefined,
    pricingNote:
      "SyncLead is currently in private beta. Pricing will be announced at general availability. Early access is included with ClicKonversion's Meta Ads and automation services.",
    ctaPrimary: {
      label: "Request early access",
      href: "/apps/synclead#waitlist",
    },
    ctaSecondary: {
      label: "Get it included with services",
      href: "/audit",
    },
    faqs: [
      {
        q: "Does SyncLead work with any Meta Ads account?",
        a: "Yes. SyncLead connects to any Meta Business Manager via official Meta API. You need admin access to your Meta Business account to complete the setup — our team guides you through it.",
      },
      {
        q: "Do I need a WhatsApp Business API account?",
        a: "To use the WhatsApp messaging features, you need an official WhatsApp Business API account connected through Meta. SyncLead walks you through the connection flow. If you already have a provider (WATI, 360Dialog, etc.), we can help you migrate.",
      },
      {
        q: "Can the AI agents respond in Spanish?",
        a: "Yes. AI agents are fully multilingual — you configure the language and persona. Most of our clients use Spanish-speaking agents for their Latin American markets.",
      },
      {
        q: "Is my Meta Ads data secure?",
        a: "All Meta access tokens are encrypted at rest using AES-256-GCM. SyncLead never stores your Meta password. You can revoke access from Meta at any time.",
      },
      {
        q: "What happens if a lead is duplicated?",
        a: "SyncLead detects duplicates automatically using a hash of name, phone, campaign, and date. Duplicates are flagged and skipped during import — they don't pollute your pipeline.",
      },
      {
        q: "Is there a limit on leads or team members?",
        a: "Beta access has generous limits for testing. Definitive limits will be set per pricing plan at launch. Current beta users will receive a migration path.",
      },
    ],
    docsUrl: undefined,
    externalUrl: undefined,
    includedWithServices: true,
  },
]

export function getApp(slug: string): App | undefined {
  return APPS.find((a) => a.slug === slug)
}
