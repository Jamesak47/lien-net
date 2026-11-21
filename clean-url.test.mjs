import assert from 'node:assert/strict';
import test from 'node:test';
import { cleanUrl } from './extension/clean-url.mjs';

test('retire les doublons et préserve les paramètres utiles et le fragment', () => {
  assert.deepEqual(
    cleanUrl('https://example.org/a?%75tm_source=a&q=un%20deux&FBCLID=x&utm_source=b&q=+&ref=menu#avis'),
    { url: 'https://example.org/a?q=un%20deux&q=+&ref=menu#avis', removed: 3 },
  );
});

test('retire la query quand elle contient uniquement des paramètres publicitaires', () => {
  assert.deepEqual(
    cleanUrl('https://example.org/?gclid=abc#avis'),
    { url: 'https://example.org/#avis', removed: 1 },
  );
});

test('conserve un lien signé et ses paramètres à l’identique', () => {
  const url = 'https://example.org/?X-Amz-Signature=abc&utm_source=mail';
  assert.deepEqual(cleanUrl(url), { url, removed: 0, protected: true });
});

test('conserve le lien quand aucun paramètre connu ne correspond', () => {
  const url = 'https://example.org/?utm_custom=42&q=%20#?utm_source=x';
  assert.deepEqual(cleanUrl(url), { url, removed: 0 });
});

test('refuse les pages internes, les entrées invalides et les URL avec identifiants', () => {
  for (const input of ['chrome://extensions', 'page', 'https://user:pass@example.org/']) {
    assert.throws(() => cleanUrl(input));
  }
});
