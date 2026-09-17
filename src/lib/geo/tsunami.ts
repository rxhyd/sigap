export function hasTsunamiPotential(potensi: string | null): boolean {
  if (!potensi) return false;
  const normalized = potensi.toLowerCase();
  return normalized.includes("berpotensi tsunami") && !normalized.includes("tidak berpotensi tsunami");
}
