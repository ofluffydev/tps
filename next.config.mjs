/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "cdn.simpleicons.org",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "galleries.thephotostore.com",
        port: "",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
