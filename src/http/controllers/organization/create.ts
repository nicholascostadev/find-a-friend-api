import { ExceptionSchema } from "@/exceptions/exception";
import { OrganizationSchema } from "@/http/models/organization";
import { makeCreateOrganizationService } from "@/services/factories/make-create-organization-service";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export const CreateOrganizationBodySchema = z.object({
	name: z.string().min(3, "Name must be at least 3 characters"),
	email: z.string().email(),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
		.regex(/[a-z]/, "Password must contain at least one lowercase letter")
		.regex(/[0-9]/, "Password must contain at least one number")
		.regex(
			/[^A-Za-z0-9]/,
			"Password must contain at least one special character",
		),
	address: z.string(),
	whatsapp: z
		.string()
		.regex(
			/^\d{10,11}$/,
			"Whatsapp must be a valid phone number with 10-11 digits",
		),
	zipCode: z
		.string()
		.regex(/^\d{8}$/, "Zip code must be a valid CEP with 8 digits"),
});

type CreateOrganizationBody = z.infer<typeof CreateOrganizationBodySchema>;

export const CreateOrganizationResponseSchema = {
	201: z.object({
		organization: OrganizationSchema,
	}),
	401: ExceptionSchema.describe("Unauthorized"),
} as const;

type CreateOrganizationReplyType = {
	[statusCode in keyof typeof CreateOrganizationResponseSchema]: z.infer<
		(typeof CreateOrganizationResponseSchema)[statusCode]
	>;
};

export type CreateOrganizationRequest = FastifyRequest<{
	Body: CreateOrganizationBody;
	Reply: CreateOrganizationReplyType;
}>;

export type CreateOrganizationReply = FastifyReply<{
	Reply: CreateOrganizationReplyType;
}>;

export async function createOrganizationController(
	request: CreateOrganizationRequest,
	reply: CreateOrganizationReply,
) {
	const { name, email, password, address, whatsapp, zipCode } = request.body;

	const createOrganizationService = makeCreateOrganizationService();

	const { organization } = await createOrganizationService.execute({
		name,
		email,
		password,
		address,
		whatsapp,
		zipCode,
	});

	return reply.status(201).send({ organization });
}
