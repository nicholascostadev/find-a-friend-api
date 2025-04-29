import { makeAuthenticateOrganizationService } from "@/services/factories/make-authenticate-organization-service";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function authenticateOrganizationController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateOrganizationSchema = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  const { email, password } = authenticateOrganizationSchema.parse(request.body);
  
  const authenticateOrganizationService = makeAuthenticateOrganizationService();

  const { organization } = await authenticateOrganizationService.execute({
    email,
    password,
  });

  const token = await reply.jwtSign(
    {
    },
    {
      sub: organization.id,
    },
  );

  return reply.status(200).send({
    token,
  });
}

