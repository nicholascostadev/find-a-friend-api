import { makeDetailsPetService } from "@/services/factories/make-details-pet-service";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export const detailsPetController = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	const paramsSchema = z.object({
		id: z.string(),
	});

	const { id } = paramsSchema.parse(request.params);

	const detailsPetService = makeDetailsPetService();

	const { pet } = await detailsPetService.execute({ id });

	return reply.status(200).send({ pet });
};
