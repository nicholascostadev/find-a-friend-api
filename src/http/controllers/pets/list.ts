import { makeListPetsService } from "@/services/factories/make-list-pets-service";
import { PetAge, PetEnergy, PetIndependence, PetSize } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export const listPetsController = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	const listPetsSchema = z.object({
		city: z.string(),
		age: z.nativeEnum(PetAge).optional(),
		energy: z.nativeEnum(PetEnergy).optional(),
		size: z.nativeEnum(PetSize).optional(),
		independence: z.nativeEnum(PetIndependence).optional(),
	});

	const filters = listPetsSchema.parse(request.query);

	const listPetsService = makeListPetsService();

	const { pets } = await listPetsService.execute(filters);

	return reply.status(200).send({ pets });
};
