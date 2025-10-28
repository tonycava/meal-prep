# MealPrep

## Description

MealPrep est un web service permettant à ses utilisateurs de leur fournir tout un système de gestion de recette. Ils pourront alors récupérer une liste de recette suivant certains critères ou bien former un menu pour la semaine ou encore ajouter ses propres recettes.

Bon appétit !

## Stack Technique

- Langage : Node.js en Typescript
- Framework : Express
- Base de données : SQlite avec Prisma comme ORM
- Authentification : JWT
- Déploiement : Docker et AWS EC2

- Pour les tests de notre web service, un front sera mis en place avec Svelte.

## Prérequis

- IDE (Visual Studio Code et Webstorm)
- Trello
- Github

## Installation

```bash
npm install

npm run dev
```

## Import des données d'ingrédients

Pour peupler la base de données avec les informations nutritionnelles des ingrédients, suivez ces étapes :

1. Téléchargez le fichier Excel depuis le site Ciqual : [CALNUT2020_2020_07_07.xlsx](https://ciqual.anses.fr/cms/sites/default/files/inline-files/CALNUT2020_2020_07_07.xlsx)

2. Ouvrez le fichier XLSX dans Excel ou LibreOffice et enregistrez-le au format CSV (séparateur : point-virgule `;`).

3. Renommez le fichier en `CALNUT.csv` et placez-le à la racine du projet.

4. Lancez l'import des données :

   ```bash
   npm run import:csv
   ```

   Cette commande insère automatiquement plus de 2000 ingrédients avec leurs valeurs nutritionnelles (protéines, lipides, glucides, calories, minéraux et vitamines) dans la base de données.

## Endpoints (v0.1 - Sprint 1)

### Recettes 
- []  `GET /recipes` - Liste des recettes

  **Query Parameters:**
    - `category` (string) - Filtrer par catégorie (entrée, plat, dessert)
    - `diet` (string) - Filtrer par régime alimentaire (végétarien, vegan, sans-gluten, etc.)
    - `ingredients` (string) - IDs d'ingrédients séparés par virgules
    - `search` (string) - Recherche par mot-clé dans le titre
    - `limit` - Limiter le nombre de réponse retourné
    - `offset` - Pagination
- []  `GET /recipes/{id}` - Liste des détails d'une recette
- []  `DELETE /recipes/{id}` - Supprimer une recette
- []  `PUT /recipes/{id}` - Modifier une recette
- []  `POST /recipes` - Ajouter une recette

  **Body:**
    - `title` - Titre de la recette
    - `description` - Description de la recette
    - `category` - Catégorie de la recette
    - `ingredients` - Ingrédients de la recette
    - `diet` - Régime lié (compatible) à la recette
    - `image` (optionnel) - Image de la recette
- []  `GET /recipes/{id}/search?ingredients=...` - Recherche une recette avec des ingrédients
- []  `GET /recipes/{id}/nutrition` - Récupérer les informations nutritionnelles de la recette

### Menus
- []  `GET /menus/weekly` - Générer un menu pour la semaine

  **Query Parameters:**
    - `mealsPerDay` - Nombre de repas par jour
    - `servings` -  Nombre de personnes
    - `maxBudget` (optionnel) - Buget maximum
- []  `GET /menus/daily` - Générer un menu pour la journée

  **Query Parameters:**
    - `numberOfMeals` - Nombre de repas par jour
    - `servings` -  Nombre de personnes
    - `maxBudget` (optionnel) - Buget maximum
- []  `GET /menus/diet` - Générer un menu selon des critères spécifiques

  **Query Parameters:**
  A voir ensemble
- [] `GET /menus` - Récupérer tous les menus de l'utilisateur
  
  **Query Parameters:**
    - `limit` - Limiter le nombre de réponse retourné
    - `offset` - Pagination
- [] `GET /menus/{id}` - Récupérer les détails d'un menu spécifique
- [] `POST /menus` - Sauvegarder/Créer un menu
  
  **Body:**
    - `nom` - Nom du menu
    - `meals` - Recettes contenu dans le menu
- [] `PUT /menus/{id}` - Modifier un menu spécifique
- [] `DELETE /menus/{id}` - Supprimer un menu specifique

### Ingrédients
- []  `GET /ingredients?ingredients=...` - Recupérer les caractéristiques d'un ou plusieurs ingredients
- []  `GET /ingredients` - Recuperer tout les ingrédients

  **Query Parameters:**
    - `category` (string) - Filtre par catégorie
    - `search` (string) - Recherche par nom
    - `limit` - Limiter le nombre de réponse retourné
    - `offset` - Pagination
- []  `GET /ingredients/{id}` - Recuperer un ingrédients
- []  `GET /ingredients/search?name=...` - Recuperer un ingrédient par nom
- []  `POST /ingredients` - Créer un nouvel ingrédient
- []  `PUT /ingredients/{id}` - Modifier un ingrédient
- []  `DELETE /ingredients/{id}` - Supprimer un ingrédient
