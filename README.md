# #eCROmmerce NextGen

Site statique **pré-rendu** : `build.js` (Node, sans dépendance npm) lit `data/interviews.js` et `data/site.js`, puis génère dans `dist/` des pages HTML complètes. Tout le texte est présent dans le HTML : Google et les robots des IA (GPTBot, ClaudeBot, PerplexityBot…) le lisent sans exécuter de JavaScript. Le JavaScript ne sert qu'à la recherche et aux filtres.

## Arborescence

```
build.js              Générateur (node build.js → dist/)
data/interviews.js    ← les Talents (un objet = une personne + son interview)
data/site.js          ← réglages globaux (URL, WhatsApp, liens, À propos, alias, catégories d'outils)
data/insights.js      ← Insights transversaux (facultatif, vide par défaut)
assets/css/style.css
assets/js/app.js      Recherche + filtres (amélioration progressive)
images/               Mascotte, favicon, image de partage
images/interviews/    Portraits : [slug].webp (ou .jpg)
```

Pages générées dans `dist/` :

```
index.html                   Accueil : Hero → Featured Talents → Meet the Next Gen → Le projet → Join
talents/index.html            Meet the Next Gen : recherche, filtres par expertise, regroupé par Promo
talents/[slug]/index.html     Fiche Talents
inspirations/index.html      Inspirations : People to Follow · Toolbox · Read · Watch · Listen
outils/[slug]/index.html     Une page par outil cité par au moins 2 Talents (réglable : seuilPageOutil)
mur-de-mots/  communaute/  a-propos/  insights/ (si data/insights.js n'est pas vide)
404.html  sitemap.xml  robots.txt  llms.txt
_redirects                   Redirections 301 des anciennes URL (/interviews/… → /talents/…)
```

## Générer le site

```bash
node build.js            # pour la mise en ligne (URLs propres : /interviews/antoine-vera/)
node build.js --local    # pour consulter dist/ en double-cliquant sur dist/index.html
node build.js --strict   # échoue s'il y a un avertissement (pratique avant de publier)
```

Node 18 ou plus. Rien à installer. Le dossier `dist/` est recréé à chaque fois (ne le modifiez pas à la main ; il est ignoré par Git).

## Ajouter un profil (Talents)

1. Ouvrez `data/interviews.js` et copiez le **MODÈLE** commenté en haut du fichier.
2. Collez-le dans la liste `window.INTERVIEWS = [ … ]` (l'ordre n'importe pas : tri par date).
3. Remplissez les champs :
   - obligatoires : `slug`, `nom`, `poste`, `entreprise`, `date` (AAAA-MM-JJ) ;
   - très recommandés : `citation` (phrase réelle, mot pour mot), `expertises`, `intro` (100–150 mots) ;
   - modules facultatifs : `careerPath`, `sujets` (Sur son radar), `methode`, `aRetenir` ;
   - `mentors` (personnes citées) et `ressources` (livres, podcasts, newsletters…) alimentent automatiquement la page Inspirations. Le champ `relation` respecte la nuance de l'interview : `inspired_by`, `follows`, `recommends`, `mentor`, `mentions`. Ne jamais transformer « utilise » ou « cite » en « recommande » ;
   - `titreSection` dans une réponse remplace le titre H2 par défaut (ex. « Comment Léa est arrivée dans le CRO ») ;
   - `featured: true` place la personne en tête de l'accueil ; `numero` fixe son NEXTGEN #XX.
4. Déposez le portrait dans `images/interviews/[slug].webp` (format 4:5, 1600 px de haut conseillé), puis indiquez `photo: "images/interviews/[slug].webp"`. Sans photo, les initiales s'affichent.
   Pour des images responsives, ajoutez `[slug]-480.webp`, `[slug]-960.webp`, `[slug]-1600.webp` : le `srcset` est généré automatiquement.
5. Lancez `node build.js` (ou poussez sur GitHub).

**Règle éditoriale : ne rien inventer.** Citations, outils, usages, méthodes, opinions et takeaways viennent de l'interview. Ce qui est une synthèse NextGen se marque `synthese: true` et s'affiche comme tel.

Avant la mise en production : `afficherExemples: false` dans `data/site.js` masque les profils d'exemple.

**Vérifier :** `node build.js` affiche un message `[NextGen]` pour chaque champ obligatoire manquant, slug en double, date mal formée, `typeProfil` inconnu ou photo introuvable. Une erreur de syntaxe (virgule, guillemet) est signalée avec le nom du fichier.

Attention aux virgules : chaque interview `{ … }` est suivie d'une virgule, et chaque texte est entre guillemets. Si un texte contient un guillemet `"`, écrivez `\"` ou utilisez « ».

## Modifier le lien WhatsApp, les liens ou les textes

Dans `data/site.js` :

- `whatsapp: "https://chat.whatsapp.com/…"` — lien d'invitation du groupe ;
- `liens.linkedin`, `liens.proposerTalent` — boutons LinkedIn ;
- `apropos` — textes et profil de l'auteur (photo : `apropos.auteur.photo`) ;
- `temoignages` — ne s'affichent qu'à partir de 3 vrais témoignages ;
- `categoriesOutils` — catégorie affichée sous chaque outil (ex. « Experimentation ») ;
- `afficherExemples: false` — masque les interviews marquées `exemple: true`.

## Alias et logos

Pour que « GA4 », « ga4 » et « Google Analytics 4 » comptent comme un seul outil, ajoutez dans `alias` :

```js
"GA4": "Google Analytics",
"google analytics 4": "Google Analytics",
```

La casse est toujours ignorée (« ab tasty » = « AB Tasty »). À droite, le nom officiel affiché.

Pour afficher un logo, ajoutez le nom officiel et son domaine dans `logos` : `"Hotjar": "hotjar.com"`. Sans entrée, les initiales s'affichent.

## Déploiement : GitHub + Cloudflare Pages

1. Créez un dépôt GitHub et envoyez-y **le contenu de ce dossier** (`build.js` à la racine du dépôt).
2. Sur Cloudflare : *Workers & Pages → Create → Pages → Connect to Git*, puis choisissez le dépôt.
3. Réglages de build :
   - **Framework preset** : `None`
   - **Build command** : `node build.js`
   - **Build output directory** : `dist`
   - (facultatif) variable d'environnement `NODE_VERSION` = `20`
4. *Save and Deploy*. Chaque modification poussée sur GitHub régénère et republie le site en une minute environ.

`_redirects` redirige les anciennes adresses (`/interviews/antoine-vera/` → `/talents/antoine-vera/`). `404.html` est servie automatiquement par Cloudflare Pages pour les adresses inconnues.

## Référencement (Google et IA)

- **URL du site** : renseignez `url` dans `data/site.js` (ex. `https://nextgen.ecrommerce.fr`, sans / final). Elle sert aux URL canoniques, au sitemap, aux balises Open Graph, au JSON-LD et à llms.txt. Relancez `node build.js`.
- Chaque page a un `<title>` et une meta description uniques, une URL canonique, des balises Open Graph / Twitter, un seul `<h1>`, des `<h2>` par section et des `alt` sur toutes les images.
- Données structurées : WebSite + Organization (accueil), Article + Person (interviews), Person (À propos), BreadcrumbList (toutes les pages).
- `robots.txt` autorise tous les robots, y compris GPTBot, ClaudeBot, PerplexityBot, Google-Extended et Bingbot.
- Après la mise en ligne, déclarez `https://votre-domaine/sitemap.xml` dans Google Search Console et Bing Webmaster Tools.
- Image de partage par défaut : `images/og-image.png` (1200 × 630). Une interview avec photo utilise sa photo.
