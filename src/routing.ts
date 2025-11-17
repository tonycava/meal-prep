import path from "path";
import { DependsOnMethod, Routing, ServeStatic } from "express-zod-api";
import { CreateRecipeEndPoint } from "$modules/recipe/endpoints/CreateRecipe.ts";
import { DeleteRecipeEndPoint } from "$modules/recipe/endpoints/DeleteRecipe.ts";
import { UpdateRecipeEndpoint } from "$modules/recipe/endpoints/UpdateRecipe.ts";
import { ListRecipeEndpoint } from "$modules/recipe/endpoints/ListRecipe.ts";

export const routing: Routing = {
  v1: {
    recipes: new DependsOnMethod({
      get: ListRecipeEndpoint,
      post: CreateRecipeEndPoint,
      delete: DeleteRecipeEndPoint,
      patch: UpdateRecipeEndpoint,
    }),
  },
  public: new ServeStatic(path.join(__dirname, "../assets"), {
    dotfiles: "deny",
    index: false,
    redirect: false,
  }),
};

