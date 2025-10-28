import { Routing, ServeStatic } from "express-zod-api";
import path from "path";
import { ListRecipeEndpoint, recipeEndpoint } from "../modules/recipe/endpoints/ListRecipe.ts";

export const routing: Routing = {
  v1: {
    recipes: {
      "/": recipeEndpoint,
    },
  },
  public: new ServeStatic(path.join(__dirname, "../assets"), {
    dotfiles: "deny",
    index: false,
    redirect: false,
  }),
};