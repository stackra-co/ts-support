/**
 * Customizer Registry
 *
 * |--------------------------------------------------------------------------
 * | Registry for theme customizer panels.
 * |--------------------------------------------------------------------------
 * |
 * | Modules register customizer panels via ThemeModule.registerCustomizer().
 * | The ThemeCustomizer component renders all registered panels.
 * |
 * @module @abdokouta/react-theming
 * @category Registries
 */

import { Injectable } from "@abdokouta/ts-container";
import { BaseRegistry } from "@abdokouta/react-support";
import type React from "react";

/*
|--------------------------------------------------------------------------
| CustomizerPanel Interface
|--------------------------------------------------------------------------
*/

/** A customizer panel registered with the ThemeModule. */
export interface CustomizerPanel {
  /** Unique ID for this panel (e.g. "auth", "multitenancy"). */
  id: string;
  /** Section heading shown in the drawer. */
  title: string;
  /** The React component that renders the customizer controls. */
  component: React.ComponentType;
  /** Display order — lower = shown first. @default 99 */
  order?: number;
}

/*
|--------------------------------------------------------------------------
| CustomizerRegistry
|--------------------------------------------------------------------------
*/

@Injectable()
export class CustomizerRegistry extends BaseRegistry<CustomizerPanel> {
  /*
  |--------------------------------------------------------------------------
  | register
  |--------------------------------------------------------------------------
  */
  register(id: string, panel: CustomizerPanel): void {
    super.register(id, panel);
  }

  /*
  |--------------------------------------------------------------------------
  | getPanels
  |--------------------------------------------------------------------------
  |
  | Returns all panels sorted by order ascending.
  |
  */
  getPanels(): CustomizerPanel[] {
    return this.getAll().sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  }
}

/** Global singleton CustomizerRegistry. */
export const customizerRegistry = new CustomizerRegistry();
