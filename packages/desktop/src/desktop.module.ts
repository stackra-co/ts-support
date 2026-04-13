/**
 * Desktop Module
 *
 * |--------------------------------------------------------------------------
 * | DI Module for @abdokouta/ts-desktop
 * |--------------------------------------------------------------------------
 * |
 * | Registers:
 * |   - DESKTOP_CONFIG — raw config object
 * |   - DesktopManager — platform detection + bridge management
 * |   - DESKTOP_MANAGER — useExisting alias
 * |
 * | Menu classes decorated with @Menu() are auto-discovered from providers.
 * |
 * @module @abdokouta/ts-desktop
 *
 * @example
 * ```typescript
 * @Module({
 *   imports: [
 *     DesktopModule.forRoot({
 *       appName: 'My POS',
 *       titleBarStyle: 'native',
 *       autoUpdate: true,
 *     }),
 *   ],
 *   providers: [FileMenu, EditMenu],
 * })
 * export class AppModule {}
 * ```
 */

import { Module, type DynamicModule } from "@abdokouta/ts-container";

import type { DesktopModuleOptions } from "./interfaces";
import { DesktopManager } from "./services/desktop-manager.service";
import { DESKTOP_CONFIG, DESKTOP_MANAGER } from "./constants";

@Module({})
// biome-ignore lint/complexity/noStaticOnlyClass: Module pattern
export class DesktopModule {
  static forRoot(config: DesktopModuleOptions): DynamicModule {
    return {
      module: DesktopModule,
      global: true,
      providers: [
        { provide: DESKTOP_CONFIG, useValue: config },
        { provide: DesktopManager, useClass: DesktopManager },
        { provide: DESKTOP_MANAGER, useExisting: DesktopManager },
      ],
      exports: [DesktopManager, DESKTOP_MANAGER, DESKTOP_CONFIG],
    };
  }
}
