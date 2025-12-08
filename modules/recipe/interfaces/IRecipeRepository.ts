import { CreateRecipeDto } from "../dto/createRecipeDto";
import { Recipe, RecipeWithIngredients } from "../entities/Recipe";
import { DeleteRecipeDto } from "$modules/recipe/dto/deleteRecipeDto.ts";
import { UpdateRecipeDto, UpdateRecipeOutput } from "$modules/recipe/dto/updateRecipeDto.ts";
import {
	GetRecipeByIdOutput,
	IRecipeFilters,
	ListRecipesOutput,
} from "../dto/recipeDto";

export type IRecipeRepositorySave = {
	save(recipeDto: CreateRecipeDto): Promise<Recipe>;
};

export type IRecipeRepositoryList = {
	list(
		limit: number,
		offset: number,
		filters: IRecipeFilters,
	): Promise<ListRecipesOutput>;
};

export type IRecipeRepositoryFindById = {
	findById(recipeId: string): Promise<RecipeWithIngredients>;
};

export type IRecipeRepositoryDelete = {
	delete(recipeDto: DeleteRecipeDto): Promise<boolean>;
};

export type IRecipeRepositoryUpdate = {
	update(recipeDto: UpdateRecipeDto): Promise<UpdateRecipeOutput>;
};

export type IRecipeRepositoryIsUseInOneMenu = {
	isUseInOneMenu(recipeId: string): Promise<boolean>;
};

export type IRecipeRepositoryIsOwnedByUser = {
  isOwnedByUser(recipeId: string): Promise<boolean>;
};

export type IRecipeRepositoryExist = {
  exist(recipeId: string): Promise<boolean>;
}

export type IRecipeRepository = IRecipeRepositorySave &
	IRecipeRepositoryDelete &
	IRecipeRepositoryList &
	IRecipeRepositoryUpdate &
	IRecipeRepositoryFindById &
	IRecipeRepositoryIsUseInOneMenu &
  IRecipeRepositoryIsOwnedByUser &
  IRecipeRepositoryExist;
