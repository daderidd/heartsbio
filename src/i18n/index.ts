/**
 * Minimal i18n helpers.
 *
 * English is the default language and lives at the site root (/products/).
 * Dutch mirrors every page under /nl/ (/nl/products/). Page slugs are shared
 * between languages so switching language only adds or removes the prefix.
 *
 * Components read the language from the URL with getLang(Astro.url), so no
 * prop needs to be threaded through every section. React islands receive it
 * as a `lang` prop.
 */

export const languages = { en: 'English', nl: 'Nederlands' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'en';

/** BCP 47 locale used for number and date formatting. */
export const locales: Record<Lang, string> = { en: 'en-US', nl: 'nl-NL' };

/** Open Graph locale codes. */
export const ogLocales: Record<Lang, string> = { en: 'en_US', nl: 'nl_NL' };

export function getLang(url: URL): Lang {
  return url.pathname === '/nl' || url.pathname.startsWith('/nl/') ? 'nl' : 'en';
}

/** Strip the language prefix: /nl/products/ -> /products/ */
function stripLang(pathname: string): string {
  if (pathname === '/nl' || pathname === '/nl/') return '/';
  return pathname.startsWith('/nl/') ? pathname.slice(3) : pathname;
}

/**
 * Turn an internal link into the localized URL Netlify serves directly.
 * Adds a trailing slash to page paths (Netlify 301s /products -> /products/).
 *   localizePath('/products', 'nl')        -> '/nl/products/'
 *   localizePath('/products#fitazim', 'nl') -> '/nl/products/#fitazim'
 *   localizePath('/#contact', 'en')         -> '/#contact'
 */
export function localizePath(path: string, lang: Lang): string {
  const hashIndex = path.indexOf('#');
  let pathname = hashIndex === -1 ? path : path.slice(0, hashIndex);
  const hash = hashIndex === -1 ? '' : path.slice(hashIndex);

  if (pathname === '') pathname = '/';
  if (!pathname.endsWith('/')) pathname += '/';
  const prefixed = lang === defaultLang ? pathname : `/${lang}${pathname}`;
  return prefixed + hash;
}

/** The same page in another language. */
export function switchLangPath(url: URL, target: Lang): string {
  return localizePath(stripLang(url.pathname), target);
}

/** True on the homepage of either language. */
export function isHome(url: URL): boolean {
  return stripLang(url.pathname) === '/';
}
