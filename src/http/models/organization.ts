import z from "zod";

export const OrganizationSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		email: z.string().email(),
		address: z.string(),
		zip_code: z.string(),
		whatsapp: z.string(),
	})
	.describe("Organization");
