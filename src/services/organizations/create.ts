import type { OrganizationsRepository } from "@/repositories/organizations-repository";
import type { Organization } from "@prisma/client";
import { hash } from "bcryptjs";
import { OrganizationWithSameEmailException } from "../../exceptions/organization-with-same-email";

interface CreateOrganizationServiceRequest {
	name: string;
	email: string;
	password: string;
	address: string;
	whatsapp: string;
	zipCode: string;
}

interface CreateOrganizationServiceResponse {
	organization: Omit<Organization, "password_hash">;
}

export class CreateOrganizationService {
	constructor(private organizationsRepository: OrganizationsRepository) {}

	async execute(
		data: CreateOrganizationServiceRequest,
	): Promise<CreateOrganizationServiceResponse> {
		const organizationWithSameEmail =
			await this.organizationsRepository.findByEmail(data.email);

		if (organizationWithSameEmail) {
			throw new OrganizationWithSameEmailException();
		}

		const passwordHash = await hash(data.password, 6);

		const organization = await this.organizationsRepository.create({
			name: data.name,
			email: data.email,
			password_hash: passwordHash,
			address: data.address,
			whatsapp: data.whatsapp,
			zip_code: data.zipCode,
		});

		const { password_hash, ...organizationWithoutPassword } = organization;

		return {
			organization: organizationWithoutPassword,
		};
	}
}
