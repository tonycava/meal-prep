import { defaultEndpointsFactory } from "express-zod-api";
import { z } from "zod";
import { prisma } from "../../../lib/db";
<<<<<<< HEAD
import { IngredientResponseDto } from "../dto/ingredient.dto";

const listOutput = z.object({
  ingredients: z.array(IngredientResponseDto),
  meta: z.object({
=======
import { IngredientListQueryDto, IngredientResponseDto } from "../dto/ingredient.dto";

export const ListIngredientEndpoint = defaultEndpointsFactory.build({
  method: "get",
  input: IngredientListQueryDto,
  output: z.object({
    ingredients: z.array(IngredientResponseDto),
>>>>>>> f0042e960c87c5d309fb746a9b8d6f52bef59228
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
  }),
<<<<<<< HEAD
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
=======
  handler: async ({ input: { category, search, limit = 20, offset = 0 }, logger }) => {
>>>>>>> f0042e960c87c5d309fb746a9b8d6f52bef59228
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

<<<<<<< HEAD
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
=======
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
>>>>>>> f0042e960c87c5d309fb746a9b8d6f52bef59228
