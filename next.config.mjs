/** @type {import('next').NextConfig} */
const nextConfig =  {
  trailingSlash: true,
  distDir: ".next", // Default directory for Next.js output
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    unoptimized: true,
    domains: [
      "localhost",
    ]
  }
};

export default nextConfig;