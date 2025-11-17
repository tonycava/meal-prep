import { defaultEndpointsFactory } from "express-zod-api";
import { z } from "zod";
import { prisma } from "../../../lib/db";
import { IngredientListQueryDto, IngredientResponseDto } from "../dto/ingredient.dto";

export const ListIngredientEndpoint = defaultEndpointsFactory.build({
  method: "get",
  input: IngredientListQueryDto,
  output: z.object({
    ingredients: z.array(IngredientResponseDto),
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
  }),
  handler: async ({ input: { category, search, limit = 20, offset = 0 }, logger }) => {
    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (search) {
      where.name = {
        contains: search,
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

    return {
      ingredients,
      total,
      limit,
      offset,
    };
  },
});
