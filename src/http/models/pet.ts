import { PetAge, PetEnergy, PetIndependence, PetSize } from "@prisma/client";
import z from "zod";

export const PetSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		age: z.nativeEnum(PetAge),
		energy: z.nativeEnum(PetEnergy),
		size: z.nativeEnum(PetSize),
		independence: z.nativeEnum(PetIndependence),
		adoptedAt: z.string().nullable(),
		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime().nullable(),
	})
	.describe("Pet");
