const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function img(src: string): string {
  if (!src || src.startsWith('http')) return src;
  return `${basePath}${src}`;
}
