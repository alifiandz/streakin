// Test-only module alias. Never imported by application code or Vite.
export function createClient(){return (globalThis as any).__testSupabase;}
