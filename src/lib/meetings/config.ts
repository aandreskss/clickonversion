import type { MeetingTypeConfig, PreBriefCategory, PreBriefField } from "@/types/meetings"

// ── Meeting type registry ────────────────────────────────────────────────────
// calcomEventSlug must match the event type slug configured in your Cal.com dashboard.
// Format: cal.com/<CAL_USERNAME>/<calcomEventSlug>

export const MEETING_TYPES: Record<string, MeetingTypeConfig> = {
  discovery: {
    slug:                       "discovery",
    nameEn:                     "Free Growth Audit Call",
    nameEs:                     "Llamada de Auditoría Gratuita",
    descriptionEn:              "15 minutes to review your current presence and identify your biggest growth opportunities. No commitment.",
    descriptionEs:              "15 minutos para revisar tu presencia actual e identificar tus mayores oportunidades de crecimiento. Sin compromiso.",
    durationMin:                15,
    priceUsd:                   0,
    isFree:                     true,
    requiresBookingRight:       false,
    includedWithService:        false,
    requiresActiveSubscription: false,
    calcomEventSlug:            "discovery-15min",
    preBriefCategory:           "discovery",
    freeLimit:                  { count: 1, periodDays: 30 },
  },

  "meta-advisory-basic": {
    slug:                       "meta-advisory-basic",
    nameEn:                     "Meta Business Advisory",
    nameEs:                     "Asesoría Meta Business",
    descriptionEn:              "45-minute session with a Meta Business specialist — account review, issue resolution, or strategy.",
    descriptionEs:              "Sesión de 45 minutos con un especialista en Meta Business — revisión de cuenta, resolución de problemas o estrategia.",
    durationMin:                45,
    priceUsd:                   60,
    isFree:                     false,
    requiresBookingRight:       true,
    includedWithService:        false,
    requiresActiveSubscription: false,
    calcomEventSlug:            "meta-advisory-45min",
    preBriefCategory:           "meta",
  },

  "meta-advisory-specialized": {
    slug:                       "meta-advisory-specialized",
    nameEn:                     "Specialized Meta Advisory",
    nameEs:                     "Asesoría Meta Especializada",
    descriptionEn:              "60-minute deep-dive session for complex Meta Business Manager issues, WABA setup, or advanced strategy.",
    descriptionEs:              "Sesión de 60 minutos en profundidad para problemas complejos de Meta Business Manager, configuración WABA o estrategia avanzada.",
    durationMin:                60,
    priceUsd:                   70,
    isFree:                     false,
    requiresBookingRight:       true,
    includedWithService:        false,
    requiresActiveSubscription: false,
    calcomEventSlug:            "meta-advisory-60min",
    preBriefCategory:           "meta",
  },

  "technical-diagnosis": {
    slug:                       "technical-diagnosis",
    nameEn:                     "Technical Diagnosis",
    nameEs:                     "Diagnóstico Técnico",
    descriptionEn:              "A focused session to diagnose a specific technical issue. Duration and pricing are set per request.",
    descriptionEs:              "Sesión enfocada para diagnosticar un problema técnico específico. Duración y precio se definen por solicitud.",
    durationMin:                60,
    priceUsd:                   null,
    isFree:                     false,
    requiresBookingRight:       true,
    includedWithService:        false,
    requiresActiveSubscription: false,
    calcomEventSlug:            "technical-diagnosis",
    preBriefCategory:           "technical",
  },

  "onboarding-kickoff": {
    slug:                       "onboarding-kickoff",
    nameEn:                     "Onboarding Kickoff",
    nameEs:                     "Kickoff de Onboarding",
    descriptionEn:              "Kickoff call included with your service. We align on goals, timelines, and access.",
    descriptionEs:              "Llamada de inicio incluida con tu servicio. Alineamos objetivos, plazos y accesos.",
    durationMin:                30,
    priceUsd:                   0,
    isFree:                     false,
    requiresBookingRight:       true,
    includedWithService:        true,
    requiresActiveSubscription: false,
    calcomEventSlug:            "onboarding-kickoff",
    preBriefCategory:           "onboarding",
  },

  "project-followup": {
    slug:                       "project-followup",
    nameEn:                     "Project Follow-up",
    nameEs:                     "Seguimiento de Proyecto",
    descriptionEn:              "Monthly check-in for active clients to review results and next steps.",
    descriptionEs:              "Revisión mensual para clientes activos para revisar resultados y próximos pasos.",
    durationMin:                30,
    priceUsd:                   0,
    isFree:                     false,
    requiresBookingRight:       false,
    includedWithService:        false,
    requiresActiveSubscription: true,
    calcomEventSlug:            "project-followup",
    preBriefCategory:           "followup",
  },
}

