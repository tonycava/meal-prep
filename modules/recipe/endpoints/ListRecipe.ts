import { defaultEndpointsFactory } from "express-zod-api";
import { z } from "zod";
import { prisma } from "../../../lib/db.ts";
import { recipeDto } from "../dto/recipeDto.ts"

export const ListRecipeEndpoint = defaultEndpointsFactory.build({
      method: "get",
      output: z.object({
            data: z.array(z.string()),
      }),
      handler: async ({ logger }) => {
            const users = await prisma.user.findMany()
            logger.debug("Options:", users);
            return { data: [] };
      },
});

export const recipeEndpoint = defaultEndpointsFactory.build({
      input: recipeDto,
      output: z.object({
            greetings: z.string(),
      }),
      handler: async ({ input: { }, options, logger }) => {
            return { greetings: `This recipe is from ${recipeDto || "unknown"}.` }
      },
})