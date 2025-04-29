import { InvalidCredentialsException } from "@/exceptions/invalid-credentials-exception";
import type { OrganizationsRepository } from "@/repositories/organizations-repository";
import type { Organization } from "@prisma/client";
import { compare } from "bcryptjs";

interface OrganizationAuthenticateServiceRequest {
	email: string;
	password: string;
}

interface OrganizationAuthenticateServiceResponse {
	organization: Organization;
}

export class OrganizationAuthenticateService {
	constructor(private organizationsRepository: OrganizationsRepository) {}

	async execute(
		data: OrganizationAuthenticateServiceRequest,
	): Promise<OrganizationAuthenticateServiceResponse> {
		const organization = await this.organizationsRepository.findByEmail(
			data.email,
		);

		if (!organization) {
			throw new InvalidCredentialsException();
		}

		const doesPasswordMatch = await compare(
			data.password,
			organization.password_hash,
		);

		if (!doesPasswordMatch) {
			throw new InvalidCredentialsException();
		}

		return {
			organization,
		};
	}
}
