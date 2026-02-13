/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // In development, proxy all /api/* requests to the local backend.
    // In production (Vercel), the Next.js API route handlers in src/app/api/ serve data
    // from the pre-generated static-data.json bundle.
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
