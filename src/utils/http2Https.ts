export const http2Https = (url: string) => {
  if (url.startsWith('http://')) {
    url = url.replace('http://', 'https://');
  }
  return url;
}