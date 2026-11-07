/** Map actual rendered marker centers to bounded timeline times. */
export function timelineStops(positions: number[], duration = 3600) {
  const first = positions[0] ?? 0,
    span = Math.max(1, (positions.at(-1) ?? first) - first);
  return positions.map((y) => ({
    y,
    delay: Math.max(0, Math.min(duration, ((y - first) / span) * duration)),
  }));
}
