export function formatRelativeId(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffSec = Math.round(diffMs / 1000);

  if (diffSec < 60) return "Baru saja";

  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin} menit lalu`;

  const diffHour = Math.round(diffMin / 60);
  if (diffHour < 24) return `${diffHour} jam lalu`;

  const diffDay = Math.round(diffHour / 24);
  if (diffDay < 30) return `${diffDay} hari lalu`;

  const diffMonth = Math.round(diffDay / 30);
  if (diffMonth < 12) return `${diffMonth} bulan lalu`;

  const diffYear = Math.round(diffMonth / 12);
  return `${diffYear} tahun lalu`;
}
