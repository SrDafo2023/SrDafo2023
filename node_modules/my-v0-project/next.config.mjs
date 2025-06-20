/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'stock.adobe.com',
        port: '',
        pathname: '**',
      },
    ],
  },
  allowedDevOrigins: [
    'http://192.168.1.7:3000',
  ],
}

export default nextConfig
