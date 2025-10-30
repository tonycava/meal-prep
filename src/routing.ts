import { DependsOnMethod, Routing, ServeStatic } from "express-zod-api";
import path from "path";
import { ListRecipeEndpoint } from "../modules/recipe/endpoints/ListRecipe.ts";
import { CreateRecipeEndPoint } from "../modules/recipe/endpoints/CreateRecipe.ts";
import { ListIngredientEndpoint } from "../modules/ingredient/endpoints/ListIngredient.ts";

export const routing: Routing = {
  v1: {
    recipe: new DependsOnMethod({
      get: ListRecipeEndpoint,
      post: CreateRecipeEndPoint,
    }),
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

