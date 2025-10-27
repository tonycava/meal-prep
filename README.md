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

## Endpoints (v0.1 - Sprint 1)

- []  `GET /recipes` - Liste des recettes
- []  `GET /recipes/{id}` - Liste des détails d'une recette
- []  `DELETE /recipes/{id}` - Supprimer une recette
- []  `PUT /recipes/{id}` - Modifier une recette
- []  `POST /recipes/{id}` - Ajouter une recette
- []  `GET /recipes/{id}/search?ingredients=...` - Recherche une recette avec des ingrédients

- []  `GET /menu?filters=...` - Rechercher un menu celon ses critères
- 
- []  `GET /ingredients?ingredients=...` - Recupérer les caractéristiques d'un ou plusieurs ingredients
- []  `GET /ingredients` - Recuperer tout les ingrédients
- []  `GET /ingredients/{id}` - Recuperer un ingrédients
- []  `GET /ingredients/search?name=...` - Recuperer un ingrédient par nom

- []  `GET /cartegories` - Recuperer toutes les catégories
- 

