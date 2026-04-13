/**
 * @file provider.tsx
 * @description Additional providers (theme, etc.) that wrap the app.
 *
 * The DI container (ContainerProvider) is set up in main.tsx.
 * This file is for any other providers that need to wrap the app.
 */

import * as React from "react";

export interface ProviderProps {
  children: React.ReactNode;
}

/**
 * Provider — additional provider wrappers.
 *
 * Add theme providers, toast providers, etc. here.
 * The DI container is already available from main.tsx.
 */
export function Provider({ children }: ProviderProps) {
  return <>{children}</>;
}
