import { ExceptionSchema } from "@/exceptions/exception";
import { PetSchema } from "@/http/models/pet";
import { makeDetailsPetService } from "@/services/factories/make-details-pet-service";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export const DetailsPetParamsSchema = z.object({
	id: z.string(),
});

type DetailsPetParams = z.infer<typeof DetailsPetParamsSchema>;

export const DetailsPetResponseSchema = {
	200: z
		.object({
			pet: PetSchema,
		})
		.describe("Pet created successfully"),
	404: ExceptionSchema.describe("Not found"),
} as const;

type DetailsPetReplyType = {
	[statusCode in keyof typeof DetailsPetResponseSchema]: z.infer<
		(typeof DetailsPetResponseSchema)[statusCode]
	>;
};

export type DetailsPetRequest = FastifyRequest<{
	Params: DetailsPetParams;
	Reply: DetailsPetReplyType;
}>;

export type DetailsPetReply = FastifyReply<{
	Reply: DetailsPetReplyType;
}>;

export const detailsPetController = async (
	request: DetailsPetRequest,
	reply: DetailsPetReply,
) => {
	const { id } = request.params;

	const detailsPetService = makeDetailsPetService();

	const { pet } = await detailsPetService.execute({ id });

	return reply.status(200).send({ pet });
};
