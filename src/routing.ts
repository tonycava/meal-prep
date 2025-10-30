import path from "path";
import { DependsOnMethod, Routing, ServeStatic } from "express-zod-api";
import { ListRecipeEndpoint } from "../modules/recipe/endpoints/ListRecipe.ts";
import { CreateRecipeEndPoint } from "$modules/recipe/endpoints/CreateRecipe.ts";
import { DeleteRecipeEndPoint } from "$modules/recipe/endpoints/DeleteRecipe.ts";

export const routing: Routing = {
  v1: {
    recipe: new DependsOnMethod({
      get: ListRecipeEndpoint,
      post: CreateRecipeEndPoint,
      delete: DeleteRecipeEndPoint,
    }),
  },
  public: new ServeStatic(path.join(__dirname, "../assets"), {
    dotfiles: "deny",
    index: false,
    redirect: false,
  }),
};