export function getMeetingType(slug: string): MeetingTypeConfig | undefined {
  return MEETING_TYPES[slug]
}

// ── Pre-booking brief forms by category ─────────────────────────────────────
// NEVER include fields for passwords, API tokens, or security credentials.
// Fields collect context only — specialist reviews before the call.

export const PRE_BRIEF_FORMS: Record<PreBriefCategory, PreBriefField[]> = {
  discovery: [
    {
      key:           "company_name",
      labelEn:       "Company name",
      labelEs:       "Nombre de la empresa",
      type:          "text",
      required:      true,
      placeholderEn: "Acme Inc.",
    },
    {
      key:           "website",
      labelEn:       "Website URL",
      labelEs:       "Sitio web",
      type:          "url",
      required:      true,
      placeholderEn: "https://example.com",
    },
    {
      key:           "main_challenge",
      labelEn:       "What is your main challenge right now?",
      labelEs:       "¿Cuál es tu principal reto ahora mismo?",
      type:          "textarea",
      required:      true,
      placeholderEn: "e.g. We have a website but no leads from it...",
    },
    {
      key:      "monthly_budget",
      labelEn:  "Monthly marketing budget (approx.)",
      labelEs:  "Presupuesto mensual de marketing (aprox.)",
      type:     "select",
      required: false,
      options: [
        { value: "none",      labelEn: "Not investing yet",   labelEs: "Sin inversión aún" },
        { value: "lt500",     labelEn: "Under $500/mo",       labelEs: "Menos de $500/mes" },
        { value: "500_1500",  labelEn: "$500 – $1,500/mo",    labelEs: "$500 – $1.500/mes" },
        { value: "1500_5000", labelEn: "$1,500 – $5,000/mo",  labelEs: "$1.500 – $5.000/mes" },
        { value: "gt5000",    labelEn: "Over $5,000/mo",      labelEs: "Más de $5.000/mes" },
      ],
    },
  ],

  meta: [
    {
      key:      "country",
      labelEn:  "Country where ads will run",
      labelEs:  "País donde correrán los anuncios",
      type:     "text",
      required: true,
    },
    {
      key:           "monthly_budget_usd",
      labelEn:       "Monthly ad spend budget (USD)",
      labelEs:       "Presupuesto mensual de pauta (USD)",
      type:          "number",
      required:      true,
      placeholderEn: "e.g. 500",
    },
    {
      key:      "ad_objective",
      labelEn:  "Primary advertising objective",
      labelEs:  "Objetivo publicitario principal",
      type:     "select",
      required: true,
      options: [
        { value: "leads",       labelEn: "Lead generation",    labelEs: "Generación de leads" },
        { value: "sales",       labelEn: "Sales / ROAS",       labelEs: "Ventas / ROAS" },
        { value: "traffic",     labelEn: "Website traffic",    labelEs: "Tráfico al sitio" },
        { value: "brand",       labelEn: "Brand awareness",    labelEs: "Reconocimiento de marca" },
        { value: "messages",    labelEn: "WhatsApp messages",  labelEs: "Mensajes de WhatsApp" },
      ],
    },
    {
      key:           "website",
      labelEn:       "Website or landing page URL",
      labelEs:       "Sitio web o landing page",
      type:          "url",
      required:      true,
      placeholderEn: "https://example.com",
    },
    {
      key:      "account_status",
      labelEn:  "Current Meta Business Manager status",
      labelEs:  "Estado actual de Meta Business Manager",
      type:     "select",
      required: true,
      options: [
        { value: "no_account",   labelEn: "Don't have one yet",        labelEs: "Aún no tengo cuenta" },
        { value: "new",          labelEn: "New account (< 3 months)",  labelEs: "Cuenta nueva (< 3 meses)" },
        { value: "active",       labelEn: "Active and running",        labelEs: "Activa y funcionando" },
        { value: "restricted",   labelEn: "Restricted or limited",     labelEs: "Restringida o limitada" },
        { value: "disabled",     labelEn: "Disabled / blocked",        labelEs: "Deshabilitada / bloqueada" },
      ],
    },
    {
      key:           "issue_description",
      labelEn:       "Describe what you need help with",
      labelEs:       "Describe en qué necesitas ayuda",
      type:          "textarea",
      required:      true,
      placeholderEn: "e.g. My account was disabled two weeks ago and...",
    },
  ],

  seo: [
    {
      key:           "domain",
      labelEn:       "Domain to optimize",
      labelEs:       "Dominio a optimizar",
      type:          "url",
      required:      true,
      placeholderEn: "https://example.com",
    },
    {
      key:           "target_country",
      labelEn:       "Primary target country / region",
      labelEs:       "País / región objetivo principal",
      type:          "text",
      required:      true,
      placeholderEn: "e.g. United States, Spain",
    },
    {
      key:           "industry",
      labelEn:       "Industry / sector",
      labelEs:       "Industria / sector",
      type:          "text",
      required:      true,
      placeholderEn: "e.g. Home services, e-commerce, legal",
    },
    {
      key:           "main_goal",
      labelEn:       "Main SEO goal",
      labelEs:       "Objetivo principal de SEO",
      type:          "textarea",
      required:      true,
      placeholderEn: "e.g. Rank for local searches in Miami, increase organic leads by 50%...",
    },
    {
      key:           "main_competitors",
      labelEn:       "Top 2-3 competitor websites (optional)",
      labelEs:       "Principales 2-3 competidores (opcional)",
      type:          "textarea",
      required:      false,
      placeholderEn: "e.g. competitor1.com, competitor2.com",
    },
    {
      key:      "search_console_access",
      labelEn:  "Do you have Google Search Console set up?",
      labelEs:  "¿Tienes Google Search Console configurado?",
      type:     "select",
      required: false,
      options: [
        { value: "yes",     labelEn: "Yes",           labelEs: "Sí" },
        { value: "no",      labelEn: "No",            labelEs: "No" },
        { value: "unsure",  labelEn: "Not sure",      labelEs: "No estoy seguro" },
      ],
    },
  ],

  waba: [
    {
      key:      "current_provider",
      labelEn:  "Current WhatsApp provider / platform",
      labelEs:  "Proveedor / plataforma de WhatsApp actual",
      type:     "select",
      required: true,
      options: [
        { value: "none",     labelEn: "None (getting started)",    labelEs: "Ninguno (empezando)" },
        { value: "callbell", labelEn: "Callbell",                  labelEs: "Callbell" },
        { value: "wati",     labelEn: "WATI",                      labelEs: "WATI" },
        { value: "kommo",    labelEn: "Kommo",                     labelEs: "Kommo" },
        { value: "b2chat",   labelEn: "B2Chat",                    labelEs: "B2Chat" },
        { value: "other",    labelEn: "Other",                     labelEs: "Otro" },
      ],
    },
    {
      key:      "issue_type",
      labelEn:  "Type of issue",
      labelEs:  "Tipo de problema",
      type:     "select",
      required: true,
      options: [
        { value: "waba_setup",    labelEn: "WABA / API setup",         labelEs: "Configuración WABA / API" },
        { value: "account_block", labelEn: "Account blocked / banned",  labelEs: "Cuenta bloqueada / baneada" },
        { value: "chatbot",       labelEn: "Chatbot / automation",      labelEs: "Chatbot / automatización" },
        { value: "integration",   labelEn: "CRM / tool integration",    labelEs: "Integración CRM / herramienta" },
        { value: "template",      labelEn: "Message templates",         labelEs: "Plantillas de mensajes" },
        { value: "other",         labelEn: "Other",                     labelEs: "Otro" },
      ],
    },
    {
      key:           "error_message",
      labelEn:       "Error message or description (if applicable)",
      labelEs:       "Mensaje de error o descripción (si aplica)",
      type:          "textarea",
      required:      false,
      placeholderEn: "Paste the error message you're seeing...",
    },
    {
      key:      "phone_number_status",
      labelEn:  "Status of your WhatsApp number",
      labelEs:  "Estado de tu número de WhatsApp",
      type:     "select",
      required: true,
      options: [
        { value: "active",     labelEn: "Active / working",  labelEs: "Activo / funcionando" },
        { value: "pending",    labelEn: "Pending approval",  labelEs: "Pendiente de aprobación" },
        { value: "flagged",    labelEn: "Flagged / limited", labelEs: "Marcado / limitado" },
        { value: "blocked",    labelEn: "Blocked",           labelEs: "Bloqueado" },
        { value: "no_number",  labelEn: "No number yet",     labelEs: "Sin número aún" },
      ],
    },
  ],

  automation: [
    {
      key:           "current_tools",
      labelEn:       "Tools currently in use",
      labelEs:       "Herramientas que usas actualmente",
      type:          "textarea",
      required:      true,
      placeholderEn: "e.g. WhatsApp, Google Sheets, Mailchimp, HubSpot...",
    },
    {
      key:           "expected_flow",
      labelEn:       "Describe the automation flow you need",
      labelEs:       "Describe el flujo de automatización que necesitas",
      type:          "textarea",
      required:      true,
      placeholderEn: "e.g. When a lead submits the form, send a WhatsApp and add to CRM...",
    },
    {
      key:           "num_users",
      labelEn:       "Number of users / agents who will use it",
      labelEs:       "Número de usuarios / agentes que lo usarán",
      type:          "number",
      required:      false,
      placeholderEn: "e.g. 3",
    },
    {
      key:           "required_integrations",
      labelEn:       "Required integrations (CRM, payment system, etc.)",
      labelEs:       "Integraciones requeridas (CRM, sistema de pagos, etc.)",
      type:          "textarea",
      required:      false,
      placeholderEn: "e.g. Stripe, Notion, Google Calendar...",
    },
  ],

  technical: [
    {
      key:           "domain_or_product",
      labelEn:       "Website domain or product name",
      labelEs:       "Dominio del sitio o nombre del producto",
      type:          "text",
      required:      true,
      placeholderEn: "example.com or My App",
    },
    {
      key:      "platform",
      labelEn:  "Platform / technology stack",
      labelEs:  "Plataforma / stack tecnológico",
      type:     "select",
      required: true,
      options: [
        { value: "wordpress",  labelEn: "WordPress",        labelEs: "WordPress" },
        { value: "shopify",    labelEn: "Shopify",          labelEs: "Shopify" },
        { value: "nextjs",     labelEn: "Next.js",          labelEs: "Next.js" },
        { value: "wix",        labelEn: "Wix",              labelEs: "Wix" },
        { value: "other",      labelEn: "Other / custom",   labelEs: "Otro / personalizado" },
      ],
    },
    {
      key:      "urgency",
      labelEn:  "Urgency",
      labelEs:  "Urgencia",
      type:     "select",
      required: true,
      options: [
        { value: "critical",  labelEn: "Critical — site down / revenue impacted",  labelEs: "Crítico — sitio caído / impacto en ingresos" },
        { value: "high",      labelEn: "High — needs attention within 24h",        labelEs: "Alto — necesita atención en 24h" },
        { value: "medium",    labelEn: "Medium — within this week",                labelEs: "Medio — esta semana" },
        { value: "low",       labelEn: "Low — planning ahead",                     labelEs: "Bajo — planificación futura" },
      ],
    },
    {
      key:           "issue_description",
      labelEn:       "Describe the technical issue",
      labelEs:       "Describe el problema técnico",
      type:          "textarea",
      required:      true,
      placeholderEn: "What is happening? What did you expect to happen? When did it start?",
    },
  ],

  onboarding: [
    {
      key:           "main_goal",
      labelEn:       "What is your primary goal for this service?",
      labelEs:       "¿Cuál es tu objetivo principal con este servicio?",
      type:          "textarea",
      required:      true,
      placeholderEn: "e.g. Get 20 qualified leads per month from Google Ads...",
    },
    {
      key:           "current_situation",
      labelEn:       "Describe your current situation",
      labelEs:       "Describe tu situación actual",
      type:          "textarea",
      required:      true,
      placeholderEn: "e.g. We currently have 0 paid campaigns running, we had one before that...",
    },
    {
      key:           "additional_notes",
      labelEn:       "Anything else we should know?",
      labelEs:       "¿Algo más que debamos saber?",
      type:          "textarea",
      required:      false,
      placeholderEn: "Competitor info, seasonal business, existing campaigns...",
    },
  ],

  followup: [
    {
      key:           "project_name",
      labelEn:       "Service / project name",
      labelEs:       "Nombre del servicio / proyecto",
      type:          "text",
      required:      true,
      placeholderEn: "e.g. Meta Ads — Q4 Campaign",
    },
    {
      key:           "questions",
      labelEn:       "What would you like to discuss?",
      labelEs:       "¿Qué te gustaría discutir?",
      type:          "textarea",
      required:      true,
      placeholderEn: "e.g. Results from last month, adjusting strategy for Black Friday...",
    },
  ],
}

export function getPreBriefForm(category: PreBriefCategory): PreBriefField[] {
  return PRE_BRIEF_FORMS[category] ?? PRE_BRIEF_FORMS.discovery
}
