import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // PGlite (Postgres en WASM) solo se usa en local cuando no hay DATABASE_URL.
  serverExternalPackages: ['@electric-sql/pglite'],
  poweredByHeader: false,
  // Hay un package-lock.json en una carpeta superior: fijar la raíz del proyecto aquí.
  turbopack: { root: process.cwd() },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}

export default nextConfig
