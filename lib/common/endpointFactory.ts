import { EndpointsFactory } from "express-zod-api";
import { mealPrepResultHandler } from "./resultHandler";

export const endpointsFactory = new EndpointsFactory(mealPrepResultHandler);
