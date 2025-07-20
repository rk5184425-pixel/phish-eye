export function cn(...inputs: any[]) {
  // Simple utility for combining styles - not needed for StyleSheet but keeping for compatibility
  return inputs.filter(Boolean);
}