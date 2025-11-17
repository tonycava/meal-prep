/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ApiKey" (
    "key" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "Menu" (
    "id_menu" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    CONSTRAINT "Menu_key_fkey" FOREIGN KEY ("key") REFERENCES "ApiKey" ("key") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Recipe" (
    "id_recipe" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ingredients" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "prepTimeMin" INTEGER,
    "cookTimeMin" INTEGER,
    "is_public" BOOLEAN NOT NULL,
    "key" TEXT NOT NULL,
    "category" TEXT,
    "diet" TEXT,
    CONSTRAINT "Recipe_key_fkey" FOREIGN KEY ("key") REFERENCES "ApiKey" ("key") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "id_ingredient" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "proteins" REAL NOT NULL,
    "fats" REAL NOT NULL,
    "carbs" REAL NOT NULL,
    "sugars" REAL NOT NULL,
    "salt" REAL NOT NULL,
    "fiber" REAL NOT NULL,
    "caloriesPerUnit" REAL NOT NULL,
    "category" TEXT,
    "mineralName" TEXT,
    "mineralValue" REAL,
    "vitaminName" TEXT,
    "vitaminValue" REAL
);

-- CreateTable
CREATE TABLE "MenuItem" (
    "id_menu_item" TEXT NOT NULL PRIMARY KEY,
    "position_" INTEGER NOT NULL,
    "mealType" TEXT,
    "id_recipe" TEXT NOT NULL,
    "id_menu" TEXT NOT NULL,
    CONSTRAINT "MenuItem_id_recipe_fkey" FOREIGN KEY ("id_recipe") REFERENCES "Recipe" ("id_recipe") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MenuItem_id_menu_fkey" FOREIGN KEY ("id_menu") REFERENCES "Menu" ("id_menu") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RecipeStep" (
    "id_recipe_step" TEXT NOT NULL PRIMARY KEY,
    "position_" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "durationMin" INTEGER,
    "id_recipe" TEXT NOT NULL,
    CONSTRAINT "RecipeStep_id_recipe_fkey" FOREIGN KEY ("id_recipe") REFERENCES "Recipe" ("id_recipe") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RecipeIngredient" (
    "id_recipe" TEXT NOT NULL,
    "id_ingredient" TEXT NOT NULL,
    "quantity" REAL NOT NULL,

    PRIMARY KEY ("id_recipe", "id_ingredient"),
    CONSTRAINT "RecipeIngredient_id_recipe_fkey" FOREIGN KEY ("id_recipe") REFERENCES "Recipe" ("id_recipe") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RecipeIngredient_id_ingredient_fkey" FOREIGN KEY ("id_ingredient") REFERENCES "Ingredient" ("id_ingredient") ON DELETE RESTRICT ON UPDATE CASCADE
);
