import { CreateRecipeDto } from "../dto/createRecipeDto";
import { RecipeQueryDto } from "../dto/recipeQueryDto";
import { Recipe } from "../entities/Recipe";

export type IRecipeRepositorySave = {
  save(recipeDto: CreateRecipeDto, apiKey: string): Promise<Recipe>;
}

export type IRecipeRepositoryList = {
      list(queryDto: RecipeQueryDto): Promise<{ data: Recipe[]; total: number }>;
}

export type IRecipeRepository = IRecipeRepositorySave & IRecipeRepositoryList;