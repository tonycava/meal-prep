import { CreateRecipeDto } from "../dto/createRecipeDto";
import { Recipe } from "../entities/Recipe";
import { DeleteRecipeDto } from "$modules/recipe/dto/deleteRecipeDto.ts";
import { UpdateRecipeDto } from "$modules/recipe/dto/updateRecipeDto.ts";

export type IRecipeRepositorySave = {
  save(recipeDto: CreateRecipeDto, apiKey: string): Promise<Recipe>;
}

export type IRecipeRepositoryDelete = {
  delete(recipeDto: DeleteRecipeDto): Promise<void>;
}

export type IRecipeRepositoryUpdate = {
  update(recipeDto: UpdateRecipeDto): Promise<void>;
}

export type IRecipeRepository =
  IRecipeRepositorySave &
  IRecipeRepositoryUpdate &
  IRecipeRepositoryDelete