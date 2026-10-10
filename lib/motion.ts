/** Measured, continuous down/hold/up screenshot cycle. */
export function panPosition(maximum: number, phase: number): number {
  if (maximum <= 20) return 0;
  const travel = Math.max(12000, (maximum / 42) * 1000);
  const cycle = travel * 2 + 3200;
  const t = ((phase % cycle) + cycle) % cycle;
  if (t < 1600) return 0;
  if (t < 1600 + travel) return ((t - 1600) / travel) * maximum;
  if (t < 3200 + travel) return maximum;
  return (1 - (t - 3200 - travel) / travel) * maximum;
}
/** Resume from the actual user position, rather than jumping to an old frame. */
export function panPhase(maximum: number, position: number): number {
  const travel = Math.max(12000, (maximum / 42) * 1000);
  return (
    1600 + travel * Math.max(0, Math.min(1, maximum ? position / maximum : 0))
  );
}
export function loopCopies(groupWidth: number, viewportWidth: number): number {
  return groupWidth > 0
    ? Math.max(1, Math.ceil(viewportWidth / groupWidth))
    : 1;
}
export function loopDuration(groupWidth: number): number {
  return (groupWidth / 28) * 1000;
}
/** Identical neighboring groups let either scrub direction cross the seam. */
export function loopOffset(offset: number, width: number): number {
  return width > 0 ? ((offset % width) + width) % width : 0;
}
/** Converging sections meet with a bounded rebound, then settle without drift. */
export function assemblyState(input: number): {
  progress: number;
  offset: number;
  impact: number;
} {
  const progress = Math.max(0, Math.min(1, input));
  if (progress === 1) return { progress: 1, offset: 0, impact: 0 };
  const eased = 1 - Math.pow(1 - progress, 3);
  const contact = Math.max(0, (progress - 0.55) / 0.45);
  const rebound =
    Math.sin(contact * Math.PI * 2) * Math.pow(1 - contact, 2) * 0.12;
  return {
    progress,
    offset: 1 - eased - rebound,
    impact: Math.sin(contact * Math.PI) * (1 - contact),
  };
}
