import z from "zod";

export const OrganizationSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		email: z.string().email(),
		address: z.string(),
		zipCode: z.string(),
		whatsapp: z.string(),
		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime().nullable(),
	})
	.describe("Organization");
