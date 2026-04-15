/**
 * Refine Module
 *
 * Module for configuring and initializing Refine in applications.
 * Provides a clean API similar to NestJS modules with forRoot and forFeature patterns.
 *
 * Note: Resources are managed separately via RefineModule.forFeature()
 *
 * @example
 * Root module configuration:
 * ```typescript
 * import { Module } from '@abdokouta/ts-container';
 * import { RefineModule, defineConfig } from '@abdokouta/react-refine';
 * import { dataProvider } from '@refinedev/simple-rest';
 *
 * const config = defineConfig({
 *   dataProvider: dataProvider('https://api.example.com'),
 *   options: {
 *     mutationMode: 'optimistic',
 *   },
 * });
 *
 * @Module({
 *   imports: [RefineModule.forRoot(config)],
 * })
 * export class AppModule {}
 * ```
 *
 * @example
 * Feature module with resources:
 * ```typescript
 * import { RefineModule } from '@abdokouta/react-refine';
 *
 * @Module({
 *   imports: [
 *     RefineModule.forFeature([
 *       { name: 'posts', list: '/posts' },
 *     ])
 *   ]
 * })
 * export class PostsModule {}
 * ```
 *
 * @example
 * Async configuration:
 * ```typescript
 * import { RefineModule } from '@abdokouta/react-refine';
 * import { ConfigService } from '@abdokouta/config';
 *
 * @Module({
 *   imports: [
 *     RefineModule.forRootAsync({
 *       useFactory: (config: ConfigService) => ({
 *         dataProvider: createDataProvider(config.get('API_URL')),
 *       }),
 *       inject: [ConfigService],
 *     })
 *   ]
 * })
 * export class AppModule {}
 * ```
 *
 * @module @abdokouta/react-refine
 */

