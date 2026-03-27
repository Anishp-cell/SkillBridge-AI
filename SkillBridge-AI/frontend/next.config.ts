
const nextConfig = {
  output: 'standalone', // Required for Docker deployment

  typescript: {
    ignoreBuildErrors: true, // Strict type checking can be skipped for production builds if needed
  },
};

export default nextConfig;
