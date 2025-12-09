# MealPrep

## Description

MealPrep est un web service permettant à ses utilisateurs de leur fournir tout un système de gestion de recette. Ils pourront alors récupérer une liste de recette suivant certains critères ou bien former un menu pour la semaine ou encore ajouter ses propres recettes.

Bon appétit !

## Stack Technique

- Langage : Node.js en Typescript
- Framework : Express + express zod api
- Base de données : SQlite avec Prisma comme ORM
- Authentification : API Keys
- Déploiement : Docker et Google Cloud

## Installation

```bash

npm install

npm run dev
```

## Seed de la base de données

```bash
npx prisma generate

npx prisma db push

npm run db:seed
```