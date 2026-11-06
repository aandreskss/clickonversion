import type { NextConfig } from "next";

const CSP = [
  "default-src 'self'",
  // Scripts: self + GA4 + Turnstile + fontshare (preconnect only)
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://challenges.cloudflare.com",
  // Styles: self + inline (Tailwind/CSS-in-JS) + fontshare
  "style-src 'self' 'unsafe-inline' https://api.fontshare.com",
  // Fonts
  "font-src 'self' https://api.fontshare.com https://fonts.gstatic.com",
  // Images: self + data URIs + GA4 pixel + Vercel Blob
  "img-src 'self' data: blob: https://www.google-analytics.com https://*.public.blob.vercel-storage.com",
  // Connect: self + GA4 + PayPal + Stripe + Resend + Cal.com + Cloudflare
  "connect-src 'self' https://www.google-analytics.com https://api-m.paypal.com https://api-m.sandbox.paypal.com https://api.stripe.com https://api.resend.com https://app.cal.com https://challenges.cloudflare.com",
  // Frames: PayPal + Stripe + Turnstile
  "frame-src https://www.paypal.com https://js.stripe.com https://challenges.cloudflare.com",
  // Form targets
  "form-action 'self'",
  // Disallow embedding in iframes
  "frame-ancestors 'none'",
  // Upgrade insecure requests
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  reactStrictMode: true,

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",    value: "nosniff" },
          { key: "X-Frame-Options",            value: "DENY" },
          { key: "Referrer-Policy",            value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",         value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security",  value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Content-Security-Policy",    value: CSP },
          { key: "X-DNS-Prefetch-Control",     value: "on" },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
