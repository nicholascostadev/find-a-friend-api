import { jwtMiddleware } from "@/http/middlewares/jwt-middleware";
import type { FastifyInstance } from "fastify";
import { createPetController } from "./create";
import { detailsPetController } from "./details";
import { listPetsController } from "./list";

export async function petsRoutes(app: FastifyInstance) {
	app.addHook("onRequest", jwtMiddleware);
	app.post("/pets", createPetController);
	app.get("/pets", listPetsController);
	app.get("/pets/:id", detailsPetController);
}
