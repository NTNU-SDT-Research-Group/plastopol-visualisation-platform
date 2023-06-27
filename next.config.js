/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@deck.gl/layers", "@mapbox/tiny-sdf"],
  experimental: {
    esmExternals: "loose",
  },
};

module.exports = nextConfig;
