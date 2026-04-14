import { BaseRegistry } from "@abdokouta/react-support";
import type React from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CustomizerPanel {
  /** Unique ID for this panel (e.g. "auth", "multitenancy") */
  id: string;
  /** Section heading shown in the drawer */
  title: string;
  /** The React component that renders the customizer controls */
  component: React.ComponentType;
  /** Display order — lower = shown first */
  order?: number;
}

// ─── Registry ─────────────────────────────────────────────────────────────────

export class CustomizerRegistry extends BaseRegistry<CustomizerPanel> {
  register(id: string, panel: CustomizerPanel): void {
    super.register(id, panel);
  }

  /** Returns all panels sorted by order ascending */
  getPanels(): CustomizerPanel[] {
    return this.getAll().sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  }
}

export const customizerRegistry = new CustomizerRegistry();
