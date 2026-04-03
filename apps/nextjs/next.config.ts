/**
 * @file next.config.ts
 * @description Production-ready Next.js configuration for the Pixielity Next.js app.
 *
 * This file configures the Next.js build pipeline, runtime behaviour,
 * image optimisation, security headers, and performance settings.
 *
 * @see https://nextjs.org/docs/app/api-reference/next-config-js
 * @see https://nextjs.org/docs/app/building-your-application/deploying
 */

import type { NextConfig } from "next";

/**
 * Content Security Policy header value.
 *
 * Restricts which resources the browser is allowed to load.
 * Adjust the directives to match your actual CDN, API, and font origins.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
 */
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https:;
  frame-ancestors 'none';
`
  .replace(/\s{2,}/g, " ")
  .trim();

/**
 * HTTP security headers applied to every response.
 *
 * These headers harden the application against common web vulnerabilities:
 *   - XSS (Content-Security-Policy)
 *   - Clickjacking (X-Frame-Options, frame-ancestors in CSP)
 *   - MIME sniffing (X-Content-Type-Options)
 *   - Referrer leakage (Referrer-Policy)
 *   - Feature abuse (Permissions-Policy)
 *   - Protocol downgrade (Strict-Transport-Security)
 *
 * @see https://nextjs.org/docs/app/api-reference/next-config-js/headers
 */
const securityHeaders = [
  {
    // Prevent browsers from MIME-sniffing the content type.
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    // Prevent the page from being embedded in an iframe (clickjacking).
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    // Control how much referrer information is sent with requests.
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    // Restrict access to browser features (camera, microphone, etc.).
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    // Force HTTPS for 2 years, including subdomains.
    // Remove in development or if you don't control the domain.
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    // Content Security Policy — restrict resource origins.
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy,
  },
];

/**
 * Next.js application configuration.
 *
 * Sections:
 *   1. Output & build
 *   2. Performance & compiler
 *   3. Image optimisation
 *   4. Internationalisation
 *   5. Security headers
 *   6. Redirects & rewrites
 *   7. Environment variables
 *   8. Experimental features
 */
const nextConfig: NextConfig = {
  // ---------------------------------------------------------------------------
  // 1. Output & build
  // ---------------------------------------------------------------------------

  /**
   * Output mode.
   *
   * "standalone" — bundles only the files needed to run the app, ideal for
   *   Docker deployments. The output is placed in `.next/standalone/`.
   *
   * "export" — generates a fully static site (no server required).
   *   Use this for CDN-only deployments.
   *
   * Omit this field for standard Vercel / Node.js deployments.
   */
  // output: "standalone",

  /**
   * Trailing slash behaviour.
   * false (default) — /about → /about
   * true            — /about → /about/
   */
  trailingSlash: false,

  /**
   * Disable the "X-Powered-By: Next.js" response header.
   * Reduces information disclosure in production.
   */
  poweredByHeader: false,

  /**
   * Generate ETags for pages.
   * Enables browser caching via conditional GET requests.
   */
  generateEtags: true,

  /**
   * Compress responses with gzip.
   * Disable if your reverse proxy (nginx, Caddy) handles compression.
   */
  compress: true,

  // ---------------------------------------------------------------------------
  // 2. Performance & compiler
  // ---------------------------------------------------------------------------

  /**
   * SWC minifier — faster than Terser, enabled by default in Next.js 13+.
   * Explicitly set to true for clarity.
   */
  swcMinify: true,

  /**
   * React strict mode — enables additional runtime warnings in development.
   * Highly recommended; helps catch deprecated patterns early.
   */
  reactStrictMode: true,

  /**
   * Compiler options — control SWC transforms.
   *
   * removeConsole: strips console.* calls in production builds.
   *   Exclude "error" so production errors are still logged.
   */
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  // ---------------------------------------------------------------------------
  // 3. Image optimisation
  // ---------------------------------------------------------------------------

  /**
   * next/image configuration.
   *
   * remotePatterns: whitelist external image origins.
   *   Add your CDN, S3 bucket, or CMS image host here.
   *
   * formats: prefer AVIF (better compression) with WebP fallback.
   *
   * deviceSizes / imageSizes: breakpoints used to generate srcset values.
   *   Tune these to match your design system's breakpoints.
   */
  images: {
    remotePatterns: [
      // Example: allow images from your own API
      // {
      //   protocol: "https",
      //   hostname: "api.pixielity.com",
      //   pathname: "/images/**",
      // },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // ---------------------------------------------------------------------------
  // 4. Internationalisation
  // ---------------------------------------------------------------------------

  /**
   * i18n routing — uncomment and configure when adding multi-language support.
   *
   * @see https://nextjs.org/docs/app/building-your-application/routing/internationalization
   */
  // i18n: {
  //   locales: ["en", "ar", "fr"],
  //   defaultLocale: "en",
  // },

  // ---------------------------------------------------------------------------
  // 5. Security headers
  // ---------------------------------------------------------------------------

  /**
   * Apply security headers to all routes.
   * The headers defined in `securityHeaders` above are applied to every
   * response via the `/:path*` matcher.
   */
  async headers() {
    return [
      {
        // Apply to all routes.
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },

  // ---------------------------------------------------------------------------
  // 6. Redirects & rewrites
  // ---------------------------------------------------------------------------

  /**
   * Redirects — permanent (308) or temporary (307) URL redirects.
   *
   * @see https://nextjs.org/docs/app/api-reference/next-config-js/redirects
   */
  async redirects() {
    return [
      // Example: redirect old blog path to new one
      // {
      //   source: "/blog/:slug",
      //   destination: "/articles/:slug",
      //   permanent: true,
      // },
    ];
  },

  /**
   * Rewrites — proxy requests to a different URL without changing the browser URL.
   * Useful for API proxying or A/B testing.
   *
   * @see https://nextjs.org/docs/app/api-reference/next-config-js/rewrites
   */
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    };
  },

  // ---------------------------------------------------------------------------
  // 7. Environment variables
  // ---------------------------------------------------------------------------

  /**
   * Expose environment variables to the browser bundle.
   * Only variables listed here are included — never expose secrets.
   *
   * Prefer NEXT_PUBLIC_* prefix for client-side variables instead.
   */
  env: {
    APP_VERSION: process.env.npm_package_version ?? "0.0.0",
  },

  // ---------------------------------------------------------------------------
  // 8. Experimental features
  // ---------------------------------------------------------------------------

  /**
   * Experimental Next.js features.
   * Only enable features you actively use — they may change between releases.
   *
   * @see https://nextjs.org/docs/app/api-reference/next-config-js/experimental
   */
  experimental: {
    /**
     * Optimise package imports to reduce bundle size.
     * List packages that export many named exports (e.g. icon libraries).
     */
    optimizePackageImports: ["@heroui/react", "lucide-react"],

    /**
     * Typed routes — generates TypeScript types for all app routes.
     * Enables compile-time checking of `href` props in <Link>.
     */
    typedRoutes: true,
  },
};

export default nextConfig;
