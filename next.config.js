/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "tareq052.pythonanywhere.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://tareq052.pythonanywhere.com";
    const cleanBackendUrl = backendUrl.replace(/\/+$/, "");
    return [
      {
        source: "/media/:path*",
        destination: `${cleanBackendUrl}/media/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
