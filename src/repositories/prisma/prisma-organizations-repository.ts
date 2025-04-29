import { db } from "@/lib/infra/database";
import type { Prisma } from "@prisma/client";
import type { OrganizationsRepository } from "../organizations-repository";

export class PrismaOrganizationsRepository implements OrganizationsRepository {
	async create(data: Prisma.OrganizationCreateInput) {
		const organization = await db.organization.create({
			data,
		});

		return organization;
	}

  async findByEmail(email: string) {
    const organization = await db.organization.findUnique({
      where: {
        email,
      },
    });

    return organization;
  }
}
