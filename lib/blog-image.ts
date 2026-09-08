/** Preserve portrait subjects; landscape editorial photos can fill their frame. */
export function blogImageFit(src: string): 'object-contain' | 'object-cover' {
  const dimensions = src.match(/-(\d+)x(\d+)\.[a-z]+(?:\?|$)/i);
  return dimensions && Number(dimensions[2]) > Number(dimensions[1])
    ? 'object-contain'
    : 'object-cover';
}
