type Power = EventTarget & { charging: boolean; level: number };
type Connection = EventTarget & { saveData?: boolean };

/** Notify only at lifecycle boundaries; the browser owns animation frames. */
export function observeMotion(
  element: Element,
  change: (visible: boolean, restricted: boolean) => void,
  checkBattery = false,
) {
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  const device = navigator as Navigator & {
    connection?: Connection;
    getBattery?: () => Promise<Power>;
  };
  let onScreen = false,
    disposed = false,
    battery: Power | undefined;
  const sync = () => {
    if (disposed) return;
    change(
      onScreen && !document.hidden,
      preference.matches ||
        !!device.connection?.saveData ||
        !!(battery && !battery.charging && battery.level <= 0.2),
    );
  };
  const observer = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    sync();
  });
  observer.observe(element);
  preference.addEventListener("change", sync);
  device.connection?.addEventListener("change", sync);
  document.addEventListener("visibilitychange", sync);
  if (checkBattery) {
    device
      .getBattery?.()
      .then((power) => {
        if (disposed) return;
        battery = power;
        power.addEventListener("levelchange", sync);
        power.addEventListener("chargingchange", sync);
        sync();
      })
      .catch(() => {});
  }
  sync();
  return () => {
    disposed = true;
    observer.disconnect();
    preference.removeEventListener("change", sync);
    device.connection?.removeEventListener("change", sync);
    document.removeEventListener("visibilitychange", sync);
    battery?.removeEventListener("levelchange", sync);
    battery?.removeEventListener("chargingchange", sync);
  };
}
