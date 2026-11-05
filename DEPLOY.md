# Mise en ligne de visitepro.be sur GitHub Pages

Guide pas à pas pour Windows (PowerShell). Faites les étapes dans l'ordre et ne passez à la suivante que si la vérification est bonne.

Compte GitHub utilisé dans ce guide : `David15006`. Dépôt : `visitepro-site` (public, obligatoire pour GitHub Pages gratuit).

> **Valeurs DNS à confirmer avant saisie.** Les adresses de l'étape 8 sont les valeurs publiées par GitHub, mais elles n'ont pas pu être relues sur la documentation officielle au moment de la rédaction. Ouvrez cette page et comparez avant de les saisir chez votre registrar :
> https://docs.github.com/fr/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

---

## Étape 0 — Outils (une seule fois)

```powershell
winget install --id Git.Git -e
winget install --id GitHub.cli -e
```

Fermez puis rouvrez PowerShell, puis connectez-vous à GitHub :

```powershell
gh auth login
```

Choisissez : GitHub.com → HTTPS → Login with a web browser.

**Vérification**

```powershell
git --version
gh --version
gh auth status
```

`gh auth status` doit afficher « Logged in to github.com account David15006 ».

---

## Étape 1 — Placer le dossier du site

Décompressez l'archive du site dans `C:\visitepro-site`.

**Vérification**

```powershell
cd C:\visitepro-site
Get-ChildItem
```

Vous devez voir notamment `index.html`, `CNAME`, `404.html` et le dossier `assets`.

Avant d'aller plus loin, remplacez tous les `[A COMPLETER]` (voir la section « Avant publication » en bas de ce fichier).

---

## Étape 2 — Créer le dépôt Git local

```powershell
cd C:\visitepro-site
git init -b main
git add .
git commit -m "Site vitrine VisitePro"
```

**Vérification**

```powershell
git log --oneline
git status
```

Vous devez voir un commit et « nothing to commit, working tree clean ».

---

## Étape 3 — Créer le dépôt sur GitHub

```powershell
gh repo create visitepro-site --public --source . --remote origin
```

**Vérification**

```powershell
git remote -v
```

Deux lignes `origin  https://github.com/David15006/visitepro-site.git` doivent s'afficher.

---

## Étape 4 — Premier envoi (push)

```powershell
git push -u origin main
```

**Vérification**

```powershell
gh repo view David15006/visitepro-site --web
```

La page du dépôt s'ouvre dans le navigateur et liste vos fichiers.

---

## Étape 5 — Vérifier le domaine dans votre compte GitHub (recommandé)

Cette étape empêche quelqu'un d'autre d'utiliser visitepro.be sur GitHub Pages.

1. GitHub → photo de profil → **Settings** → **Pages** (menu de gauche, section « Code, planning, and automation »).
2. **Add a domain** → saisissez `visitepro.be` → **Add domain**.
3. GitHub affiche un enregistrement **TXT** à créer (nom du type `_github-pages-challenge-David15006`, plus une valeur). Créez-le chez votre registrar.
4. Revenez sur la page et cliquez **Verify** (cela peut demander quelques minutes, parfois plus).

**Vérification** : le domaine apparaît avec le statut « Verified ».

---

## Étape 6 — Activer GitHub Pages (branche main, racine)

Dans le navigateur : dépôt `visitepro-site` → **Settings** → **Pages** → **Build and deployment** :

- **Source** : Deploy from a branch
- **Branch** : `main`, dossier `/ (root)` → **Save**

**Vérification** (après 1 à 2 minutes)

```powershell
gh api repos/David15006/visitepro-site/pages --jq ".status, .cname, .html_url"
gh api repos/David15006/visitepro-site/pages/builds/latest --jq ".status"
```

Le second résultat doit être `built`.

---

## Étape 7 — Domaine personnalisé

Toujours dans **Settings** → **Pages** → **Custom domain** : le champ doit afficher `visitepro.be` (lu dans le fichier `CNAME`). S'il est vide, saisissez `visitepro.be` puis **Save**.

**Vérification**

```powershell
gh api repos/David15006/visitepro-site/pages --jq ".cname"
```

Résultat attendu : `visitepro.be`.

---

## Étape 8 — DNS chez votre registrar

### 8a. Notez d'abord l'existant

Avant de toucher à quoi que ce soit, faites une capture d'écran de **toute** la zone DNS de visitepro.be chez votre registrar, puis lancez :

