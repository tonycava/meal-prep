import { Routing, ServeStatic } from "express-zod-api";
import path from "path";
import { ListRecipeEndpoint } from "../modules/recipe/endpoints/ListRecipe.ts";
import {ListMenusEndpoint} from "$modules/menu/endpoints/ListMenus.ts";

export const routing: Routing = {
  v1: {
    recipes: {
      "/": ListRecipeEndpoint
    },
    menus: {
      "/": ListMenusEndpoint
    },
  },
  public: new ServeStatic(path.join(__dirname, "../assets"), {
    dotfiles: "deny",
    index: false,
    redirect: false,
  }),
};