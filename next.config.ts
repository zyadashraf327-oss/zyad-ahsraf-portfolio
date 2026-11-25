import type { NextConfig } from "next";

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' blob: data: https://github.com https://raw.githubusercontent.com https://images.unsplash.com https:;
  font-src 'self' https://fonts.gstatic.com data:;
  connect-src 'self' https://vitals.vercel-insights.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`;

const nextConfig: NextConfig = {
  // 1️⃣ تفعيل الضغط الفائق (Gzip/Brotli) لتخفيض حجم البيانات المنقولة
  compress: true,

  // 2️⃣ حماية وأمان: إخفاء هيدر Next.js لتصعيب تتبع تقنيات الموقع
  poweredByHeader: false,

  // 3️⃣ تحسين الصور الفائق + تفعيل الكاش الطويل (1 سنة) لدعم مئات الآلاف من الزوار
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  // 4️⃣ مسح جُمل الـ console.log تلقائياً في النسخة النهائية
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // 5️⃣ تسريع شحن مكتبات الأيقونات والأنيميشن (Tree Shaking & Package Optimization)
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  // 6️⃣ التحكم في مكان مؤشر أدوات التطوير
  devIndicators: {
    position: "bottom-right",
  },

  // 7️⃣ دمج Security Headers + ترويسات التخزين المؤقت الدائمة (Edge Cache Headers)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\s{2,}/g, " ").trim(),
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
      {
        source: "/:all*(svg|jpg|png|webp|avif|woff2|woff)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;