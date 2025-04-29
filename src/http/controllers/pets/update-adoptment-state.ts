import { makeUpdateAdoptmentDateService } from "@/services/factories/make-update-adoptment-date-service";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function updateAdoptmentState(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const paramsSchema = z.object({
		id: z.string(),
	});

	const updateAdoptmentStateBodySchema = z.object({
		adopted: z.boolean(),
	});

	const { id } = paramsSchema.parse(request.params);
	const { adopted } = updateAdoptmentStateBodySchema.parse(request.body);

	const updateAdoptmentStateService = makeUpdateAdoptmentDateService();

	await updateAdoptmentStateService.execute({
		petId: id,
		adoptedAt: adopted ? new Date().toISOString() : null,
		organizationId: request.user.sub,
	});

	return reply.status(204).send();
}
