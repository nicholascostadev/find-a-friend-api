import { ExceptionSchema } from "@/exceptions/exception";
import { makeAuthenticateOrganizationService } from "@/services/factories/make-authenticate-organization-service";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export const AuthenticateOrganizationBodySchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

type AuthenticateBody = z.infer<typeof AuthenticateOrganizationBodySchema>;

export const AuthenticateResponseSchema = {
	200: z
		.object({
			token: z.string(),
		})
		.describe("The token created for the organization"),
	401: ExceptionSchema.describe("Unauthorized"),
} as const;

type AuthenticateReplyType = {
	[statusCode in keyof typeof AuthenticateResponseSchema]: z.infer<
		(typeof AuthenticateResponseSchema)[statusCode]
	>;
};

export type AuthenticateRequest = FastifyRequest<{
	Body: AuthenticateBody;
	Reply: AuthenticateReplyType;
}>;

export type AuthenticateReply = FastifyReply<{
	Reply: AuthenticateReplyType;
}>;

export async function authenticateOrganizationController(
	request: AuthenticateRequest,
	reply: AuthenticateReply,
) {
	const { email, password } = request.body;

	const authenticateOrganizationService = makeAuthenticateOrganizationService();

	const { organization } = await authenticateOrganizationService.execute({
		email,
		password,
	});

	const token = await reply.jwtSign(
		{},
		{
			sub: organization.id,
		},
	);

	return reply.status(200).send({
		token,
	});
}
