// basePath is already handled by Next.js for assets in /public
// This is only needed for dynamically constructed paths outside of next/image
export function getImagePath(src: string): string {
  return src;
}
