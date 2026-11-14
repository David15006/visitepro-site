# visitepro-site

Site vitrine statique de VisitePro (https://visitepro.be), publié avec GitHub Pages depuis la branche `main` (racine).

- HTML, CSS et un peu de JavaScript, sans build ni framework.
- Aucun cookie, aucun traceur, aucune ressource tierce.
- Les captures d'écran utilisent uniquement des données de démonstration fictives.

## Aperçu local

```bash
python -m http.server 8080
```

Ouvrez ensuite http://localhost:8080. Les chemins sont absolus (`/assets/...`) : un double-clic sur `index.html` ne suffit pas.

## Contact et formulaire de démo

La section « Demander une démo » affiche l'adresse de contact et un bouton `mailto:` (adresse à renseigner à trois endroits dans `index.html`).

L'ancien formulaire de démo est conservé en local uniquement, dans `_formulaire/` (exclu par `.gitignore`) : le bloc HTML (`formulaire-demo.html`), le script d'envoi (`main-avec-formulaire.js`, réglage `FORM_ENDPOINT`) et la page `merci.html`. Pour le réactiver, remettez le bloc dans `index.html`, le script à la place de `assets/js/main.js`, `merci.html` à la racine, et rétablissez `form-action 'self' mailto:` (ou l'origine du point d'envoi dans `connect-src`) dans la balise `Content-Security-Policy` des pages HTML.

## Mise en ligne

Procédure de mise en ligne conservée en local.