import { Module } from '@abdokouta/ts-container';
import type { IResourceItem } from '@refinedev/core';
import { ResourceRegistry } from './registries/resource.registry';
import type { RefineModuleOptions } from './interfaces/refine-module-options.interface';
import type {
  RefineModuleAsyncOptions,
  RefineOptionsFactory,
} from './interfaces/refine-module-async-options.interface';
import {
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

/**
 * Refine Module
 *
 * Provides resource registry and provider services for managing Refine
 * through dependency injection.
 *
 * Note: Resources are managed separately via RefineModule.forFeature()
 *
 * @example
 * ```typescript
 * import { Module } from "@abdokouta/ts-container";
 * import { RefineModule, defineConfig } from "@abdokouta/react-refine";
 *
 * @Module({
 *   imports: [
 *     RefineModule.forRoot(defineConfig({
 *       options: {
 *         mutationMode: 'optimistic',
 *       },
 *     }))
 *   ]
 * })
 * export class AppModule {}
 * ```
 */
@Module({})
// biome-ignore lint/complexity/noStaticOnlyClass: Module pattern requires static methods
export class RefineModule {
  /**
   * Register Refine with synchronous configuration
   *
   * Note: Resources should be registered using RefineModule.forFeature() in feature modules.
   *
   * @param options - Configuration options including providers and options
   * @returns Module configuration
   *
   * @example
   * ```typescript
   * RefineModule.forRoot({
   *   dataProvider: simpleRestDataProvider('https://api.example.com'),
   *   authProvider: myAuthProvider,
   *   options: {
   *     mutationMode: 'optimistic',
   *   },
   * })
   * ```
   */
  static forRoot(options: RefineModuleOptions = {}) {
    const providers = this.createProviders(options);

    return {
      module: RefineModule,
      global: options.isGlobal ?? true,
      providers,
      exports: [
        ResourceRegistry,
        REFINE_CONFIG,
        REFINE_DATA_PROVIDER,
        REFINE_AUTH_PROVIDER,
        REFINE_ACCESS_CONTROL_PROVIDER,
        REFINE_LIVE_PROVIDER,
        REFINE_NOTIFICATION_PROVIDER,
        REFINE_I18N_PROVIDER,
        REFINE_AUDIT_LOG_PROVIDER,
        REFINE_OPTIONS,
      ].filter(Boolean),
    };
  }

  /**
   * Register Refine with asynchronous configuration
   *
   * Note: Resources should be registered using RefineModule.forFeature() in feature modules.
   *
   * @param options - Asynchronous configuration options
   * @returns Module configuration
   *
   * @example
   * Using factory:
   * ```typescript
   * RefineModule.forRootAsync({
   *   useFactory: async (config: ConfigService) => ({
   *     dataProvider: createDataProvider(config.get('API_URL')),
   *   }),
   *   inject: [ConfigService],
   * })
   * ```
   *
   * @example
   * Using class:
   * ```typescript
   * RefineModule.forRootAsync({
   *   useClass: RefineConfigService,
   * })
   * ```
   */
  static forRootAsync(options: RefineModuleAsyncOptions) {
    const providers = this.createAsyncProviders(options);

    return {
      module: RefineModule,
      global: options.isGlobal ?? true,
      imports: options.imports || [],
      providers,
      exports: [
        ResourceRegistry,
        REFINE_CONFIG,
        REFINE_DATA_PROVIDER,
        REFINE_AUTH_PROVIDER,
        REFINE_ACCESS_CONTROL_PROVIDER,
        REFINE_LIVE_PROVIDER,
        REFINE_NOTIFICATION_PROVIDER,
        REFINE_I18N_PROVIDER,
        REFINE_AUDIT_LOG_PROVIDER,
        REFINE_OPTIONS,
      ].filter(Boolean),
    };
  }

  /**
   * Register feature resources
   *
   * @param resources - Array of resource configurations
   * @returns Module configuration
   *
   * @example
   * ```typescript
   * @Module({
   *   imports: [
   *     RefineModule.forFeature([
   *       { name: 'posts', list: '/posts' },
   *       { name: 'comments', list: '/comments', meta: { parent: 'posts' } },
   *     ]),
   *   ],
   * })
   * export class BlogModule {}
   * ```
   */
  static forFeature(resources: IResourceItem[]) {
    return {
      module: RefineModule,
      providers: [
        {
          provide: 'RESOURCE_FEATURE_' + Date.now(),
          useFactory: (registry: ResourceRegistry) => {
            resources.forEach((resource) => {
              if (registry.has(resource.name)) {
                registry.update(resource.name, resource);
              } else {
                registry.register(resource);
              }
            });
            return resources;
          },
          inject: [ResourceRegistry],
        },
      ],
    };
  }

  /**
   * Register feature resources asynchronously
   *
   * @param options - Asynchronous configuration options
   * @returns Module configuration
   */
  static forFeatureAsync(options: {
    useFactory: (...args: any[]) => Promise<IResourceItem[]> | IResourceItem[];
    inject?: any[];
  }) {
    return {
      module: RefineModule,
      providers: [
        {
          provide: 'RESOURCE_FEATURE_ASYNC_' + Date.now(),
          useFactory: async (...args: any[]) => {
            const resources = await options.useFactory(...args);
            const registry = args[args.length - 1] as ResourceRegistry;

            resources.forEach((resource) => {
              if (registry.has(resource.name)) {
                registry.update(resource.name, resource);
              } else {
                registry.register(resource);
              }
            });

            return resources;
          },
          inject: [...(options.inject || []), ResourceRegistry],
        },
      ],
    };
  }

  /**
   * Creates providers for synchronous configuration
   * @private
   */
  private static createProviders(options: RefineModuleOptions): any[] {
    const providers: any[] = [];

    // Config provider
    providers.push({
      provide: REFINE_CONFIG,
      useValue: options,
    });

    // Resource registry provider (empty, resources added via forFeature)
    providers.push({
      provide: ResourceRegistry,
      useFactory: () => new ResourceRegistry(),
    });

    // Data provider
    if (options.dataProvider) {
      providers.push({
        provide: REFINE_DATA_PROVIDER,
        useValue: options.dataProvider,
      });
    }

    // Auth provider
    if (options.authProvider) {
      providers.push({
        provide: REFINE_AUTH_PROVIDER,
        useValue: options.authProvider,
      });
    }

    // Access control provider
    if (options.accessControlProvider) {
      providers.push({
        provide: REFINE_ACCESS_CONTROL_PROVIDER,
        useValue: options.accessControlProvider,
      });
    }

    // Live provider
    if (options.liveProvider) {
      providers.push({
        provide: REFINE_LIVE_PROVIDER,
        useValue: options.liveProvider,
      });
    }

    // Notification provider
    if (options.notificationProvider) {
      providers.push({
        provide: REFINE_NOTIFICATION_PROVIDER,
        useValue: options.notificationProvider,
      });
    }

    // i18n provider
    if (options.i18nProvider) {
      providers.push({
        provide: REFINE_I18N_PROVIDER,
        useValue: options.i18nProvider,
      });
    }

    // Audit log provider
    if (options.auditLogProvider) {
      providers.push({
        provide: REFINE_AUDIT_LOG_PROVIDER,
        useValue: options.auditLogProvider,
      });
    }

    // Options
    if (options.options) {
      providers.push({
        provide: REFINE_OPTIONS,
        useValue: options.options,
      });
    }

    return providers;
  }

  /**
   * Creates providers for asynchronous configuration
   * @private
   */
  private static createAsyncProviders(options: RefineModuleAsyncOptions): any[] {
    const providers: any[] = [];

    if (options.useFactory) {
      // Factory-based configuration
      providers.push({
        provide: REFINE_CONFIG,
        useFactory: options.useFactory,
        inject: options.inject || [],
      });

      // Resource registry provider (empty, resources added via forFeature)
      providers.push({
        provide: ResourceRegistry,
        useFactory: () => new ResourceRegistry(),
      });

      // Provider factories
      this.addAsyncProviderFactories(providers);
    } else if (options.useClass) {
      // Class-based configuration
      providers.push({
        provide: options.useClass,
        useClass: options.useClass,
      });

      providers.push({
        provide: REFINE_CONFIG,
        useFactory: async (factory: RefineOptionsFactory) => {
          return factory.createRefineOptions();
        },
        inject: [options.useClass],
      });

      // Resource registry provider (empty, resources added via forFeature)
      providers.push({
        provide: ResourceRegistry,
        useFactory: () => new ResourceRegistry(),
      });

      this.addAsyncProviderFactories(providers);
    } else if (options.useExisting) {
      // Existing provider configuration
      providers.push({
        provide: REFINE_CONFIG,
        useFactory: async (factory: RefineOptionsFactory) => {
          return factory.createRefineOptions();
        },
        inject: [options.useExisting],
      });

      // Resource registry provider (empty, resources added via forFeature)
      providers.push({
        provide: ResourceRegistry,
        useFactory: () => new ResourceRegistry(),
      });

      this.addAsyncProviderFactories(providers);
    } else {
      throw new Error(
        'Invalid async configuration. Must provide useFactory, useClass, or useExisting.'
      );
    }

    return providers;
  }

  /**
   * Adds provider factories for async configuration
   * @private
   */
  private static addAsyncProviderFactories(providers: any[]): void {
    // Data provider
    providers.push({
      provide: REFINE_DATA_PROVIDER,
      useFactory: (config: RefineModuleOptions) => config.dataProvider,
      inject: [REFINE_CONFIG],
    });

    // Auth provider
    providers.push({
      provide: REFINE_AUTH_PROVIDER,
      useFactory: (config: RefineModuleOptions) => config.authProvider,
      inject: [REFINE_CONFIG],
    });

    // Access control provider
    providers.push({
      provide: REFINE_ACCESS_CONTROL_PROVIDER,
      useFactory: (config: RefineModuleOptions) => config.accessControlProvider,
      inject: [REFINE_CONFIG],
    });

    // Live provider
    providers.push({
      provide: REFINE_LIVE_PROVIDER,
      useFactory: (config: RefineModuleOptions) => config.liveProvider,
      inject: [REFINE_CONFIG],
    });

    // Notification provider
    providers.push({
      provide: REFINE_NOTIFICATION_PROVIDER,
      useFactory: (config: RefineModuleOptions) => config.notificationProvider,
      inject: [REFINE_CONFIG],
    });

    // i18n provider
    providers.push({
      provide: REFINE_I18N_PROVIDER,
      useFactory: (config: RefineModuleOptions) => config.i18nProvider,
      inject: [REFINE_CONFIG],
    });

    // Audit log provider
    providers.push({
      provide: REFINE_AUDIT_LOG_PROVIDER,
      useFactory: (config: RefineModuleOptions) => config.auditLogProvider,
      inject: [REFINE_CONFIG],
    });

    // Options
    providers.push({
      provide: REFINE_OPTIONS,
      useFactory: (config: RefineModuleOptions) => config.options,
      inject: [REFINE_CONFIG],
    });
  }
}
