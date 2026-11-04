import type { APIRoute } from 'astro';
import { site } from '../content/site';

/*
 * One page to list: the landing. The legacy privacy, support and terms pages
 * stay linked from the footer. Written by hand instead of @astrojs/sitemap,
 * so there's no extra dependency.
 */
const pages = ['/'];

export const GET: APIRoute = () => {
  const urls = pages.map((path) => `  <url><loc>${new URL(path, site.url).href}</loc></url>`);
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
