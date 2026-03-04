/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  transpilePackages: ["@mui/material", "@mui/icons-material"],
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
