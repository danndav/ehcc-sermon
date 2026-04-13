const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function getImagePath(src: string): string {
  if (src.startsWith('http')) return src;
  return `${basePath}${src}`;
}
