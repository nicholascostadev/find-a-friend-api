import { makeCreatePetService } from "@/services/factories/make-create-pet-service";
import { PetAge, PetEnergy, PetIndependence, PetSize } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function createPetController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const createPetBodySchema = z.object({
		name: z.string(),
		city: z.string(),
		age: z.nativeEnum(PetAge),
		energy: z.nativeEnum(PetEnergy),
		size: z.nativeEnum(PetSize),
		independence: z.nativeEnum(PetIndependence),
	});

	const organizationId = request.user.sub;
	const { name, city, age, energy, size, independence } =
		createPetBodySchema.parse(request.body);

	const createPetService = makeCreatePetService();

	const { pet } = await createPetService.execute({
		name,
		city,
		age,
		energy,
		size,
		independence,
		organizationId,
	});

	return reply.status(201).send({ pet });
}
