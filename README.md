# Lien net

Une extension Chrome qui retire les paramètres publicitaires courants avant de copier un lien. Elle préremplit l’adresse de l’onglet actif et accepte aussi un lien collé.

`https://example.org/article?utm_source=newsletter&page=2#avis` devient `https://example.org/article?page=2#avis`.

## Installer sur Chrome

1. Dans Chrome, ouvre `chrome://extensions`.
2. Active **Mode développeur**.
3. Clique sur **Charger l’extension non empaquetée** et sélectionne le dossier `extension`.
4. Ouvre **Lien net** depuis le menu Extensions. Clique sur **Nettoyer et copier**.

## Fonctionnement

Le nettoyage s’effectue dans la fenêtre de l’extension. Aucun lien n’est envoyé à un serveur. L’extension utilise `activeTab` pour lire l’adresse de l’onglet à l’ouverture et écrit dans le presse-papiers après un clic.

La liste des paramètres retirés est définie dans `extension/clean-url.mjs`. Les autres paramètres conservent leur encodage et leur ordre. Les liens comportant un nom de paramètre de signature ou d’accès connu sont copiés tels quels. La détection couvre une liste de noms courants.

## Vérifier le nettoyage

Depuis le dossier du projet, exécute `node --test` avec Node.js.
