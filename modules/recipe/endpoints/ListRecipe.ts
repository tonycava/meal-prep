import { defaultEndpointsFactory } from "express-zod-api";
import { z } from "zod";
import { recipeQueryDto } from "../dto/recipeQueryDto";
import { recipeDto, RecipeDto } from "../dto/recipeDto";
import { ListRecipesUseCase } from "../usecases/ListRecipesUseCase";
import { RecipeRepository } from "../repositories/RecipeRepository";

export const ListRecipeEndpoint = defaultEndpointsFactory.build({
      method: "get",
      input: recipeQueryDto,
      output: z.object({
            data: z.array(recipeDto),
            meta: z.object({
                  total: z.number(),
                  limit: z.number(),
                  offset: z.number(),
            }),
      }),
      handler: async ({ input }) => {
            const listRecipesResponse = await ListRecipesUseCase({
                  recipeRepository: RecipeRepository(),
            }).execute({ query: input });

            if (listRecipesResponse.isSuccess === false) {
                  throw {
                        status: listRecipesResponse.status,
                        message: listRecipesResponse.message,
                  };
            }

            const { data: recipes, total } = listRecipesResponse.data as { data: RecipeDto[], total: number };
            const { limit, offset } = input;

            return {
                  data: recipes,
                  meta: {
                        total: total,
                        limit: limit,
                        offset: offset,
                  }
            };
      },
});