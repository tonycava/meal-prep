import { Routing, ServeStatic } from "express-zod-api";
import path from "path";
import { ListRecipeEndpoint } from "../modules/recipe/endpoints/ListRecipe.ts";
import { ListIngredientEndpoint } from "../modules/ingredient/endpoints/ListIngredient.ts";

export const routing: Routing = {
  v1: {
    recipe: {
      "/": ListRecipeEndpoint
    },
    ingredient: {
      "/": ListIngredientEndpoint
    },
  },
  public: new ServeStatic(path.join(__dirname, "../assets"), {
    dotfiles: "deny",
    index: false,
    redirect: false,
  }),
};