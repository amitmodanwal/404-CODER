/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep generated build files out of the Windows-locked legacy `.next` folder.
  distDir: '.next-build',
};

export default nextConfig;
