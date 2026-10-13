export const defaultBranchSlug = 'sanaa';

export function hasGpsSupport(): boolean {
  return typeof navigator !== 'undefined' && 'geolocation' in navigator;
}

export async function closestBranchByGps(lat: number, lng: number, branches: { slug: string; gps: { lat: number; lng: number } }[]): Promise<string> {
  let best = branches[0]?.slug ?? defaultBranchSlug;
  let bestDist = Infinity;
  for (const b of branches) {
    const d = haversine(lat, lng, b.gps.lat, b.gps.lng);
    if (d < bestDist) {
      bestDist = d;
      best = b.slug;
    }
  }
  return best;
}

export function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function readStoredBranch(): string | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    return localStorage.getItem('nias:branch');
  } catch {
    return null;
  }
}

export function storeBranch(slug: string): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem('nias:branch', slug);
  } catch {
    /* ignore */
  }
}