/**
 * @OnIpc Decorator
 *
 * Marks a method as an IPC handler in the main process.
 *
 * @example
 * ```typescript
 * @Injectable()
 * class PrintHandler {
 *   @OnIpc('print-receipt')
 *   async handlePrint(html: string) {
 *     // Print the receipt
 *   }
 * }
 * ```
 */

import "reflect-metadata";
import { ON_IPC_METADATA } from "@/constants";

export interface OnIpcMetadata {
  channel: string;
  method: string;
}

export function OnIpc(channel: string): MethodDecorator {
  return (target: object, propertyKey: string | symbol) => {
    const existing: OnIpcMetadata[] =
      Reflect.getMetadata(ON_IPC_METADATA, target.constructor) ?? [];

    existing.push({ channel, method: String(propertyKey) });

    Reflect.defineMetadata(ON_IPC_METADATA, existing, target.constructor);
  };
}
