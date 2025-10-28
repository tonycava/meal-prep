import { writeFile } from "node:fs/promises";
import { Documentation } from "express-zod-api";
import { config } from "./config.ts";
import { routing } from "./routing.ts";
import manifest from "../package.json";

(async () => {
  await writeFile(
    "../assets/documentation.yaml",
    new Documentation({
      routing,
      config,
      version: manifest.version,
      title: "MealPrep",
      serverUrl: "http://localhost:8090",
    }).getSpecAsYaml(),
    "utf-8",
  );
})();
