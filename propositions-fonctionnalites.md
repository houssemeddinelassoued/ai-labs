# Propositions de nouvelles fonctionnalités

Le site propose déjà plusieurs parcours pédagogiques, des quiz, des démos interactives, le suivi de progression et un accès formateur pour FrigoMalin. Les idées ci-dessous visent à compléter ces fonctionnalités tout en conservant le fonctionnement statique du site, sans backend.

## Points de faisabilité vérifiés

- Les données et les clés de progression varient selon les pages : certains parcours enregistrent des labs, d’autres des modules ou des réponses de quiz. Une nouvelle fonctionnalité ne doit donc pas supposer un format de progression unique.
- Les pages sont autonomes et utilisent plusieurs structures pédagogiques (`courseData`, `modulesData` et le format spécifique de FrigoMalin). Un pilote limité est préférable à une refonte commune.
- Les données enregistrées dans le navigateur ne sont pas synchronisées entre appareils. `localStorage` peut aussi être indisponible ou se comporter différemment selon le navigateur et l’ouverture en `file://`.
- Les codes d’accès présents dans le JavaScript ne protègent pas des données confidentielles. Le mode formateur doit rester un verrou pédagogique, pas un contrôle de sécurité.

## 1. Portfolio de formation exportable

Permettre aux apprenants d’ajouter des notes ou des liens vers leurs livrables au fil des labs, puis d’exporter leur parcours en PDF ou en fichier JSON.

**Intérêt :** transformer le suivi de vérification en un rapport de compétences que le développeur ou l’apprenant peut consulter et partager.

**Effort estimé :** moyen pour un parcours pilote ; élevé pour couvrir tous les parcours.

**Étapes à réaliser :**

1. Cadrer un MVP sur EcoTrack (20 labs) : livrables, notes courtes, liens et état des labs, sans chercher à agréger tous les parcours dès le départ.
2. Définir un format JSON versionné avec un identifiant de parcours et de lab. Lire la progression existante sans renommer ni modifier ses clés.
3. Créer une nouvelle clé de stockage versionnée pour les éléments du portfolio, avec gestion des données absentes, invalides ou d’un stockage indisponible.
4. Ajouter dans EcoTrack les champs de notes et de liens, avec une sauvegarde explicite ou automatique clairement signalée.
5. Ajouter l’export JSON et l’import JSON avec validation du format et aperçu avant intégration ; l’import ne doit pas écraser la progression existante.
6. Créer une vue imprimable sobre, enregistrable en PDF via le navigateur, sans ajouter de bibliothèque PDF.
7. Vérifier la persistance après rechargement, l’aller-retour export/import, les données invalides, l’impression, le mobile et l’ouverture en `file://`.

## 2. Diagnostic de départ et parcours conseillé

Poser quelques questions sur le rôle, l’expérience et le temps disponible, puis suggérer un parcours ou un ordre de passage adapté.

**Intérêt :** aider les participants à choisir parmi les nombreux parcours déjà disponibles.

**Effort estimé :** moyen.

**Étapes à réaliser :**

1. Choisir les questions de diagnostic : rôle, niveau, objectifs de formation et temps disponible.
2. Écrire une table de décision simple reliant les réponses aux parcours existants ; éviter une recommandation opaque ou un calcul de score inutile.
3. Créer un questionnaire court sur le hub, avec navigation clavier, affichage mobile et possibilité de passer le diagnostic.
4. Afficher une ou deux recommandations, expliquer les critères retenus et proposer des liens vers les pages concernées. Ne créer des liens vers un module précis que si la navigation de la page le permet réellement.
5. Permettre de recommencer le diagnostic ; ne pas conserver les réponses par défaut.
6. Tester des profils représentatifs, les réponses incomplètes et les liens produits.

## 3. Mode formateur pour tout le site

Rassembler les corrigés, les durées indicatives, les consignes d’animation et les points de discussion dans un mode formateur accessible sur l’ensemble des parcours.

**Intérêt :** faciliter la préparation et l’animation des sessions, au-delà du parcours FrigoMalin.

**Effort estimé :** élevé, car les parcours et leurs contenus ne partagent pas tous la même structure.

**Étapes à réaliser :**

