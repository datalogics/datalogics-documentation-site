/**
 * Replacement for useContentHelpers from Nuxt Content v2
 * Nuxt Content v3 removed this composable, so we implement the helpers ourselves
 */

interface NavigationItem {
  path?: string; // Nuxt Content v3: ._path is now .path
  [key: string]: any;
}

/**
 * Find a navigation item by path and return a specific key value
 */
export function navKeyFromPath(
  path: string,
  key: string,
  navigation: NavigationItem[] | null | undefined
): any {
  if (!navigation || !Array.isArray(navigation)) {
    return {};
  }

  function findInNavigation(items: NavigationItem[]): NavigationItem | null {
    for (const item of items) {
      // Nuxt Content v3: ._path is now .path
      if (item.path === path) {
        return item;
      }
      if (item.children && Array.isArray(item.children)) {
        const found = findInNavigation(item.children);
        if (found) return found;
      }
    }
    return null;
  }

  const found = findInNavigation(navigation);
  return found?.[key] || undefined;
}

/**
 * Find a navigation directory (children) by path
 */
export function navDirFromPath(
  path: string,
  navigation: NavigationItem[] | null | undefined
): NavigationItem[] | null {
  if (!navigation || !Array.isArray(navigation)) {
    return null;
  }

  function findInNavigation(items: NavigationItem[]): NavigationItem | null {
    for (const item of items) {
      // Nuxt Content v3: ._path is now .path
      if (item.path === path) {
        return item;
      }
      if (item.children && Array.isArray(item.children)) {
        const found = findInNavigation(item.children);
        if (found) return found;
      }
    }
    return null;
  }

  const found = findInNavigation(navigation);
  return found?.children || null;
}

/**
 * Composable that provides the helper functions
 * This replaces useContentHelpers() from Nuxt Content v2
 */
export function useContentHelpers() {
  return {
    navKeyFromPath,
    navDirFromPath,
  };
}
