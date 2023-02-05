export function extractStringBetweenBrackets(value: string): string {
  const startIndex = value.indexOf('[') + 1;
  const endIndex = value.indexOf(']');
  return value.substring(startIndex, endIndex);
}
