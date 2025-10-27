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
bash
npm install
npm run dev

## Endpoints (v0.1 - Sprint 1)

### Recettes 
- []  `GET /recipes` - Liste des recettes

  **Query Parameters:**
    - `category` (string) - Filtrer par catégorie (entrée, plat, dessert)
    - `diet` (string) - Filtrer par régime alimentaire (végétarien, vegan, sans-gluten, etc.)
    - `ingredients` (string) - IDs d'ingrédients séparés par virgules
    - `search` (string) - Recherche par mot-clé dans le titre
- []  `GET /recipes/{id}` - Liste des détails d'une recette
- []  `DELETE /recipes/{id}` - Supprimer une recette
- []  `PUT /recipes/{id}` - Modifier une recette
- []  `POST /recipes` - Ajouter une recette

  **Query Parameters:**
    - `title` - Titre de la recette
    - `description` - Description de la recette
    - `category` - Catégorie de la recette
    - `ingredients` - Ingrédients de la recette
    - `diet` - Régime lié (compatible) à la recette
    - `image` (optionnel) - Image de la recette
- []  `GET /recipes/{id}/search?ingredients=...` - Recherche une recette avec des ingrédients

### Menus
- []  `GET /menu?filters=...` - Rechercher un menu celon ses critères

### Ingrédients
- []  `GET /ingredients?ingredients=...` - Recupérer les caractéristiques d'un ou plusieurs ingredients
- []  `GET /ingredients` - Recuperer tout les ingrédients

  **Query Parameters:**
    - `category` (string) - Filtre par catégorie
    - `search` (string) - Recherche par nom
- []  `GET /ingredients/{id}` - Recuperer un ingrédients
- []  `GET /ingredients/search?name=...` - Recuperer un ingrédient par nom
- []  `POST /ingredients` - Créer un nouvel ingrédient
- []  `PUT /ingredients/{id}` - Modifier un ingrédient
- []  `DELETE /ingredients/{id}` - Supprimer un ingrédient
