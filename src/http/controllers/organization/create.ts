import { makeCreateOrganizationService } from "@/services/factories/make-create-organization-service";
import { CreateOrganizationService } from "@/services/organizations/create";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function createOrganizationController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const createOrganizationBodySchema = z.object({
		name: z.string(),
		email: z.string().email(),
		password: z.string(),
		address: z.string(),
		phone: z.string(),
		whatsapp: z.string(),
		zipCode: z.string(),  
	});

  const { name, email, password, address,  whatsapp, zipCode } = createOrganizationBodySchema.parse(request.body);

	const createOrganizationService = makeCreateOrganizationService();

  const { organization } = await createOrganizationService.execute({
    name,
    email,
    password,
    address,
    whatsapp,
    zipCode,
  })

  return reply.status(201).send({ organization})
}
