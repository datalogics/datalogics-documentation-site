interface BreadcrumbItem {
  title: string;
  href: string;
}

export function useBreadcrumb(url: string): BreadcrumbItem[] {
  // Nuxt Content v3: use queryCollectionNavigation instead of useContent()
  const { data: navigation } = useAsyncData('navigation', () => {
    return queryCollectionNavigation('content');
  });

  const breadcrumbItems: BreadcrumbItem[] = [];
  // Remove empty segments
  const segments = url.split('/').filter(segment => segment !== '');
  
  // Construct breadcrumb for each segment
  let href = '';
  let nav = navigation.value || [];
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i].replace('.html', '');
    href += `/${segment}`;
    // Nuxt Content v3: ._path is now .path
    const page = nav.find((x: any) => (x.path as string) === href);
    nav = page?.children || [];
    breadcrumbItems.push({ title: page?.title ?? segment, href });
  }
  return breadcrumbItems;
}
