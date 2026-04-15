/**
 * Resource Registry Service
 *
 * Manages Refine resources with a centralized registry pattern.
 * Similar to ThemeRegistry, provides methods to register, retrieve, and manage resources.
 *
 * @example
 * ```typescript
 * import { ResourceRegistry } from '@refinedev/core';
 *
 * const registry = new ResourceRegistry();
 *
 * // Register a resource
 * registry.register({
 *   name: 'posts',
 *   list: '/posts',
 *   create: '/posts/create',
 *   edit: '/posts/edit/:id',
 *   show: '/posts/show/:id',
 *   meta: {
 *     label: 'Posts',
 *     icon: <PostIcon />,
 *   },
 * });
 *
 * // Get all resources
 * const resources = registry.getAll();
 *
 * // Get resource by name
 * const postsResource = registry.get('posts');
 * ```
 */

import { Injectable } from '@abdokouta/ts-container';
import type { IResourceItem } from '@refinedev/core';

/**
 * Extended resource item with parentName support
 */
export interface ExtendedResourceItem extends IResourceItem {
  parentName?: string;
}

@Injectable()
export class ResourceRegistry {
  private resources: Map<string, ExtendedResourceItem> = new Map();

  /**
   * Register a new resource
   *
   * @param resource - Resource configuration
   * @throws Error if resource with the same name already exists
   *
   * @example
   * ```typescript
   * registry.register({
   *   name: 'posts',
   *   list: '/posts',
   *   create: '/posts/create',
   *   edit: '/posts/edit/:id',
   *   show: '/posts/show/:id',
   *   meta: {
   *     label: 'Posts',
   *     icon: <PostIcon />,
   *     canDelete: true,
   *   },
   * });
   * ```
   */
  register(resource: ExtendedResourceItem): void {
    if (this.resources.has(resource.name)) {
      throw new Error(
        `Resource with name "${resource.name}" is already registered. Use update() to modify existing resources.`
      );
    }

    this.resources.set(resource.name, resource);
  }

  /**
   * Register multiple resources at once
   *
   * @param resources - Array of resource configurations
   *
   * @example
   * ```typescript
   * registry.registerMany([
   *   { name: 'posts', list: '/posts' },
   *   { name: 'users', list: '/users' },
   *   { name: 'categories', list: '/categories' },
   * ]);
   * ```
   */
  registerMany(resources: ExtendedResourceItem[]): void {
    resources.forEach((resource) => this.register(resource));
  }

  /**
   * Update an existing resource
   *
   * @param name - Resource name
   * @param updates - Partial resource configuration to update
   * @throws Error if resource doesn't exist
   *
   * @example
   * ```typescript
   * registry.update('posts', {
   *   meta: {
   *     label: 'Blog Posts',
   *     canDelete: false,
   *   },
   * });
   * ```
   */
  update(name: string, updates: Partial<ExtendedResourceItem>): void {
    const existing = this.resources.get(name);
    if (!existing) {
      throw new Error(
        `Resource with name "${name}" not found. Use register() to add new resources.`
      );
    }

    this.resources.set(name, {
      ...existing,
      ...updates,
      meta: {
        ...existing.meta,
        ...updates.meta,
      },
    });
  }

  /**
   * Get a resource by name
   *
   * @param name - Resource name
   * @returns Resource configuration or undefined if not found
   *
   * @example
   * ```typescript
   * const postsResource = registry.get('posts');
   * if (postsResource) {
   *   console.log(postsResource.list); // '/posts'
   * }
   * ```
   */
  get(name: string): ExtendedResourceItem | undefined {
    return this.resources.get(name);
  }

  /**
   * Get all registered resources
   *
   * @returns Array of all resource configurations
   *
   * @example
   * ```typescript
   * const allResources = registry.getAll();
   * console.log(allResources.length); // 3
   * ```
   */
  getAll(): ExtendedResourceItem[] {
    return Array.from(this.resources.values());
  }

  /**
   * Get all resource names
   *
   * @returns Array of resource names
   *
   * @example
   * ```typescript
   * const names = registry.getNames();
   * console.log(names); // ['posts', 'users', 'categories']
   * ```
   */
  getNames(): string[] {
    return Array.from(this.resources.keys());
  }

  /**
   * Check if a resource exists
   *
   * @param name - Resource name
   * @returns True if resource exists, false otherwise
   *
   * @example
   * ```typescript
   * if (registry.has('posts')) {
   *   console.log('Posts resource is registered');
   * }
   * ```
   */
  has(name: string): boolean {
    return this.resources.has(name);
  }

  /**
   * Unregister a resource
   *
   * @param name - Resource name
   * @returns True if resource was removed, false if it didn't exist
   *
   * @example
   * ```typescript
   * registry.unregister('posts');
   * ```
   */
  unregister(name: string): boolean {
    return this.resources.delete(name);
  }

  /**
   * Clear all registered resources
   *
   * @example
   * ```typescript
   * registry.clear();
   * console.log(registry.getAll().length); // 0
   * ```
   */
  clear(): void {
    this.resources.clear();
  }

  /**
   * Get resources by meta property
   *
   * @param key - Meta property key
   * @param value - Meta property value
   * @returns Array of resources matching the criteria
   *
   * @example
   * ```typescript
   * // Get all resources with canDelete: true
   * const deletableResources = registry.getByMeta('canDelete', true);
   * ```
   */
  getByMeta(key: string, value: any): ExtendedResourceItem[] {
    return this.getAll().filter((resource) => resource.meta && resource.meta[key] === value);
  }

  /**
   * Get resources by parent
   *
   * @param parentName - Parent resource name
   * @returns Array of child resources
   *
   * @example
   * ```typescript
   * // Get all resources that are children of 'posts'
   * const postChildren = registry.getByParent('posts');
   * ```
   */
  getByParent(parentName: string): ExtendedResourceItem[] {
    return this.getAll().filter((resource) => resource.parentName === parentName);
  }

  /**
   * Get resource count
   *
   * @returns Number of registered resources
   *
   * @example
   * ```typescript
   * console.log(`Total resources: ${registry.count()}`);
   * ```
   */
  count(): number {
    return this.resources.size;
  }

  /**
   * Export resources as JSON
   *
   * @returns JSON string of all resources
   *
   * @example
   * ```typescript
   * const json = registry.toJSON();
   * localStorage.setItem('resources', json);
   * ```
   */
  toJSON(): string {
    return JSON.stringify(this.getAll(), null, 2);
  }

  /**
   * Import resources from JSON
   *
   * @param json - JSON string of resources
   * @param merge - If true, merge with existing resources; if false, replace all
   *
   * @example
   * ```typescript
   * const json = localStorage.getItem('resources');
   * if (json) {
   *   registry.fromJSON(json, true);
   * }
   * ```
   */
  fromJSON(json: string, merge: boolean = false): void {
    const resources = JSON.parse(json) as IResourceItem[];

    if (!merge) {
      this.clear();
    }

    resources.forEach((resource) => {
      if (merge && this.has(resource.name)) {
        this.update(resource.name, resource);
      } else {
        this.register(resource);
      }
    });
  }
}
