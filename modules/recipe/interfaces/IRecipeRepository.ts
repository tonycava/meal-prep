import { CreateRecipeDto } from "../dto/createRecipeDto";
import { RecipeQueryDto } from "../dto/recipeQueryDto";
import { Recipe } from "../entities/Recipe";
import { DeleteRecipeDto } from "$modules/recipe/dto/deleteRecipeDto.ts";

export type IRecipeRepositorySave = {
  save(recipeDto: CreateRecipeDto, apiKey: string): Promise<Recipe>;
}

export type IRecipeRepositoryList = {
      list(queryDto: RecipeQueryDto): Promise<{ data: Recipe[]; total: number }>;
}

export type IRecipeRepositoryDelete = {
  delete(recipeDto: DeleteRecipeDto): Promise<void>;
}

export type IRecipeRepository =
  IRecipeRepositorySave &
  IRecipeRepositoryDelete &
  IRecipeRepositoryList;
