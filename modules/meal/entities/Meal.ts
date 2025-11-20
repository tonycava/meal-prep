import { MealType, RecipeMeal } from "../../../src/generated/prisma";

export type Meal = {
  id: string;
  mealType: MealType;
  recipeMeals: RecipeMeal[];
};
