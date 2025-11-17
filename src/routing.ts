import path from "path";
import { DependsOnMethod, Routing, ServeStatic } from "express-zod-api";
import { ListRecipesEndpoint } from "../modules/recipe/endpoints/ListRecipe.ts";
import { CreateRecipeEndPoint } from "$modules/recipe/endpoints/CreateRecipe.ts";
import { DeleteRecipeEndPoint } from "$modules/recipe/endpoints/DeleteRecipe.ts";
import { ListMenusEndpoint } from "$modules/menu/endpoints/ListMenus.ts";
import { CreateMenuEndpoint } from "$modules/menu/endpoints/CreateMenu.ts";
import { ListIngredientEndpoint } from "$modules/ingredient/endpoints/ListIngredient";
import { CreateIngredientEndpoint } from "$modules/ingredient/endpoints/CreateIngredient";
import { DeleteIngredientEndpoint } from "$modules/ingredient/endpoints/DeleteIngredient";
import { UpdateIngredientEndpoint } from "$modules/ingredient/endpoints/UpdateIngredient";
import { GetIngredientByIdEndpoint } from "$modules/ingredient/endpoints/GetIngredientByIdEndpoint";
import { SearchIngredientEndpoint } from "$modules/ingredient/endpoints/SearchIngredient";

export const routing: Routing = {
  v1: {
    recipes: new DependsOnMethod({
      get: ListRecipesEndpoint,
      post: CreateRecipeEndPoint,
      delete: DeleteRecipeEndPoint,
    }),
    menus: new DependsOnMethod({
      get: ListMenusEndpoint,
      post: CreateMenuEndpoint,
    }),
    ingredients: {
      "/": new DependsOnMethod({
        get: ListIngredientEndpoint,
        post: CreateIngredientEndpoint,
      }),
      "/search": new DependsOnMethod({
        get: SearchIngredientEndpoint,
      }),
      "/:id": new DependsOnMethod({
        get: GetIngredientByIdEndpoint,
        put: UpdateIngredientEndpoint,
        delete: DeleteIngredientEndpoint,
      })
    },
  },
  public: new ServeStatic(path.join(__dirname, "../assets"), {
    dotfiles: "deny",
    index: false,
    redirect: false,
  }),
};
