/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "localhost",
      "images.unsplash.com",
      "res.cloudinary.com",
      "eptmfstbrximgirfchrq.supabase.co",
      "lh3.googleusercontent.com",
    ],
  },
  experimental: {
    turbo: false, // Turbopack'i kapat
  },
};

export default nextConfig;
