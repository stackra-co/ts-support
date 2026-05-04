/**
 * @fileoverview Globals barrel export.
 * @module @stackra/ts-support
 * @category Globals
 */

export { GlobalRegistry } from './global-registry';
export type { GlobalHelper, RegisterOptions } from './global-registry';
export { bootGlobals } from './boot';
export { env, value, str, tap, filled, blank, retry, sleep } from './helpers';
