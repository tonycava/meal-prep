import path from "path";
import { DependsOnMethod, Routing, ServeStatic } from "express-zod-api";
import { ListRecipeEndpoint } from "../modules/recipe/endpoints/ListRecipe.ts";
import { CreateRecipeEndPoint } from "$modules/recipe/endpoints/CreateRecipe.ts";
import { DeleteRecipeEndPoint } from "$modules/recipe/endpoints/DeleteRecipe.ts";
import {ListMenusEndpoint} from "$modules/menu/endpoints/ListMenus";
import {IngredientsEndpoint} from "$modules/ingredient/endpoints/ListIngredient";
import {IngredientByIdEndpoint} from "$modules/ingredient/endpoints/GetIngredientById";

export const routing: Routing = {
  v1: {
    recipe: new DependsOnMethod({
      get: ListRecipeEndpoint,
      post: CreateRecipeEndPoint,
      delete: DeleteRecipeEndPoint,
    }),
    menu: {
      "/": ListMenusEndpoint
    },
    ingredients: {
      "/": IngredientsEndpoint,
      "/:id": IngredientByIdEndpoint,
    },
  },
  public: new ServeStatic(path.join(__dirname, "../assets"), {
    dotfiles: "deny",
    index: false,
    redirect: false,
  }),
};

