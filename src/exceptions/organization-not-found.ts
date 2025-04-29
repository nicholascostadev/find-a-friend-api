import { Exception } from "./exception";

export class OrganizationNotFoundException extends Exception {
	statusCode = 404;

	constructor(organizationId: string) {
		super(`Organization with id ${organizationId} not found`);
	}
}
