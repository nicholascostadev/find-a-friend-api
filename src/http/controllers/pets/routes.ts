import { ExceptionSchema } from "@/exceptions/exception";
import { jwtMiddleware } from "@/http/middlewares/jwt-middleware";
import { PetSchema } from "@/http/models/pet";
import type { FastifyInstance } from "fastify";
import { createPetBodySchema, createPetController } from "./create";
import { detailsPetController, detailsPetParamsSchema } from "./details";
import { listPetsController, listPetsQuerySchema } from "./list";
import {
	updateAdoptmentState,
	updateAdoptmentStateBodySchema,
	updateAdoptmentStateParamsSchema,
} from "./update-adoptment-state";

export async function petsRoutes(app: FastifyInstance) {
	app.withTypeProvider().route({
		method: "POST",
		url: "/pets",
		schema: {
			body: createPetBodySchema,
			response: {
				201: PetSchema,
				401: ExceptionSchema.describe("Unauthorized"),
			},
		},
		preHandler: [jwtMiddleware],
		handler: createPetController,
	});
	app.withTypeProvider().route({
		method: "GET",
		url: "/pets",
		schema: {
			querystring: listPetsQuerySchema,
			response: {
				200: PetSchema.array().describe("Pets"),
				401: ExceptionSchema.describe("Unauthorized"),
			},
		},
		handler: listPetsController,
	});
	app.withTypeProvider().route({
		method: "GET",
		url: "/pets/:id",
		schema: {
			params: detailsPetParamsSchema,
			response: {
				200: PetSchema,
				404: ExceptionSchema.describe("Not found"),
			},
		},
		handler: detailsPetController,
	});
	app.withTypeProvider().route({
		method: "PUT",
		url: "/pets/:id/adoptment-state",
		schema: {
			params: updateAdoptmentStateParamsSchema,
			body: updateAdoptmentStateBodySchema,
			response: {
				204: ExceptionSchema.describe("No content"),
				401: ExceptionSchema.describe("Unauthorized"),
				404: ExceptionSchema.describe("Not found"),
			},
		},
		preHandler: [jwtMiddleware],
		handler: updateAdoptmentState,
	});
}
