/** @type {import('next').NextConfig} */
module.exports = {
  output: "standalone",
  // image from unsplash.it
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "unsplash.it",
      },
    ],
  },
};
