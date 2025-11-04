import { CreateRecipeDto } from "../dto/createRecipeDto";
import { Recipe } from "../entities/Recipe";
import { DeleteRecipeDto } from "$modules/recipe/dto/deleteRecipeDto.ts";
import { IRecipeFilters, ListRecipesOutput } from "../dto/recipeDto";

export type IRecipeRepositorySave = {
  save(recipeDto: CreateRecipeDto, apiKey: string): Promise<Recipe>;
}

export type IRecipeRepositoryList = {
      list(limit: number, offset: number, filters: IRecipeFilters): Promise<ListRecipesOutput>;
}

export type IRecipeRepositoryDelete = {
  delete(recipeDto: DeleteRecipeDto): Promise<void>;
}

export type IRecipeRepository =
  IRecipeRepositorySave &
  IRecipeRepositoryDelete &
  IRecipeRepositoryList;
