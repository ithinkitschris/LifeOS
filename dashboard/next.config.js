// Vercel deployment configuration (v2)
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Bundle the data directory with serverless functions so API routes
    // can read YAML/JSON files at runtime on Vercel.
    outputFileTracingIncludes: {
      '/api/**': ['./data/**'],
    },
  },
  async rewrites() {
    // In development, proxy all /api/* requests to the local backend.
    // In production (Vercel), the Next.js API route handlers in src/app/api/ serve data.
    if (process.env.NODE_ENV === 'development') {
      return {
        beforeFiles: [
          {
            source: '/api/:path*',
            destination: 'http://localhost:3001/api/:path*',
          },
        ],
      };
    }
    return { beforeFiles: [], afterFiles: [], fallback: [] };
  },
};

module.exports = nextConfig;
