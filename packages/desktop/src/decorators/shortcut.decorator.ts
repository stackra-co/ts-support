/**
 * @Shortcut Decorator
 *
 * Registers a global keyboard shortcut.
 *
 * @example
 * ```typescript
 * @Injectable()
 * class ShortcutHandler {
 *   @Shortcut('CmdOrCtrl+Shift+P')
 *   openCommandPalette() { ... }
 * }
 * ```
 */

import "reflect-metadata";
import { SHORTCUT_METADATA } from "@/constants";

export interface ShortcutMetadata {
  accelerator: string;
  method: string;
}

export function Shortcut(accelerator: string): MethodDecorator {
  return (target: object, propertyKey: string | symbol) => {
    const existing: ShortcutMetadata[] =
      Reflect.getMetadata(SHORTCUT_METADATA, target.constructor) ?? [];

    existing.push({ accelerator, method: String(propertyKey) });

    Reflect.defineMetadata(SHORTCUT_METADATA, existing, target.constructor);
  };
}
