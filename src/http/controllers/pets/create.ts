import { ExceptionSchema } from "@/exceptions/exception";
import { PetSchema } from "@/http/models/pet";
import { makeCreatePetService } from "@/services/factories/make-create-pet-service";
import { PetAge, PetEnergy, PetIndependence, PetSize } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export const CreatePetBodySchema = z.object({
	name: z.string(),
	city: z.string(),
	age: z.nativeEnum(PetAge),
	energy: z.nativeEnum(PetEnergy),
	size: z.nativeEnum(PetSize),
	independence: z.nativeEnum(PetIndependence),
});

type CreatePetBody = z.infer<typeof CreatePetBodySchema>;

export const CreatePetResponseSchema = {
	201: z
		.object({
			pet: PetSchema,
		})
		.describe("Pet created successfully"),
	404: ExceptionSchema.describe("Not found"),
} as const;

type CreatePetReplyType = {
	[statusCode in keyof typeof CreatePetResponseSchema]: z.infer<
		(typeof CreatePetResponseSchema)[statusCode]
	>;
};

export type CreatePetRequest = FastifyRequest<{
	Body: CreatePetBody;
	Reply: CreatePetReplyType;
}>;

export type CreatePetReply = FastifyReply<{
	Reply: CreatePetReplyType;
}>;

export async function createPetController(
	request: CreatePetRequest,
	reply: CreatePetReply,
) {
	const organizationId = request.user.sub;
	const { name, city, age, energy, size, independence } = request.body;

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
