import { defaultEndpointsFactory } from "express-zod-api";
import { z } from "zod";
import { prisma } from "../../../lib/db.ts";

export const ListRecipeEndpoint = defaultEndpointsFactory.build({
  input: z.object({
    name: z.string().optional(),
  }),
  output: z.object({
    greetings: z.string(),
  }),
  handler: async ({ input: { name }, options, logger }) => {
    const users = await prisma.user.findMany()

    logger.debug("Options:", users);
    return { greetings: `Hello, ${name || "World"}. Happy coding!` };
  },
});