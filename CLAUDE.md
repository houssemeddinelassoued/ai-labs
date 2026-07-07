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
| `quiz-security.html` | Évaluation sécurité IA : 28 scénarios (QCM + réponses libres) | `risk-*` (rouge/orange/violet/bleu/vert) |
| `ia-explained.html` | « Aller plus loin » : deck de 12 slides interactives (fondamentaux 1-4, usages avancés 5-8, IA en pratique 9-11) | bleu/violet |

Navigation : `index.html` est le seul hub ; chaque page a un lien retour vers lui. Le bouton « Terminer » d'`ia-explained.html` redirige vers `index.html`. Règle visuelle : **une couleur par parcours sur tout le site** (vert = EcoTrack, ambre = ZeroGaspillage, orange = PM, indigo/ambre = Product Owner, rouge = sécurité, bleu/violet = démos IA).

## Patterns à respecter impérativement

- **Données pédagogiques en tableau JS** en tête du `<script>` de chaque page (`courseData`, `quizData`, `modulesData`). Tout ajout de contenu = ajout d'un objet au tableau, jamais de refonte du DOM. Structure d'un module : `{ id, icon, target, title, subtitle, intro, labs[] }` ; structure d'un lab : `{ id, title, targetBadge, tools[], objective, astuce?, prompt }` (prompt en template literal avec `\n`).
- **Multi-outils** : `tools` est un tableau de noms d'outils au choix (rendu en badges multiples ; fallback legacy `toolBadge` accepté). Les jeux courants sont dans la constante `OUTILS` (chat / ide / ui / nocode) définie avant `courseData` sur les deux pages parcours. Principe de la formation : **les outils et stacks sont des exemples, jamais des exigences**.
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

- **Verrou sécurité** : géré **uniquement dans le hub** (`index.html`) — pas de bouton dupliqué sur `ecotrack.html`/`zerogaspillage.html`. Le hub lit les deux clés de progression et déverrouille la carte Sécurité si L'UN des deux parcours atteint 50 %, via la constante `TOTALS = { ecotrack: 20, zerogaspillage: 42, pm: 10, po: 10 }` — **à synchroniser si on ajoute/retire des labs ou modules**. Seuls `ecotrack` et `zerogaspillage` comptent pour le déverrouillage sécurité ; `pm` et `po` alimentent uniquement leur propre barre de progression sur le hub. Le verrou est incitatif : `quiz-security.html` reste accessible par URL directe (assumé).

## Conventions de contenu

- Tout en français, ton pédagogique, emojis dans les titres et badges.
- Un lab = objectif + astuce (encadré ambre « Impact Métier / Tech ») + prompt prêt à copier, structuré « Agis comme [rôle]… » + contexte projet + tâche + format de sortie attendu.
- Cibles des modules : `"Tech"`, `"Biz"` (et `"Mixte"` sur ZeroGaspillage uniquement).
- Fichiers de config d'agents nommés `*.agent.md`, compétences `*.skill.md` (conventions citées dans les prompts).

## Vérification (pas de tests automatisés)

- Servir localement : `python -m http.server 8000` (équivalent GitHub Pages) ; tester aussi en `file://` (double-clic) car les apprenants ouvrent souvent les fichiers directement.
- Scénarios : navigation hub ↔ toutes les pages sans 404 ; cocher un lab → recharger → progression persistée ; donut Chart.js à jour ; déverrouillage sécurité à 50 % (sur le hub) ; deck IA complet (compteur, dots, « Terminer » → hub) ; responsive mobile (sidebar off-canvas via `toggleSidebar()`).
- Seeder la progression en console, ex. : `localStorage.setItem('ecoTrackProgress_v2', JSON.stringify(["lab1_1","lab2_1","lab2_2","lab2_3","lab3_1","lab3_2","lab3_3","lab4_1","lab5_1","lab5_2"]))` (10/20 = 50 %).
- **CI/CD** : `.github/workflows/ci-cd.yml` valide (`node .github/scripts/validate-site.js` — syntaxe JS inline + liens internes) avant tout déploiement GitHub Pages. Lancer ce script avant de pousser ; un lien cassé ou un script invalide bloque le déploiement.

## Pièges connus

- La copie de prompt utilise `document.execCommand('copy')` **volontairement** (compat `file://` où `navigator.clipboard` est indisponible) — ne pas « moderniser ».
- Chart.js n'est chargé que sur les pages parcours (donut de progression), pas sur le hub ni le quiz.
- Le quiz sécurité n'a **pas de persistance** localStorage (état en mémoire, voulu simple).
- Les dossiers `data/`, `js/`, `modules/`, `styles/` sont des emplacements réservés aux livrables des apprenants (vides, non versionnés par git).
- `gestionnaires-projet-ia.html` : `QUIZ_UNLOCK_THRESHOLD = 5` (déverrouillage à 5 modules) alors que le texte à l'écran annonce les 10 — écart connu.
