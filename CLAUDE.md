# CLAUDE.md

Guide pour Claude Code sur ce dépôt. Contenu de formation **entièrement en français**.

## Vue d'ensemble

Site statique de formation « Boostez vos performances avec l'IA » : un cahier de TP autour de projets fil conducteur fictifs. **Aucun build, aucun framework, aucun package.json** — chaque page HTML est autonome (Tailwind CSS via CDN + JS vanilla embarqué en fin de page). Déployé sur GitHub Pages : https://houssemeddinelassoued.github.io/ai-labs/

## Carte des pages

| Page | Rôle | Palette |
|---|---|---|
| `index.html` | Page d'accueil (hub) : introduit la formation, cartes vers les parcours, la sécurité et les démos | toutes (cartes) |
| `ecotrack.html` | Projet 1 — EcoTrack (SaaS B2B carbone, stack Microsoft) : 10 modules / 20 labs | `eco` (vert) + `biz` (indigo) |
| `zerogaspillage.html` | Projet 2 — ZeroGaspillage (anti-gaspillage alimentaire, stack de référence FastAPI/React) : 15 modules / 42 labs, SDLC complet | `zg` (ambre) + `biz` + `mix` (teal) |
| `gestionnaires-projet-ia.html` | Parcours PM : 10 modules + quiz 8 QCM (contexte fictif « GreenPulse Solutions »), complémentaire d'EcoTrack | `pm` (orange) + `ops` (cyan) |
| `product-owner-ia.html` | Parcours Product Owner : 10 modules + quiz 8 QCM (comprendre l'IA, opportunités, cadrage, user stories IA, gouvernance), complémentaire de ZeroGaspillage | `biz` (indigo) + `zg` (ambre) |
| `oddo-bhf.html` | Parcours NextPortfolio — Oddo BHF Tunisie (portail banque privée : KYC/LCB-FT, valorisation & reporting patrimonial, dashboard) : 12 modules / 27 labs, stack .NET avancée / SDLC agentique (outil principal : GitHub Copilot) | `odc` (bleu marine) + `gold` (or) |
| `frigomalin.html` | Parcours FrigoMalin — maîtriser GitHub Copilot (appli anti-gaspi du foyer, PWA 100 % navigateur publiée sur GitHub Pages, sans backend ni Docker) : 11 modules / 33 labs (29 essentiels + 4 bonus : 1.3, 4.2, 8.1, 9.3), 80 % dev / 20 % PO & archi. Pédagogie « pas de prompt à copier » + accès formateur | `fm` (fuchsia) + `biz` + `mix` |
| `quiz-security.html` | Évaluation sécurité IA : 28 scénarios (QCM + réponses libres) | `risk-*` (rouge/orange/violet/bleu/vert) |
| `ia-explained.html` | « Aller plus loin » : deck de 12 slides interactives (fondamentaux 1-4, usages avancés 5-8, IA en pratique 9-11) | bleu/violet |

Navigation : `index.html` est le seul hub ; chaque page a un lien retour vers lui. Le bouton « Terminer » d'`ia-explained.html` redirige vers `index.html`. Règle visuelle : **une couleur par parcours sur tout le site** (vert = EcoTrack, ambre = ZeroGaspillage, orange = PM, indigo/ambre = Product Owner, bleu marine/or = NextPortfolio/Oddo BHF, fuchsia = FrigoMalin, rouge = sécurité, bleu/violet = démos IA).

## Patterns à respecter impérativement

- **Données pédagogiques en tableau JS** en tête du `<script>` de chaque page (`courseData`, `quizData`, `modulesData`). Tout ajout de contenu = ajout d'un objet au tableau, jamais de refonte du DOM. Structure d'un module : `{ id, icon, target, title, subtitle, intro, labs[] }` ; structure d'un lab : `{ id, title, targetBadge, tools[], objective, astuce?, prompt }` (prompt en template literal avec `\n`).
- **Multi-outils** : `tools` est un tableau de noms d'outils au choix (rendu en badges multiples ; fallback legacy `toolBadge` accepté). Les jeux courants sont dans la constante `OUTILS` (chat / ide / ui / nocode) définie avant `courseData` sur les deux pages parcours. Principe de la formation : **les outils et stacks sont des exemples, jamais des exigences**.
- **Structure spécifique à `frigomalin.html`** (aucun prompt complet visible par l'apprenant) : un lab = `{ id, title, bonus?, emplacement?, targetBadge, tools[], features[], objective, astuce, defi, consigne, amorce, indices[], reussite[], solution, correction[] }` (`emplacement` = où créer le(s) fichier(s), affiché « 📁 Où créer le fichier ? » ; règle : tout vit dans le dépôt, jamais dans le profil VS Code). `defi` ∈ clés de la constante `DEFIS` (`trous`, `construire`, `ameliorer`, `inverse`, `squelette`). `amorce` = prompt ou fichier incomplet (copiable) ; `indices` révélés un par un ; `solution` (prompt idéal) et `correction` (points clés) ne s'affichent qu'en **mode formateur**. `amorce`/`solution` sont échappés (`escapeHtml`) : écrire `<…>` librement, mais échapper `${` en `\${` dans les template literals. Les autres champs acceptent du HTML (`<code>`, `<strong>`).
- **Accès formateur** (frigomalin.html) : bouton clé discret dans l'en-tête → code `TRAINER_CODE` (`0999`) → corrigés affichés sur la même page, bouton masqué, bandeau « Masquer les corrigés » pour revenir. État en `sessionStorage` (`frigoMalinTrainer_v1`). Verrou **incitatif** : le code et les corrigés restent lisibles dans le source (assumé, comme le verrou sécurité).
- **Rappel « stack libre »** (zerogaspillage.html) : après `courseData`, un post-traitement ajoute `STACK_NOTE` aux prompts des modules 6-13 (sauf labs marqués `noStackNote: true`) — ne pas dupliquer la note dans les prompts eux-mêmes.
- **Notion de « Partie »** : le programme officiel est référencé en Parties (Part 1 → Part 5), jamais en jours — le support sert des formats 3, 4 ou 5 jours (tableau de correspondance dans le README).
- **Rendu dynamique** par `renderSidebar()` / `loadModule()` / template literals.
- **Classes Tailwind toujours littérales et statiques** (CDN Tailwind : pas de purge, mais une classe construite par concaténation partielle comme `bg-${color}-500` ne sera pas générée). Les thèmes passent par un objet `themeStyles` dont les valeurs sont des classes complètes.
- **Palettes custom déclarées dans `tailwind.config` inline** dans le `<head>` de chaque page. Une classe custom non déclarée = élément sans style (symptôme silencieux).
- **localStorage versionné — NE JAMAIS renommer une clé existante** (progression des apprenants en production). Toute rupture de format = nouvelle clé suffixée (`_v3`…).

| Clé | Page | Contenu |
|---|---|---|
| `ecoTrackProgress_v2` | ecotrack.html | tableau des ids de labs complétés (ex. `"lab1_1"`) |
| `zeroGaspiProgress_v1` | zerogaspillage.html | tableau des ids de labs complétés (préfixe `zg_`) |
| `ecoTrackPmProgress_v2` | gestionnaires-projet-ia.html | objet : modules complétés + réponses quiz (`QUIZ_VERSION`) |
| `zeroGaspiPoProgress_v1` | product-owner-ia.html | objet : modules complétés + réponses quiz (`QUIZ_VERSION`) |
| `oddoBhfProgress_v1` | oddo-bhf.html | tableau des ids de labs complétés (préfixe `wl`, ex. `"wl1_1"`) |
| `frigoMalinProgress_v1` | frigomalin.html | tableau des ids de labs complétés (préfixe `fm`, ex. `"fm1_1"`) |
| `hubAccess_v1` | index.html | tableau des parcours déverrouillés par code d'accès (ex. `["ecotrack","frigomalin"]`) |

- **Verrou sécurité** : géré **uniquement dans le hub** (`index.html`) — pas de bouton dupliqué sur `ecotrack.html`/`zerogaspillage.html`. Le hub lit les clés de progression et déverrouille la carte Sécurité si L'UN des deux projets principaux atteint 50 %, via la constante `TOTALS = { ecotrack: 20, zerogaspillage: 42, pm: 10, po: 10, wealthlens: 27, frigomalin: 33 }` — **à synchroniser si on ajoute/retire des labs ou modules**. Seuls `ecotrack` et `zerogaspillage` comptent pour le déverrouillage sécurité ; `pm`, `po`, `wealthlens` (Oddo BHF) et `frigomalin` alimentent uniquement leur propre barre de progression sur le hub. Le verrou est incitatif : `quiz-security.html` reste accessible par URL directe (assumé).
- **Codes d'accès des parcours** (hub uniquement) : chaque carte de parcours (`data-access`) demande un code avant d'ouvrir la page ; une fois saisi, l'accès est mémorisé dans `hubAccess_v1`. Règle : rang alphabétique de l'initiale de chaque mot à majuscule du nom du projet — EcoTrack `520`, ZeroGaspillage `267`, Gestionnaires de Projet `716`, Product Owner `1615`, NextPortfolio `1416`, FrigoMalin `613` (constante `ACCESS` dans `index.html`, à compléter pour tout nouveau parcours). Verrou **incitatif** : codes lisibles dans le source, pages accessibles par URL directe (assumé).

## Conventions de contenu

- Tout en français, ton pédagogique. **Aucun emoji sur le site** : icônes SVG monochromes **Lucide** (licence ISC) embarquées dans chaque page (table `ICONS` dans un `<script>` dédié, placé juste avant le script principal ; seules les icônes utilisées par la page y figurent). La couleur suit le texte (`currentColor`). Les champs `icon` des données (`courseData`, `modulesData`…) contiennent un **nom d'icône** Lucide, pas un emoji.
  - Pages historiques (hub, EcoTrack, ZeroGaspillage, PM, PO, NextPortfolio, quiz, démos) : marqueur **sans guillemets** `<i data-icon=nom class=ico></i>`, utilisable tel quel dans le HTML statique et dans n'importe quelle chaîne JS (simple, double ou template). Un `MutationObserver` remplace les marqueurs, y compris ceux injectés dynamiquement ; la classe `.ico` donne une taille de 1em (l'icône s'adapte à la taille du texte). Ces pages gardent Font Awesome pour leurs icônes `fa-*` existantes.
  - `frigomalin.html` : fonction `icon(nom, classes)` dans les templates + marqueurs `<span data-icon="nom" class="...">` hydratés au chargement ; plus de Font Awesome.
  - Nouvelle icône = copier ses tracés depuis lucide.dev dans le `ICONS` de la page. Le contenu copié par les apprenants (prompts) ne contient ni emoji ni marqueur : du texte seulement.
- Un lab = objectif + astuce (encadré ambre « Impact Métier / Tech ») + prompt prêt à copier, structuré « Agis comme [rôle]… » + contexte projet + tâche + format de sortie attendu.
- Cibles des modules : `"Tech"`, `"Biz"` (et `"Mixte"` sur ZeroGaspillage et FrigoMalin).
- Fichiers de config d'agents nommés `*.agent.md`, compétences `*.skill.md` (conventions citées dans les prompts). Exception : `frigomalin.html` suit les formats officiels actuels de Copilot (`.github/skills/<nom>/SKILL.md`, `.github/hooks/*.json`, `.mcp.json`) — les revérifier avant chaque session, Copilot évolue vite.

## Vérification (pas de tests automatisés)

- Servir localement : `python -m http.server 8000` (équivalent GitHub Pages) ; tester aussi en `file://` (double-clic) car les apprenants ouvrent souvent les fichiers directement.
- Scénarios : navigation hub ↔ toutes les pages sans 404 ; cocher un lab → recharger → progression persistée ; barre de progression à jour ; déverrouillage sécurité à 50 % (sur le hub) ; codes d'accès des parcours sur le hub (mauvais code → erreur, bon code → page ouverte et accès mémorisé) ; deck IA complet (compteur, dots, « Terminer » → hub) ; responsive mobile (sidebar off-canvas via `toggleSidebar()`).
- Seeder la progression en console, ex. : `localStorage.setItem('ecoTrackProgress_v2', JSON.stringify(["lab1_1","lab2_1","lab2_2","lab2_3","lab3_1","lab3_2","lab3_3","lab4_1","lab5_1","lab5_2"]))` (10/20 = 50 %).
- **CI/CD** : `.github/workflows/ci-cd.yml` valide (`node .github/scripts/validate-site.js` — syntaxe JS inline + liens internes) avant tout déploiement GitHub Pages. Lancer ce script avant de pousser ; un lien cassé ou un script invalide bloque le déploiement.

## Pièges connus

- La copie de prompt utilise `document.execCommand('copy')` **volontairement** (compat `file://` où `navigator.clipboard` est indisponible) — ne pas « moderniser ».
- **Plus de Chart.js** : toutes les pages parcours affichent une barre de progression CSS compacte dans la sidebar (`#progress-track` / `#progress-bar` / `#progress-percent` / `#progress-text`, mise à jour dans `updateProgressUI()`), aux couleurs du parcours. Sur `frigomalin.html`, la barre suit le parcours essentiel (labs non bonus).
- Le quiz sécurité n'a **pas de persistance** localStorage (état en mémoire, voulu simple).
- Les dossiers `data/`, `js/`, `modules/`, `styles/` sont des emplacements réservés aux livrables des apprenants (vides, non versionnés par git).
- `gestionnaires-projet-ia.html` : `QUIZ_UNLOCK_THRESHOLD = 5` (déverrouillage à 5 modules) alors que le texte à l'écran annonce les 10 — écart connu.
