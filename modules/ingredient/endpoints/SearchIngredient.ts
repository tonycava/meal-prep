import { defaultEndpointsFactory } from "express-zod-api";
import { z } from "zod";
import { SearchIngredientUseCase } from "../usecases/SearchIngredient";
import { IngredientRepository } from "../repositories/IngredientRepository";
import { ApiResponse } from "../../../lib/common/api/ApiResponse";
import { UseCaseResponseSchema, UseCaseResponseBuilder } from "../../../lib/common/usecase";

export const SearchIngredientEndpoint = defaultEndpointsFactory.build({
  method: "get",
  input: z.object({
    name: z.string().optional(),
  }),
  output: UseCaseResponseSchema,
  handler: async ({ input, options, logger }) => {
    if (!input.name) {
      return ApiResponse.send(UseCaseResponseBuilder.error(400, "Le paramètre 'name' est requis dans la query"));
    }
    logger.info("Searching for ingredient by name");
    const searchResponse = await SearchIngredientUseCase({
      ingredientRepository: IngredientRepository(),
    }).execute({ name: input.name });

    return ApiResponse.send(searchResponse);
  },
});