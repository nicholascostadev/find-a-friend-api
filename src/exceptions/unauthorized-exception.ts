import { Exception } from "./exception";

export class UnauthorizedException extends Exception {
	statusCode = 401;

	constructor() {
		super("Unauthorized.");
	}
}
