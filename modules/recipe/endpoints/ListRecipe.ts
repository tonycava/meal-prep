import { defaultEndpointsFactory } from "express-zod-api";
import { z } from "zod";
import { prisma } from "$lib/db.ts";

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