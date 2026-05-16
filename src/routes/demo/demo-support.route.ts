/**
 * @fileoverview Support Demo route — showcases utility function features.
 *
 * Single-page demo with tabbed sections covering:
 * - String manipulation playground
 * - Array/Object operations
 * - Number formatting
 * - Registry pattern
 * - Collection utilities
 *
 * @module @stackra/ts-support
 * @category Demo
 */

import { Route } from "@stackra/react-router";
import { DemoSupportPage } from "./pages";

/**
 * Support demo — utility functions subsystem showcase.
 */
@Route({
  path: "/demo/support",
  title: "Support Demo",
  label: "Support Demo",
  icon: "wrench",
  variant: "main",
  hideInMenu: false,
  order: 45,
})
export class DemoSupportRoute {
  public render(): any {
    return DemoSupportPage();
  }
}
