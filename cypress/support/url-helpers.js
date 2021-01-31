export function getApplicationUrl() {
  return 'http://localhost:9000/';
}

export function getApiUrl(path) {
  return `${getApplicationUrl()}api/${path}`;
}
