/**
 * Local UI development without calling the remote API (saves rate limits).
 * Works only under `npm run dev`; production builds ignore this flag.
 */
export const isDevOffline =
  import.meta.env.DEV && import.meta.env.VITE_DEV_OFFLINE === 'true'
