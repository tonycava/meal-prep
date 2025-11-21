import { z } from "zod";
import { prisma } from "$lib/db";
import { Prisma } from "../../../src/generated/prisma";
import {
  IngredientListQueryDto,
  IngredientResponseDto,
} from "../dto/ingredient.dto";
import { endpointsFactory } from "$lib/common/endpointFactory";
import { authMiddleware } from "$lib/middlewares/authMiddleware";

export const ListIngredientEndpoint = endpointsFactory
  .addMiddleware(authMiddleware)
  .build({
    method: "get",
    input: IngredientListQueryDto,
    output: z.object({
      ingredients: z.array(IngredientResponseDto),
      total: z.number(),
      limit: z.number(),
      offset: z.number(),
    }),
    handler: async ({
      input: { category, search, limit = 20, offset = 0 },
      logger,
    }) => {
      const where: Prisma.IngredientWhereInput = {};

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
            name: "asc",
          },
          include: {
            minerals: true,
            vitamins: true,
          },
        }),
        prisma.ingredient.count({ where }),
      ]);

      logger.debug(
        `Retrieved ${ingredients.length} ingredients out of ${total}`,
      );

      return {
        ingredients,
        total,
        limit,
        offset,
      };
    },
  });
