import { PetSchema } from "@/http/models/pet";
import { makeListPetsService } from "@/services/factories/make-list-pets-service";
import { PetAge, PetEnergy, PetIndependence, PetSize } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export const ListPetsQuerySchema = z.object({
	city: z.string(),
	age: z.nativeEnum(PetAge).optional(),
	energy: z.nativeEnum(PetEnergy).optional(),
	size: z.nativeEnum(PetSize).optional(),
	independence: z.nativeEnum(PetIndependence).optional(),
});

type ListPetsQuery = z.infer<typeof ListPetsQuerySchema>;

export const ListPetsResponseSchema = {
	200: z.object({
		pets: z.array(PetSchema),
	}),
} as const;

type ListPetsReplyType = {
	[statusCode in keyof typeof ListPetsResponseSchema]: z.infer<
		(typeof ListPetsResponseSchema)[statusCode]
	>;
};

export type ListPetsRequest = FastifyRequest<{
	Querystring: ListPetsQuery;
	Reply: ListPetsReplyType;
}>;

export type ListPetsReply = FastifyReply<{
	Reply: ListPetsReplyType;
}>;

export const listPetsController = async (
	request: ListPetsRequest,
	reply: ListPetsReply,
) => {
	const listPetsService = makeListPetsService();

	const { pets } = await listPetsService.execute(request.query);

	return reply.status(200).send({ pets });
};
