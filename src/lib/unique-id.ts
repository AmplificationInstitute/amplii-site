let count = 0;

/** A page-unique id for inline SVG references. */
export function uniqueId(prefix: string): string {
  count += 1;
  return `${prefix}-${count}`;
}
