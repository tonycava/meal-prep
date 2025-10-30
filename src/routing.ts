import { Routing, ServeStatic } from "express-zod-api";
import path from "path";
import { ListRecipeEndpoint } from "../modules/recipe/endpoints/ListRecipe";
import {ListMenusEndpoint} from "$modules/menu/endpoints/ListMenus";
import {IngredientsEndpoint} from "$modules/ingredient/endpoints/ListIngredient";
import {IngredientByIdEndpoint} from "$modules/ingredient/endpoints/GetIngredientById";

export const routing: Routing = {
  v1: {
    recipe: {
      "/": ListRecipeEndpoint
    },
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