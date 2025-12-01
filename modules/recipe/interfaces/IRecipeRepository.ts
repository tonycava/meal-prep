import { CreateRecipeDto } from "../dto/createRecipeDto";
import { RecipeWithIngredients } from "../entities/Recipe";
import { DeleteRecipeDto } from "$modules/recipe/dto/deleteRecipeDto";
import { UpdateRecipeDto } from "$modules/recipe/dto/updateRecipeDto";

import { WithPagination } from "$lib/common/types/WithPagination";
import { IRecipeFilters } from "$modules/recipe/utils/IRecipeFilters";

export type IRecipeRepositorySave = {
  save(recipeDto: CreateRecipeDto): Promise<RecipeWithIngredients>;
};

export type IRecipeRepositoryList = {
  list(
    limit: number,
    offset: number,
    filters: IRecipeFilters,
  ): Promise<WithPagination<RecipeWithIngredients[], "recipes">>;
};

export type IRecipeRepositoryFindById = {
  findById(id: string): Promise<RecipeWithIngredients | null>;
};

export type IRecipeRepositoryDelete = {
  delete(recipeDto: DeleteRecipeDto): Promise<void>;
};

export type IRecipeRepositoryUpdate = {
  update(recipeDto: UpdateRecipeDto): Promise<RecipeWithIngredients | null>;
};

export type IRecipeRepositoryIsUseInOneMenu = {
  isUseInOneMenu(recipeId: string): Promise<boolean>;
};

export type IRecipeRepository = IRecipeRepositorySave &
  IRecipeRepositoryDelete &
  IRecipeRepositoryList &
  IRecipeRepositoryUpdate &
  IRecipeRepositoryFindById &
  IRecipeRepositoryIsUseInOneMenu;
