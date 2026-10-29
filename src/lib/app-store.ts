import { site } from '../content/site';

/**
 * Where an App Store link sits on the page. Each one becomes an App Store
 * campaign name, so downloads can be attributed without tracking visitors.
 */
export type AppStoreCampaign =
  'hero' | 'nav' | 'sticky-bar' | 'pricing-free' | 'pricing-full' | 'download';

/** [TODO phase 6: provider token from App Store Connect] */
const providerToken: string | null = null;

/** The one builder for every link to the App Store. */
export function appStoreUrl(campaign: AppStoreCampaign): string {
  if (providerToken === null) return site.appStore.url;

  const url = new URL(site.appStore.url);
  url.searchParams.set('pt', providerToken);
  url.searchParams.set('ct', campaign);
  url.searchParams.set('mt', '8');
  return url.href;
}
