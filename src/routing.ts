import path from "path";
import { DependsOnMethod, Routing, ServeStatic } from "express-zod-api";
import { ListRecipeEndpoint } from "../modules/recipe/endpoints/ListRecipe.ts";
import { CreateRecipeEndPoint } from "$modules/recipe/endpoints/CreateRecipe.ts";
import { DeleteRecipeEndPoint } from "$modules/recipe/endpoints/DeleteRecipe.ts";
import {ListMenusEndpoint} from "$modules/menu/endpoints/ListMenus";
import {ListIngredientsEndpoint} from "$modules/ingredient/endpoints/ListIngredient";
import {CreateIngredientEndpoint} from "$modules/ingredient/endpoints/CreateIngredient";
import {DeleteIngredientEndpoint} from "$modules/ingredient/endpoints/DeleteIngredient";

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
    ingredients: new DependsOnMethod({
        get: ListIngredientsEndpoint,
        post: CreateIngredientEndpoint,
        delete: DeleteIngredientEndpoint,
      },
    },
  },
  public: new ServeStatic(path.join(__dirname, "../assets"), {
    dotfiles: "deny",
    index: false,
    redirect: false,
  }),
};

