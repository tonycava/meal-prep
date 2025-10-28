import { Routing, ServeStatic } from "express-zod-api";
import path from "path";
import { ListRecipeEndpoint } from "../modules/recipe/endpoints/ListRecipe.ts";

export const routing: Routing = {
  v1: {
    recipe: {
      "/": ListRecipeEndpoint
    },
  },
  public: new ServeStatic(path.join(__dirname, "../assets"), {
    dotfiles: "deny",
    index: false,
    redirect: false,
  }),
};