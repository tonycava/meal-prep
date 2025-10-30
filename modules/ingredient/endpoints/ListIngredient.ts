import { defaultEndpointsFactory } from "express-zod-api";
import { z } from "zod";
import { prisma } from "../../../lib/db";
import { IngredientResponseDto } from "../dto/ingredient.dto";

const listOutput = z.object({
  ingredients: z.array(IngredientResponseDto),
  meta: z.object({
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
  }),
});

export const ListIngredientsEndpoint = defaultEndpointsFactory.build({
  method: "get",
  input: z.object({
    query: z.object({
      limit: z.string().optional().transform((val) => val ? parseInt(val) : 20),
      offset: z.string().optional().transform((val) => val ? parseInt(val) : 0),
      category: z.string().optional(),
      search: z.string().optional(),
    }).optional(),
  }),
  output: listOutput,
  handler: async ({ input, logger }: any) => {
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

    const total = await prisma.ingredient.count({ where });

    const ingredients = await prisma.ingredient.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { name: 'asc' },
      include: {
        minerals: true,
        vitamins: true,
      },
    });

    logger.info(`Fetched ${ingredients.length} ingredients`);

    return {
      ingredients,
      meta: {
        total,
        limit,
        offset,
      },
    };
  },
});
