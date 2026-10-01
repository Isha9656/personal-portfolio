const samplePortfolioAsset = /(?:^|\/)images\/portfolio\/(?:portfolio[1-6](?:_lg)?\.jpg|portfolio_crop\.jpg|crop_production_prediction\.png)(?:$|[?#])/i;

export const isVerifiedProjectImage = (url) => Boolean(url) && !samplePortfolioAsset.test(url);

export const isProjectRepository = (url) => /^https:\/\/github\.com\/[^/]+\/[^/?#]+\/?$/.test(url || '');

export const updatePageMetadata = ({ title, description, url = window.location.href, image }) => {
  document.title = title;
  const setMeta = (selector, attribute, key, content) => {
    let element = document.head.querySelector(`${selector}[${attribute}="${key}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attribute, key);
      document.head.appendChild(element);
    }
    element.content = content;
  };
  setMeta('meta', 'name', 'description', description);
  setMeta('meta', 'property', 'og:title', title);
  setMeta('meta', 'property', 'og:description', description);
  setMeta('meta', 'property', 'og:url', url);
  if (image) setMeta('meta', 'property', 'og:image', image);
  setMeta('meta', 'name', 'twitter:title', title);
  setMeta('meta', 'name', 'twitter:description', description);
  if (image) setMeta('meta', 'name', 'twitter:image', image);
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = url;
};
