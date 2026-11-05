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

## Formulaire de démo

Le point d'envoi se règle dans `assets/js/main.js` (`FORM_ENDPOINT`). Tant qu'il est vide, le formulaire ouvre la messagerie du visiteur avec la demande pré-remplie.

Si vous ajoutez un point d'envoi, ajoutez aussi son origine dans la directive `connect-src` de la balise `Content-Security-Policy`, dans toutes les pages HTML.

## Mise en ligne

Voir `DEPLOY.md`.
