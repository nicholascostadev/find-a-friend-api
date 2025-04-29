import { jwtMiddleware } from "@/http/middlewares/jwt-middleware";
import type { FastifyInstance } from "fastify";
import { createPetController } from "./create";

export async function petsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", jwtMiddleware)
	app.post("/pets", createPetController);
}
