import path from "path";
import { DependsOnMethod, Routing, ServeStatic } from "express-zod-api";
import { ListRecipesEndpoint } from "../modules/recipe/endpoints/ListRecipe.ts";
import { ListRecipeByIdEndpoint } from "../modules/recipe/endpoints/ListRecipeById.ts";
import { CreateRecipeEndPoint } from "$modules/recipe/endpoints/CreateRecipe.ts";
import { UpdateRecipeEndpoint } from "$modules/recipe/endpoints/UpdateRecipe.ts";
import { DeleteRecipeEndPoint } from "$modules/recipe/endpoints/DeleteRecipe.ts";
import { ListMenusEndpoint } from "$modules/menu/endpoints/ListMenus.ts";
import { CreateMenuEndpoint } from "$modules/menu/endpoints/CreateMenu.ts";
import { DeleteMenuEndpoint } from "$modules/menu/endpoints/DeleteMenu.ts"
import { ListIngredientsEndpoint } from "$modules/ingredient/endpoints/ListIngredient";
import { CreateIngredientEndpoint } from "$modules/ingredient/endpoints/CreateIngredient";
import { DeleteIngredientEndpoint } from "$modules/ingredient/endpoints/DeleteIngredient";
import { PatchIngredientEndpoint } from "$modules/ingredient/endpoints/PatchIngredient";
import { GetIngredientByIdEndpoint } from "$modules/ingredient/endpoints/GetIngredientByIdEndpoint";
import { RegisterApiKeyEndpoint } from "$modules/apikey/endpoints/RegisterApiKey";
import { ListMealsEndpoint } from "$modules/meal/endpoints/ListMeals";
import { CreateMealEndpoint } from "$modules/meal/endpoints/CreateMeal";
import { GetMealByIdEndpoint } from "$modules/meal/endpoints/GetMealById";
import { UpdateMealEndpoint } from "$modules/meal/endpoints/UpdateMeal";
import { DeleteMealEndpoint } from "$modules/meal/endpoints/DeleteMeal";
import { HomeEndpoint } from "$lib/common/endpoints/HomeEndpoint.ts";
import { UpdateMenuEndpoint } from "$modules/menu/endpoints/UpdateMenu.ts";
import { GenerateMenuEndpoint } from "$modules/menu/endpoints/GenerateMenu.ts";

export const routing: Routing = {
	v1: {
		"/": HomeEndpoint,
		recipes: {
			"/": new DependsOnMethod({
				get: ListRecipesEndpoint,
				post: CreateRecipeEndPoint,
			}),
			"/:id": new DependsOnMethod({
				get: ListRecipeByIdEndpoint,
				patch: UpdateRecipeEndpoint,
				delete: DeleteRecipeEndPoint,
			}),
		},
		menus: {
			"/": new DependsOnMethod({
				get: ListMenusEndpoint,
				post: CreateMenuEndpoint,
			}),
			generate: new DependsOnMethod({
				get: GenerateMenuEndpoint,
			}),
			"/:id": new DependsOnMethod({
				patch: UpdateMenuEndpoint,
				delete: DeleteMenuEndpoint
			})
		},
		ingredients: {
			"/": new DependsOnMethod({
				get: ListIngredientsEndpoint,
				post: CreateIngredientEndpoint,
			}),
			"/:id": new DependsOnMethod({
				get: GetIngredientByIdEndpoint,
				patch: PatchIngredientEndpoint,
				delete: DeleteIngredientEndpoint,
			}),
		},
		meals: {
			"/": new DependsOnMethod({
				get: ListMealsEndpoint,
				post: CreateMealEndpoint,
			}),
			"/:id": new DependsOnMethod({
				get: GetMealByIdEndpoint,
				put: UpdateMealEndpoint,
				delete: DeleteMealEndpoint,
			})
		},
		"api-keys": {
			register: new DependsOnMethod({
				post: RegisterApiKeyEndpoint,
			}),
		},
	},
	public: new ServeStatic(path.join(__dirname, "../assets"), {
		dotfiles: "deny",
		index: false,
		redirect: false,
	}),
};
