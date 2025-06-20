/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'resports.web.id', 'api.resports.web.id','storageresports.blob.core.windows.net'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'api.slingacademy.com',
        port: ''
      }
    ]
  },
  transpilePackages: ['geist']
};

module.exports = nextConfig;
