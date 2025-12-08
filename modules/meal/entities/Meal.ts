import { MealType, RecipeMeal } from "$generated/client";

export type Meal = {
  id: string;
  mealType: MealType;
  recipeMeals: RecipeMeal[];
};
