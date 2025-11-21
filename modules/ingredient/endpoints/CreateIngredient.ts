import { CreateIngredientDto } from "../dto/ingredient.dto";
import { CreateIngredientUseCase } from "../usecases/CreateIngredient";
import { IngredientRepository } from "../repositories/IngredientRepository";
import { ApiResponse } from "$lib/common/api/ApiResponse";
import { UseCaseResponseSchema } from "$lib/common/usecase";
import { authMiddleware } from "$lib/middlewares/authMiddleware";
import { endpointsFactory } from "$lib/common/endpointFactory";

export const CreateIngredientEndpoint = endpointsFactory
  .addMiddleware(authMiddleware)
  .build({
    method: "post",
    input: CreateIngredientDto.describe(
      "Créer un nouvel ingrédient. Champs obligatoires : name (chaîne non vide). Les autres champs sont optionnels avec des valeurs par défaut.",
    ),
    output: UseCaseResponseSchema,
    handler: async ({ input }) => {
      const createIngredientResponse = await CreateIngredientUseCase({
        ingredientRepository: IngredientRepository(),
      }).execute({ dto: input });

      return ApiResponse.send(createIngredientResponse);
    },
  });
