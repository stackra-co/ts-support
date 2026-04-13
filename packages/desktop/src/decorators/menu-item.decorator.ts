/**
 * @MenuItem Decorator
 *
 * Marks a method as a menu item within a @Menu() class.
 *
 * @example
 * ```typescript
 * @Menu('file')
 * @Injectable()
 * class FileMenu {
 *   @MenuItem({ label: 'Save', accelerator: 'CmdOrCtrl+S' })
 *   save() { ... }
 *
 *   @MenuItem({ type: 'separator' })
 *   sep() {}
 *
 *   @MenuItem({ role: 'quit' })
 *   quit() {}
 * }
 * ```
 */

import "reflect-metadata";
import { MENU_ITEM_METADATA } from "@/constants";
import type { MenuItemOptions, MenuItemMetadata } from "@/interfaces";

export function MenuItem(options: MenuItemOptions = {}): MethodDecorator {
  return (target: object, propertyKey: string | symbol) => {
    const existing: MenuItemMetadata[] =
      Reflect.getMetadata(MENU_ITEM_METADATA, target.constructor) ?? [];

    existing.push({
      method: String(propertyKey),
      options,
    });

    Reflect.defineMetadata(MENU_ITEM_METADATA, existing, target.constructor);
  };
}
