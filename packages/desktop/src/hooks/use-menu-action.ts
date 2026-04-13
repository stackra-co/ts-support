/**
 * useMenuAction Hook
 *
 * Listens for a menu action from the Electron main process.
 * Auto-unsubscribes on component unmount.
 *
 * @example
 * ```typescript
 * function OrderPage() {
 *   useMenuAction('menu:new-order', () => {
 *     openNewOrderDrawer();
 *   });
 *   return <div>...</div>;
 * }
 * ```
 */

import { useEffect } from "react";
import { useDesktop } from "./use-desktop";

export function useMenuAction(channel: string, callback: (...args: unknown[]) => void): void {
  const bridge = useDesktop();

  useEffect(() => {
    const unsub = bridge.onMenuAction(channel, callback);
    return unsub;
  }, [channel]);
}
