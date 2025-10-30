import { CreateRecipeDto } from "../dto/createRecipeDto";
import { Recipe } from "../entities/Recipe";

export type IRecipeRepositorySave = {
  save(recipeDto: CreateRecipeDto, apiKey: string): Promise<Recipe>;
}
export type IRecipeRepository = IRecipeRepositorySave;