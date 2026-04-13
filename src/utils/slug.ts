export function labelFromSlug(input: string) {
  return input
    .replace(/[-_]/g, ' ')
    .replace(/\w/g, (char) => char.toUpperCase());
}
