import { writeFile } from "node:fs/promises";
import { Documentation } from "express-zod-api";
import { config } from "../config";
import { routing } from "../routing";
import manifest from "../../package.json";
import path from "node:path";

(async () => {
  await writeFile(
    path.resolve(__dirname, "../../assets/documentation.yaml"),
    new Documentation({
      routing,
      config,
      version: manifest.version,
      title: "MealPrep API",
      serverUrl: "http://localhost:8090",
    }).getSpecAsYaml(),
    "utf-8",
  );
  console.log(
    "Documentation generated successfully at assets/documentation.yaml",
  );
})();
