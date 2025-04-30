import type { FastifyTypedInstance } from "@/@types/fasfify";
import { jwtMiddleware } from "@/http/middlewares/jwt-middleware";
import {
	CreatePetBodySchema,
	CreatePetResponseSchema,
	createPetController,
} from "./create";
import {
	DetailsPetParamsSchema,
	DetailsPetResponseSchema,
	detailsPetController,
} from "./details";
import {
	ListPetsQuerySchema,
	ListPetsResponseSchema,
	listPetsController,
} from "./list";
import {
	UpdateAdoptmentStateBodySchema,
	UpdateAdoptmentStateParamsSchema,
	UpdateAdoptmentStateResponseSchema,
	updateAdoptmentState,
} from "./update-adoptment-state";

export async function petsRoutes(app: FastifyTypedInstance) {
	app.route({
		method: "GET",
		url: "/pets",
		schema: {
			tags: ["pets"],
			querystring: ListPetsQuerySchema,
			response: ListPetsResponseSchema,
		},
		handler: listPetsController,
	});
	app.route({
		method: "GET",
		url: "/pets/:id",
		schema: {
			tags: ["pets"],
			params: DetailsPetParamsSchema,
			response: DetailsPetResponseSchema,
		},
		handler: detailsPetController,
	});

	// Authenticated routes

	app.route({
		method: "POST",
		url: "/pets",
		schema: {
			tags: ["pets"],
			body: CreatePetBodySchema,
			response: CreatePetResponseSchema,
			security: [
				{
					bearerAuth: [],
				},
			],
		},
		preHandler: [jwtMiddleware],
		handler: createPetController,
	});

	app.route({
		method: "PUT",
		url: "/pets/:id/adoptment-state",
		schema: {
			tags: ["pets"],
			params: UpdateAdoptmentStateParamsSchema,
			body: UpdateAdoptmentStateBodySchema,
			response: UpdateAdoptmentStateResponseSchema,
			security: [
				{
					bearerAuth: [],
				},
			],
		},
		preHandler: [jwtMiddleware],
		handler: updateAdoptmentState,
	});
}
