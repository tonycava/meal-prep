import { defaultEndpointsFactory } from "express-zod-api";
import { z } from "zod";

export const ListRecipeEndpoint = defaultEndpointsFactory.build({
  input: z.object({
    name: z.string().optional(),
  }),
  output: z.object({
    greetings: z.string(),
  }),
  handler: async ({ input: { name }, options, logger }) => {
    logger.debug("Options:", options);
    return { greetings: `Hello, ${name || "World"}. Happy coding!` };
  },
});