```powershell
Resolve-DnsName visitepro.be -Type A -Server 1.1.1.1
Resolve-DnsName visitepro.be -Type MX -Server 1.1.1.1
Resolve-DnsName visitepro.be -Type TXT -Server 1.1.1.1
Resolve-DnsName visitepro.be -Type CAA -Server 1.1.1.1
Resolve-DnsName www.visitepro.be -Server 1.1.1.1
Resolve-DnsName test.visitepro.be -Server 1.1.1.1
```

Gardez ce résultat : il sert à vérifier à l'étape 9 que rien d'autre n'a changé.

### 8b. Ce qu'il ne faut PAS modifier ni supprimer

- tous les enregistrements de **test.visitepro.be** ;
- tous les autres **sous-domaines** existants ;
- les **MX** (réception des emails) ;
- les **TXT** existants (SPF, DKIM, DMARC, vérifications diverses) ;
- les **NS** et **SOA**.

### 8c. Ce qu'il faut ajouter ou remplacer

Vous ne touchez **qu'à la racine (@) et à www**.

Racine `visitepro.be` (nom `@` ou vide selon le registrar) : supprimez **uniquement** les éventuels enregistrements A, AAAA, ALIAS ou CNAME de `@` qui pointent ailleurs, puis créez :

| Type | Nom | Valeur |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| AAAA | @ | 2606:50c0:8000::153 |
| AAAA | @ | 2606:50c0:8001::153 |
| AAAA | @ | 2606:50c0:8002::153 |
| AAAA | @ | 2606:50c0:8003::153 |

Sous-domaine `www` : remplacez l'éventuel enregistrement existant de `www` par :

| Type | Nom | Valeur |
|---|---|---|
| CNAME | www | david15006.github.io. |

Selon le registrar, le point final de la valeur CNAME est ajouté automatiquement ou doit être omis.

Points d'attention :
- **N'utilisez pas d'enregistrement générique `*`** (wildcard) pointant vers GitHub.
- **CAA** : si la zone contient des enregistrements CAA, ils doivent autoriser `letsencrypt.org`. Sinon, le certificat HTTPS ne pourra pas être émis. S'il n'y a aucun CAA, ne faites rien.

---

## Étape 9 — Vérifier les DNS

La propagation peut prendre de quelques minutes à quelques heures.

```powershell
Resolve-DnsName visitepro.be -Type A -Server 1.1.1.1
Resolve-DnsName visitepro.be -Type AAAA -Server 1.1.1.1
Resolve-DnsName www.visitepro.be -Server 1.1.1.1
Resolve-DnsName test.visitepro.be -Server 1.1.1.1
Resolve-DnsName visitepro.be -Type MX -Server 1.1.1.1
```

Résultats attendus :
- **A** : les 4 adresses `185.199.10x.153` ;
- **AAAA** : les 4 adresses `2606:50c0:800x::153` ;
- **www** : CNAME vers `david15006.github.io` ;
- **test** et **MX** : **identiques** à ce que vous avez noté à l'étape 8a.

Dans **Settings** → **Pages**, le message « DNS check successful » doit apparaître.

---

## Étape 10 — Activer « Enforce HTTPS »

Une fois le DNS validé, GitHub émet un certificat. Cela peut prendre un moment : tant que la case est grisée, attendez puis rechargez la page.

**Settings** → **Pages** → cochez **Enforce HTTPS**.

Ou en ligne de commande :

```powershell
gh api -X PUT repos/David15006/visitepro-site/pages -F https_enforced=true
```

**Vérification**

```powershell
curl.exe -sI http://visitepro.be | Select-String "HTTP/|Location"
curl.exe -sI https://www.visitepro.be | Select-String "HTTP/|Location"
curl.exe -sI https://visitepro.be | Select-String "HTTP/"
```

Résultats attendus :
- les deux premières commandes renvoient une redirection (301) vers `https://visitepro.be/` ;
- la dernière renvoie `HTTP/1.1 200` ou `HTTP/2 200`.

Ouvrez ensuite https://visitepro.be dans un navigateur : le cadenas doit apparaître.

---

## Mettre à jour le site plus tard

```powershell
cd C:\visitepro-site
git add .
git commit -m "Description de la modification"
git push
```

**Vérification** : `gh api repos/David15006/visitepro-site/pages/builds/latest --jq ".status"` renvoie `built`, puis rechargez le site (Ctrl+F5).

---

## Avant publication : éléments à compléter

Pour lister tous les champs restant à remplir :

```powershell
Select-String -Path C:\visitepro-site\*.html -Pattern "A COMPLETER"
```

Le dépôt est **public** : n'y ajoutez jamais de mot de passe, de clé, de fichier `.env`, de note interne ni de capture contenant de vraies données.
