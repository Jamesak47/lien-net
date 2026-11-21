const trackingNames = new Set([
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'utm_id', 'utm_source_platform', 'utm_creative_format', 'utm_marketing_tactic',
  'fbclid', 'gclid', 'dclid', 'msclkid', 'ttclid', 'igshid', 'mc_cid', 'mc_eid',
]);

const signatureNames = new Set([
  'signature', 'sig', 'hmac', 'hash', 'token', 'access_token',
  'x-amz-signature', 'x-goog-signature', 'policy', 'key-pair-id',
]);

export function cleanUrl(input) {
  const original = input.trim();
  const parsed = new URL(original);
  if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password) {
    throw new Error('Saisis une adresse HTTP ou HTTPS sans identifiants.');
  }

  const hashIndex = original.indexOf('#');
  const beforeHash = hashIndex === -1 ? original : original.slice(0, hashIndex);
  const fragment = hashIndex === -1 ? '' : original.slice(hashIndex);
  const queryIndex = beforeHash.indexOf('?');
  if (queryIndex === -1) return { url: original, removed: 0 };

  // Preserve the original encoding of all retained parameters.
  const entries = beforeHash.slice(queryIndex + 1).split('&').map((raw) => {
    const key = raw.split('=', 1)[0];
    const name = new URLSearchParams(`key=${key}`).get('key').toLowerCase();
    return { raw, name };
  });
  if (entries.some(({ name }) => signatureNames.has(name))) {
    return { url: original, removed: 0, protected: true };
  }

  const kept = entries.filter(({ name }) => !trackingNames.has(name));
  const removed = entries.length - kept.length;
  if (!removed) return { url: original, removed };

  const query = kept.map(({ raw }) => raw).join('&');
  const address = beforeHash.slice(0, queryIndex);
  return { url: address + (query ? `?${query}` : '') + fragment, removed };
}
