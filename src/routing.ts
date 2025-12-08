import path from "path";
import { DependsOnMethod, Routing, ServeStatic } from "express-zod-api";
import { ListRecipesEndpoint } from "$modules/recipe/endpoints/ListRecipe";
import { CreateRecipeEndPoint } from "$modules/recipe/endpoints/CreateRecipe";
import { UpdateRecipeEndpoint } from "$modules/recipe/endpoints/UpdateRecipe";
import { DeleteRecipeEndPoint } from "$modules/recipe/endpoints/DeleteRecipe";
import { ListMenusEndpoint } from "$modules/menu/endpoints/ListMenus";
import { CreateMenuEndpoint } from "$modules/menu/endpoints/CreateMenu";
import { DeleteMenuEndpoint } from "$modules/menu/endpoints/DeleteMenu"
import { ListIngredientEndpoint } from "$modules/ingredient/endpoints/ListIngredient";
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
import { HomeEndpoint } from "$lib/common/endpoints/HomeEndpoint";
import { UpdateMenuEndpoint } from "$modules/menu/endpoints/UpdateMenu";
import { GenerateMenuEndpoint } from "$modules/menu/endpoints/GenerateMenu";
import { GetRecipeByIdEndpoint } from "$modules/recipe/endpoints/GetRecipeById";

export const routing: Routing = {
	v1: {
		"/": HomeEndpoint,
		recipes: {
			"/": new DependsOnMethod({
				get: ListRecipesEndpoint,
				post: CreateRecipeEndPoint,
			}),
			"/:id": new DependsOnMethod({
				get: GetRecipeByIdEndpoint,
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
				get: ListIngredientEndpoint,
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