1. Inventorier les corrigés et consignes déjà disponibles, parcours par parcours, et repérer les contenus qui ne doivent pas être exposés aux apprenants.
2. Définir un format de ressources formateur minimal : durée, préparation, animation, corrigé et questions de débrief, en distinguant labs et modules avec quiz.
3. Prototyper sur un seul parcours avant toute généralisation ; conserver les structures de page existantes au lieu de supposer un modèle de données commun.
4. Réutiliser le principe d’accès incitatif existant, sans y placer de secret ni de donnée sensible, et documenter clairement cette limite.
5. Ajouter une activation et une désactivation visibles ; choisir explicitement si l’état ne dure que jusqu’à la fermeture de l’onglet.
6. Étendre page par page après validation du pilote et contrôle du contenu effectivement révélé.
7. Tester mode apprenant/formateur, rechargement, session, clavier, mobile et navigation de chaque parcours couvert.

## 4. Notes et auto-évaluation par lab

Permettre à l’apprenant de noter ce qu’il a compris, ce qu’il souhaite revoir et la qualité de son livrable. Les informations peuvent être enregistrées localement dans le navigateur.

**Intérêt :** encourager la réflexion après chaque exercice sans nécessiter de compte ni de serveur.

**Effort estimé :** faible à moyen si les données sont intégrées au portfolio ; moyen si cette fonctionnalité est développée seule sur tous les parcours.

**Étapes à réaliser :**

1. Distinguer l’auto-évaluation des notes de livrable du portfolio : confiance, difficulté rencontrée et prochaine action.
2. Réutiliser le modèle de données du portfolio lorsqu’il est disponible, sans enregistrer deux fois les mêmes notes ni créer une seconde progression parallèle.
3. Ajouter le formulaire à la fin d’un lab pilote, puis vérifier qu’il n’interfère pas avec le bouton de complétion.
4. Afficher les éléments marqués « à revoir » et permettre leur modification ou suppression.
5. Expliquer que les réponses restent dans le navigateur et proposer un effacement dédié qui ne supprime pas la progression des labs.
6. Tester sauvegarde, modification, suppression, stockage indisponible et compatibilité avec l’export du portfolio.

## 5. Atelier comparatif d’outils IA

Proposer une même tâche à réaliser avec plusieurs assistants IA, puis une grille pour comparer les résultats selon leur exactitude, leur qualité, leur vérifiabilité et l’effort de reprise nécessaire.

**Intérêt :** développer l’esprit critique et montrer concrètement que les outils peuvent produire des résultats différents.

**Effort estimé :** faible à moyen ; l’atelier peut rester entièrement manuel, sans connexion aux fournisseurs d’IA.

**Étapes à réaliser :**

1. Sélectionner un cas d’usage représentatif des parcours et rédiger une consigne identique pour tous les outils comparés.
2. Fournir des critères observables et, pour évaluer l’exactitude, un corrigé de référence ou des sources vérifiables ; ne pas confondre préférence personnelle et exactitude.
3. Créer une page où l’apprenant colle les résultats obtenus dans les outils de son choix. Ne demander ni compte, ni clé API, ni connexion à un service externe.
4. Permettre de noter chaque résultat et de consigner les preuves, erreurs et corrections ; indiquer de ne pas coller de données confidentielles.
5. Afficher une synthèse comparative et demander à l’apprenant de justifier quel résultat il retiendrait et quelles vérifications restent nécessaires.
6. Tester l’atelier avec plusieurs réponses préparées, y compris une réponse erronée mais convaincante, puis vérifier clavier et mobile.

## Recommandation

Commencer par le **portfolio de formation exportable**, avec EcoTrack comme pilote. Cette version limitée permet de valider la saisie, le stockage et l’échange des données avant d’étendre la fonctionnalité aux parcours qui suivent des formats de progression différents.

## Ordre de réalisation suggéré

1. Réaliser le portfolio pilote EcoTrack : données complémentaires distinctes de la progression existante, export et import JSON validés.
2. Ajouter la vue imprimable et vérifier les cas de stockage indisponible et d’import mal formé.
3. Intégrer l’auto-évaluation au même modèle de données, avec des champs distincts des notes et liens de livrables.
4. Développer le diagnostic et l’atelier comparatif comme deux petits outils indépendants, puis les évaluer avec des utilisateurs.
5. Traiter le mode formateur en dernier : il nécessite un inventaire éditorial et une adaptation spécifique aux formats des parcours.

Pour chaque modification HTML/JavaScript, lancer `node .github/scripts/validate-site.js`, qui contrôle la syntaxe des scripts inline et les liens internes. Compléter ce contrôle statique par les vérifications manuelles prévues dans `CLAUDE.md` : navigation, persistance, ouverture `file://` et affichage mobile. Ce script ne valide pas le comportement interactif des nouvelles fonctionnalités.
