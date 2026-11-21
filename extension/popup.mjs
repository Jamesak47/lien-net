import { cleanUrl } from './clean-url.mjs';

const form = document.querySelector('#clean-form');
const original = document.querySelector('#original');
const copy = document.querySelector('#copy');
const status = document.querySelector('#status');
const result = document.querySelector('#result');
const cleaned = document.querySelector('#cleaned');

original.addEventListener('input', () => {
  result.hidden = true;
  status.textContent = '';
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  let output;
  try {
    output = cleanUrl(original.value);
  } catch {
    status.textContent = 'Saisis une adresse HTTP ou HTTPS sans identifiants.';
    return;
  }

  cleaned.value = output.url;
  result.hidden = false;
  copy.disabled = true;
  original.readOnly = true;
  try {
    await navigator.clipboard.writeText(output.url);
    if (output.protected) {
      status.textContent = 'Lien copié tel quel. Il contient un paramètre de signature ou d’accès.';
    } else if (output.removed === 0) {
      status.textContent = 'Lien copié. Aucun paramètre publicitaire reconnu.';
    } else {
      status.textContent = `Lien copié. Paramètres retirés : ${output.removed}.`;
    }
  } catch {
    status.textContent = 'Copie automatique indisponible. Copie le résultat avec Ctrl+C.';
    cleaned.focus();
    cleaned.select();
  } finally {
    copy.disabled = false;
    original.readOnly = false;
  }
});

try {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!original.value && /^https?:\/\//i.test(tab?.url ?? '')) original.value = tab.url;
} catch {
  // The form still accepts pasted links if the active tab is unavailable.
}
