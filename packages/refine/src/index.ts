/**
 * @abdokouta/react-refine - Refine Framework Integration
 *
 * Central re-export point for all Refine.dev core functionality with enhanced hooks.
 * This package serves as the single point of contact with the Refine ecosystem.
 *
 * By routing all Refine imports through this package, we gain:
 * - Enhanced hooks with better DX (isLoading exposed directly)
 * - A single place to add custom data providers, auth providers, etc.
 * - Version pinning and upgrade control in one location
 * - The ability to extend or override Refine behaviour globally
 *
 * @example
 * ```tsx
 * // Instead of importing from @refinedev/core directly:
 * // import { useList } from '@refinedev/core';
 *
 * // Import from our wrapper:
 * import { useList, RefineModule, defineConfig } from '@abdokouta/react-refine';
 * ```
 *
 * @module @abdokouta/react-refine
 */

// ============================================================================
// Re-export all Refine core functionality
// ============================================================================
export * from '@refinedev/core';

// ============================================================================
// Constants (DI Tokens)
// ============================================================================
export {
  REFINE_CONFIG,
  REFINE_DATA_PROVIDER,
  REFINE_AUTH_PROVIDER,
  REFINE_ACCESS_CONTROL_PROVIDER,
  REFINE_LIVE_PROVIDER,
  REFINE_NOTIFICATION_PROVIDER,
  REFINE_I18N_PROVIDER,
  REFINE_AUDIT_LOG_PROVIDER,
  REFINE_OPTIONS,
} from './constants';

// ============================================================================
// Module (DI Configuration)
// ============================================================================
export { RefineModule } from './refine.module';

// ============================================================================
// Registries
// ============================================================================
export { ResourceRegistry } from './registries/resource.registry';
export type { ExtendedResourceItem } from './registries/resource.registry';

// ============================================================================
// Utils
// ============================================================================
export { defineConfig } from './utils';

// ============================================================================
// Interfaces & Configuration
// ============================================================================
export type {
  RefineConfig,
  DataProvider,
  DataProviders,
  AuthProvider,
  AccessControlProvider,
  LiveProvider,
  LiveModeProps,
  NotificationProvider,
  I18nProvider,
  AuditLogProvider,
  IRefineOptions,
} from './interfaces/refine-config.interface';

export type { RefineModuleOptions } from './interfaces/refine-module-options.interface';
export type {
  RefineModuleAsyncOptions,
  RefineOptionsFactory,
} from './interfaces/refine-module-async-options.interface';

// ============================================================================
// Enhanced Hooks
// ============================================================================
export { useOne } from './hooks/use-one';
export type { UseOneProps, UseOneReturnType } from './hooks/use-one';

export { useList } from './hooks/use-list';
export type { UseListProps, UseListReturnType } from './hooks/use-list';

export { useMany } from './hooks/use-many';
export type { UseManyProps, UseManyReturnType } from './hooks/use-many';

export { useShow } from './hooks/use-show';
export type { UseShowProps, UseShowReturnType } from './hooks/use-show';

export { useCreate } from './hooks/use-create';
export type {
  UseCreateProps,
  UseCreateReturnType,
  CreateMutationVariables,
} from './hooks/use-create';

export { useUpdate } from './hooks/use-update';
export type {
  UseUpdateProps,
  UseUpdateReturnType,
  UpdateMutationVariables,
} from './hooks/use-update';

export { useDelete } from './hooks/use-delete';
export type {
  UseDeleteProps,
  UseDeleteReturnType,
  DeleteMutationVariables,
} from './hooks/use-delete';

export { useCustom } from './hooks/use-custom';
export type { UseCustomProps, UseCustomReturnType } from './hooks/use-custom';

export { useCreateMany } from './hooks/use-create-many';
export type { UseCreateManyProps, UseCreateManyReturnType } from './hooks/use-create-many';

export { useUpdateMany } from './hooks/use-update-many';
export type { UseUpdateManyProps, UseUpdateManyReturnType } from './hooks/use-update-many';

export { useDeleteMany } from './hooks/use-delete-many';
export type { UseDeleteManyProps, UseDeleteManyReturnType } from './hooks/use-delete-many';

export { useCustomMutation } from './hooks/use-custom-mutation';
export type {
  UseCustomMutationProps,
  UseCustomMutationReturnType,
} from './hooks/use-custom-mutation';

export { useInfiniteList } from './hooks/use-infinite-list';
export type { UseInfiniteListProps, UseInfiniteListReturnType } from './hooks/use-infinite-list';
