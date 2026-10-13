// ============================================================
// مساعد NIAS الذكي — محرك مطابقة grounded محلي خفيف
// ------------------------------------------------------------
// المعمارية:
//  - في الوضع الحالي: يجيب حصريًا من (KB) مبنية من محتوى الموقع
//    الرسمي في زمن البناء، دون أي اتصال بالشبكة => Grounded AI.
//  - مستقبلًا: عند توفر خادم/Serverless (Netlify/Vercel/…)، نضع في
//    بيئة الخادم المتغيرات السرية (PUBLIC_AI_ENDPOINT + LLM Keys)
//    ونستدعي الواجهة الآمنة /api/assistant (خلف مفتاح جلسة).
//    لا تُوضع أي مفاتيح API في الـ Frontend أبدًا.
// ------------------------------------------------------------
// هذه الوحدة خالصة (pure) وليس لها اعتماديات — تعمل في المتصفح.

export interface AISource {
  label: string;
  href: string;
  blurb: string;
}

export interface AIEntry {
  id: string;
  group: string;
  title: string;
  keywords: string[];
  text: string;
  href: string;
  blurb: string;
}

export interface AIAnswer {
  text: string;
  sources: AISource[];
  matched: boolean;
}

/** تطبيع عربي بسيط: إزالة التشكيل والتطويل وتوحيد الأحرف وعلامات الترقيم. */
export function normalizeAr(input: string): string {
  return input
    .replace(/[\u064B-\u0652]/g, '')
    .replace(/[\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u200c\u200d]/g, ' ')
    .replace(/[؟?!.,،؛:()"\u00AB\u00BB]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

const STOP = new Set(
  [
    'هل', 'ما', 'ماهو', 'ماهي', 'ما هي', 'ما هو', 'ال', 'في', 'عن', 'على', 'من', 'الى',
    'الى', 'كيف', 'اين', 'متى', 'و', 'او', 'ذلك', 'هذا', 'هذه', 'لدي', 'حول', 'بخصوص',
    'بشأن', 'عند', 'مع', 'من', 'لي', 'لو', 'لا', 'نعم', 'اظهر', 'اعطني', 'اخبرني',
    'اقول', 'عرفني', 'رتب', 'لماذا', 'لما', 'ماذا', 'هي', 'هو', 'هيه', 'ممكن', 'عندي', 'افيدني', 'تساعدني',
  ].map((s) => normalizeAr(s))
);

/** إزالة أدوات التعريف/العطف المدمجة (ال، وال، بال، لل) من بداية الكلمة. */
const stripAffix = (t: string) => t.replace(/^(وال|بال|لل|ال)/, '');

export function tokenize(query: string): string[] {
  return normalizeAr(query)
    .split(' ')
    .map((t) => t.trim())
    .map(stripAffix)
    .filter((t) => t && t.length > 1 && !STOP.has(normalizeAr(t)));
}

const FALLBACK = {
  text:
    'أعتذر، لم أجد معلومة موثقة حول هذا في قاعدة معرفة NIAS الحالية (المحتوى الرسمي للموقع). ' +
    'أنا أعتمد فقط على المصادر الرسمية، ولا أُخمّن إجابات. أنصحك بالتواصل مع شؤون القبول عبر ' +
    'admission@nias-ye.academy أو صفحة التواصل، وسأُحدّث معرفتي مع توسّع محتوى المنصة.',
  sources: [] as AISource[],
};

export function answerQuestion(query: string, kb: AIEntry[]): AIAnswer {
  const tokens = tokenize(query);
  const total = normalizeAr(query).split(' ').filter(Boolean).length;
  if (!tokens.length || !kb.length) return { ...FALLBACK, text: '', sources: [], matched: false };

  let best: AIEntry | null = null;
  let bestScore = 0;
  let second: AIEntry | null = null;
  let secondScore = 0;

  for (const e of kb) {
    let s = 0;
    const nText = normalizeAr(e.text);
    const nTitle = normalizeAr(e.title);
    const nKw = e.keywords.map(normalizeAr);
    for (const t of tokens) {
      if (nKw.some((k) => k === t)) s += 6;
      else if (nKw.some((k) => k.includes(t) && k.length - t.length <= 4)) s += 4;
      if (nTitle.includes(t)) s += 3;
      if (nText.includes(t)) s += 1;
    }
    if (s > bestScore) {
      secondScore = bestScore;
      second = best;
      bestScore = s;
      best = e;
    } else if (s > secondScore) {
      secondScore = s;
      second = e;
    }
  }

  const threshold = total <= 2 ? 4 : 6;
  if (!best || bestScore < threshold) {
    return { ...FALLBACK, text: FALLBACK.text, sources: [{ label: 'صفحة التواصل', href: '/contact', blurb: 'رقم المعهد والبريد الرسمي' }], matched: false };
  }

  const sources: AISource[] = [
    { label: best.title, href: best.href, blurb: best.blurb },
  ];
  if (second && second !== best && secondScore >= threshold * 0.6) {
    sources.push({ label: second.title, href: second.href, blurb: second.blurb });
  }

  return { text: best.text, sources, matched: true };
}