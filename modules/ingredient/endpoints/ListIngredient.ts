import { defaultEndpointsFactory } from "express-zod-api";
import { z } from "zod";
import { prisma } from "../../../lib/db";
import { IngredientResponseDto, CreateIngredientDto } from "../dto/ingredient.dto";
import { CreateIngredientUseCase } from "../usecases/CreateIngredient";
import { IngredientRepository } from "../repositories/IngredientRepository";
import { ApiResponse } from "../../../lib/common/api/ApiResponse";
import { UseCaseResponseSchema } from "../../../lib/common/usecase";

const listOutput = z.object({
  ingredients: z.array(IngredientResponseDto),
  meta: z.object({
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
  }),
});

export const IngredientsEndpoint = defaultEndpointsFactory.build({
  method: ["get", "post"],
  input: z.union([
    CreateIngredientDto,
    z.object({
      query: z.object({
        limit: z.string().optional().transform((val) => val ? parseInt(val) : 20),
        offset: z.string().optional().transform((val) => val ? parseInt(val) : 0),
        category: z.string().optional(),
        search: z.string().optional(),
      }).optional(),
    }),
  ]),
  output: z.union([listOutput, UseCaseResponseSchema]),
  handler: async ({ input, logger, options }: any) => {
    const request = options?.request;
    if (request && request.method === "POST" || 'name' in input) {
      logger.info("Detected POST request for ingredient creation");
      const createIngredientResponse = await CreateIngredientUseCase({
        ingredientRepository: IngredientRepository(),
      }).execute({ dto: input });

      return ApiResponse.send(createIngredientResponse);
    } else {
      const { category, search, limit = 10, offset = 0 } = (input as any).query || {};
      const where: any = {};

      if (category) {
        where.category = category;
      }

      if (search) {
        where.name = {
          contains: search,
          mode: 'insensitive',
        };
      }

      const [ingredients, total] = await Promise.all([
        prisma.ingredient.findMany({
          where,
          take: limit,
          skip: offset,
          orderBy: {
            name: 'asc',
          },
          include: {
            minerals: true,
            vitamins: true,
          },
        }),
        prisma.ingredient.count({ where }),
      ]);

      logger.debug(`Retrieved ${ingredients.length} ingredients out of ${total}`);

      return { ingredients: ingredients, meta: { total, limit, offset } };
    }
  },
});