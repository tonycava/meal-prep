import { createConfig } from "express-zod-api";
import ui from "swagger-ui-express";
import express from "express";
import path from "path";

export const config = createConfig({
  http: { listen: 8090 },
  cors: false,
  beforeRouting: ({ app }) => {
    app.use("/assets", express.static(path.join(process.cwd(), "assets")));

    app.use(
      "/docs",
      ui.serve,
      ui.setup(null, { swaggerUrl: "/assets/documentation.yaml" }),
    );
  },
});