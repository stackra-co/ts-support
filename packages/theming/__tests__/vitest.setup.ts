/**
 * @fileoverview Vitest setup file for @abdokouta/react-theming package
 *
 * @module @abdokouta/react-theming
 * @category Configuration
 */

import { vi } from "vitest";

vi.mock("@abdokouta/ts-container", async () => {
  const actual = await vi.importActual("@abdokouta/ts-container");
  return {
    ...actual,
    Injectable: () => (target: any) => target,
    Inject:
      () => (_target: any, _propertyKey: string, _parameterIndex: number) => {},
    Module: (_metadata: any) => (target: any) => target,
  };
});
