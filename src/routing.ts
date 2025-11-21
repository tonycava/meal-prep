import path from "path";
import { DependsOnMethod, Routing, ServeStatic } from "express-zod-api";
import { ListRecipesEndpoint } from "../modules/recipe/endpoints/ListRecipe";
import { ListRecipeByIdEndpoint } from "../modules/recipe/endpoints/ListRecipeById";
import { CreateRecipeEndPoint } from "$modules/recipe/endpoints/CreateRecipe";
import { DeleteRecipeEndPoint } from "$modules/recipe/endpoints/DeleteRecipe";
import { ListMenusEndpoint } from "$modules/menu/endpoints/ListMenus";
import { CreateMenuEndpoint } from "$modules/menu/endpoints/CreateMenu";
import { ListIngredientEndpoint } from "$modules/ingredient/endpoints/ListIngredient";
import { CreateIngredientEndpoint } from "$modules/ingredient/endpoints/CreateIngredient";
import { DeleteIngredientEndpoint } from "$modules/ingredient/endpoints/DeleteIngredient";
import { UpdateIngredientEndpoint } from "$modules/ingredient/endpoints/UpdateIngredient";
import { GetIngredientByIdEndpoint } from "$modules/ingredient/endpoints/GetIngredientByIdEndpoint";
import { RegisterApiKeyEndpoint } from "$modules/apikey/endpoints/RegisterApiKey";
import { ListMealsEndpoint } from "$modules/meal/endpoints/ListMeals";
import { CreateMealEndpoint } from "$modules/meal/endpoints/CreateMeal";
import { GetMealByIdEndpoint } from "$modules/meal/endpoints/GetMealById";
import { UpdateMealEndpoint } from "$modules/meal/endpoints/UpdateMeal";
import { DeleteMealEndpoint } from "$modules/meal/endpoints/DeleteMeal";
import { HomeEndpoint } from "$lib/common/endpoints/HomeEndpoint";
import { UpdateMenuEndpoint } from "$modules/menu/endpoints/UpdateMenu";

export const routing: Routing = {
  v1: {
    "/": HomeEndpoint,
    recipes: {
      "/": new DependsOnMethod({
        get: ListRecipesEndpoint,
        post: CreateRecipeEndPoint,
        delete: DeleteRecipeEndPoint,
      }),
      "/:id": new DependsOnMethod({
        get: ListRecipeByIdEndpoint,
      }),
    },
    menus: new DependsOnMethod({
      get: ListMenusEndpoint,
      post: CreateMenuEndpoint,
      patch: UpdateMenuEndpoint,
    }),
    ingredients: {
      "/": new DependsOnMethod({
        get: ListIngredientEndpoint,
        post: CreateIngredientEndpoint,
      }),
      "/:id": new DependsOnMethod({
        get: GetIngredientByIdEndpoint,
        put: UpdateIngredientEndpoint,
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
      }),
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
