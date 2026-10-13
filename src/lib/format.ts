const AR_MONTHS = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
];

export function formatDate(input: string | Date, withTime = false): string {
  const d = typeof input === 'string' ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return '';
  const day = d.getDate();
  const month = AR_MONTHS[d.getMonth()];
  const year = d.getFullYear();
  const base = `${day} ${month} ${year}`;
  if (!withTime) return base;
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${base}، الساعة ${h}:${m}`;
}

export function relativeDate(input: string): string {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return '';
  const diffDays = Math.round((Date.now() - d.getTime()) / 86_400_000);
  if (diffDays <= 0) return 'اليوم';
  if (diffDays === 1) return 'أمس';
  if (diffDays < 7) return `منذ ${diffDays} أيام`;
  if (diffDays < 30) return `منذ ${Math.floor(diffDays / 7)} أسابيع`;
  if (diffDays < 365) return `منذ ${Math.floor(diffDays / 30)} شهور`;
  return `منذ ${Math.floor(diffDays / 365)} سنة`;
}

export function toArabicNumerals(input: string | number): string {
  const map: Record<string, string> = {
    '0': '٠',
    '1': '١',
    '2': '٢',
    '3': '٣',
    '4': '٤',
    '5': '٥',
    '6': '٦',
    '7': '٧',
    '8': '٨',
    '9': '٩',
  };
  return String(input).replace(/[0-9]/g, (d) => map[d]);
}