/**
 * @fileoverview Vitest setup file for @abdokouta/ts-desktop package
 *
 * Configures the testing environment before running tests.
 * Mocks DI decorators and the Electron preload API.
 *
 * Setup Features:
 * - Container decorator mocking for DI tests
 * - window.electronAPI mock for bridge tests
 *
 * @module @abdokouta/ts-desktop
 * @category Configuration
 */

import { vi } from "vitest";

/**
 * Mock @abdokouta/ts-container decorators
 *
 * Ensures decorator metadata doesn't interfere with tests
 * and allows testing module behavior in isolation.
 */
vi.mock("@abdokouta/ts-container", async () => {
  const actual = await vi.importActual("@abdokouta/ts-container");
  return {
    ...actual,
    Injectable: () => (target: any) => target,
    Inject:
      () => (_target: any, _propertyKey: string, _parameterIndex: number) => {},
    Optional:
      () => (_target: any, _propertyKey: string, _parameterIndex: number) => {},
    Module: (_metadata: any) => (target: any) => target,
  };
});

/**
 * Mock window.electronAPI for Electron bridge tests.
 *
 * Provides a no-op implementation of the preload API
 * so ElectronBridge can be tested without a real Electron environment.
 */
Object.defineProperty(globalThis, "window", {
  value: {
    ...globalThis.window,
    electronAPI: undefined, // Set to mock object in individual tests when needed
  },
  writable: true,
});
