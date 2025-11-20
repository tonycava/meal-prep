import { IngredientWithQuantityAndUnit } from "../../ingredient/entities/Ingredient";

export interface IIngredientRepositoryGetAllOfRecipe {
  getAllOfRecipe(recipeId: string): Promise<IngredientWithQuantityAndUnit[]>;
}

export type IIngredientRepository = IIngredientRepositoryGetAllOfRecipe;
