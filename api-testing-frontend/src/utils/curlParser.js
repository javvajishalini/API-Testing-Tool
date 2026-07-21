/**
 * Parses a cURL command string into an object containing method, url, headers, and body.
 * @param {string} curlString 
 * @returns {{ method: string, url: string, headers: Array<{id: string, key: string, value: string, isActive: boolean}>, body: string }}
 */
export function parseCurl(curlString) {
  if (!curlString || typeof curlString !== 'string') {
    throw new Error('Invalid cURL command string');
  }

  // Normalize multi-line cURL backslashes
  const cleaned = curlString.replace(/\\\n/g, ' ').replace(/\\\r\n/g, ' ').trim();

  let method = 'GET';
  let url = '';
  const headers = [];
  let body = '';

  // Extract URL (first standalone non-option argument or after --url)
  const urlMatch = cleaned.match(/(?:--url\s+['"]?|curl\s+['"]?)(https?:\/\/[^\s'"]+|\{\{[^}]+\}\}[^\s'"]*)/i) ||
                   cleaned.match(/curl\s+['"]?([^\s'"]+)['"]?/i);
  if (urlMatch) {
    url = urlMatch[1].replace(/['"]/g, '');
  }

  // Extract Method
  const methodMatch = cleaned.match(/(?:-X|--request)\s+([A-Z]+)/i);
  if (methodMatch) {
    method = methodMatch[1].toUpperCase();
  } else if (cleaned.includes('--data') || cleaned.includes('--data-raw') || cleaned.includes('-d ') || cleaned.includes('--data-binary')) {
    method = 'POST';
  }

  // Extract Headers (-H "Key: Value" or --header "Key: Value")
  const headerRegex = /(?:-H|--header)\s+['"]([^'"]+)['"]/gi;
  let headerMatch;
  let headerId = 1;
  while ((headerMatch = headerRegex.exec(cleaned)) !== null) {
    const headerStr = headerMatch[1];
    const colonIdx = headerStr.indexOf(':');
    if (colonIdx !== -1) {
      const key = headerStr.slice(0, colonIdx).trim();
      const value = headerStr.slice(colonIdx + 1).trim();
      headers.push({
        id: crypto.randomUUID ? crypto.randomUUID() : String(headerId++),
        key,
        value,
        isActive: true
      });
    }
  }

  // Extract Body (--data, --data-raw, -d, --data-binary)
  const dataRegex = /(?:--data|--data-raw|--data-binary|-d)\s+(['"])([\s\S]*?)\1/i;
  const dataMatch = cleaned.match(dataRegex);
  if (dataMatch) {
    body = dataMatch[2];
  } else {
    // Fallback unquoted data match
    const unquotedMatch = cleaned.match(/(?:--data|--data-raw|-d)\s+([^\s]+)/i);
    if (unquotedMatch) {
      body = unquotedMatch[1];
    }
  }

  return {
    method,
    url: url || 'https://api.example.com',
    headers: headers.length ? headers : [{ id: crypto.randomUUID ? crypto.randomUUID() : '1', key: 'Content-Type', value: 'application/json', isActive: true }],
    body
  };
}
