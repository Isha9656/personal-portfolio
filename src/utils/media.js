export const isPdfAsset = (value = '') => {
  if (typeof value !== 'string' || !value) return false;
  if (value.startsWith('data:application/pdf')) return true;

  try {
    const url = new URL(value, window.location.origin);
    const decodedPath = decodeURIComponent(url.pathname).toLowerCase();
    return decodedPath.endsWith('.pdf');
  } catch {
    return value.split(/[?#]/, 1)[0].toLowerCase().endsWith('.pdf');
  }
};
