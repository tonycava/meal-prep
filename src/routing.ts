import { Routing, ServeStatic } from "express-zod-api";
import { helloWorldEndpoint } from "./hello";
import path from "path";

export const routing: Routing = {
  v1: {
    hello: helloWorldEndpoint,
  },
  public:new ServeStatic(path.join(__dirname, "../assets"), {
    dotfiles: "deny",
    index: false,
    redirect: false,
  }),
};