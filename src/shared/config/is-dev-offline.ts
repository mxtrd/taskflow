/**
 * Portfolio/demo mode that runs app with local mock data instead of remote API.
 * Can be enabled in any environment (including production build) via `VITE_DEMO_MODE=true`.
 *
 * Legacy support:
 * - `VITE_DEV_OFFLINE=true` still works in development for backward compatibility.
 */
export const isDemoMode =
  import.meta.env.VITE_DEMO_MODE === 'true' ||
  (import.meta.env.DEV && import.meta.env.VITE_DEV_OFFLINE === 'true')

export const isDevOffline = isDemoMode
