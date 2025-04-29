import { Exception } from "./exception";

export class InvalidCredentialsException extends Exception {
	statusCode = 401;

	constructor() {
		super("Invalid credentials");
	}
}
