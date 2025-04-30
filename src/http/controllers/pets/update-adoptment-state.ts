import { ExceptionSchema } from "@/exceptions/exception";
import { makeUpdateAdoptmentDateService } from "@/services/factories/make-update-adoptment-date-service";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export const UpdateAdoptmentStateParamsSchema = z.object({
	id: z.string(),
});

export const UpdateAdoptmentStateBodySchema = z.object({
	adopted: z.boolean(),
});

type UpdateAdoptmentStateParams = z.infer<
	typeof UpdateAdoptmentStateParamsSchema
>;

type UpdateAdoptmentStateBody = z.infer<typeof UpdateAdoptmentStateBodySchema>;

export const UpdateAdoptmentStateResponseSchema = {
	204: z.any(),
	401: ExceptionSchema.describe("Unauthorized"),
	404: ExceptionSchema.describe("Not found"),
} as const;

type UpdateAdoptmentStateReplyType = {
	[statusCode in keyof typeof UpdateAdoptmentStateResponseSchema]: z.infer<
		(typeof UpdateAdoptmentStateResponseSchema)[statusCode]
	>;
};

export type UpdateAdoptmentStateRequest = FastifyRequest<{
	Params: UpdateAdoptmentStateParams;
	Body: UpdateAdoptmentStateBody;
	Reply: UpdateAdoptmentStateReplyType;
}>;

export type UpdateAdoptmentStateReply = FastifyReply<{
	Reply: UpdateAdoptmentStateReplyType;
}>;

export async function updateAdoptmentState(
	request: UpdateAdoptmentStateRequest,
	reply: UpdateAdoptmentStateReply,
) {
	const { id } = request.params;
	const { adopted } = request.body;

	const updateAdoptmentStateService = makeUpdateAdoptmentDateService();

	await updateAdoptmentStateService.execute({
		petId: id,
		adoptedAt: adopted ? new Date().toISOString() : null,
		organizationId: request.user.sub,
	});

	return reply.status(204).send();
}
