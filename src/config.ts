import { createConfig } from "express-zod-api";
import ui from "swagger-ui-express";
import helmet from "helmet";
import RateLimit from "$lib/common/api/RateLimit.ts";

export const config = createConfig({
  http: { listen: 8090 }, // port, UNIX socket or Net::ListenOptions
  cors: false, // decide whether to enable CORS
  inputSources: {
    patch: ["body", "query", "params"],
  },
  beforeRouting: ({ app }) => {
    app.use(helmet());

    app.use(RateLimit.defaultRateLimit);
    app.use(
      "/docs",
      ui.serve,
      ui.setup(null, { swaggerUrl: "/public/documentation.yaml" }),
    );
  },
});
