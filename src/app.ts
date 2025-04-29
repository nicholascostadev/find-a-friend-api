import fastify from "fastify";

import fastifyJwt from "@fastify/jwt";
import { ZodError } from "zod";
import { Exception } from "./exceptions/exception";
import { organizationRoutes } from "./http/controllers/organization/routes";
import { petsRoutes } from "./http/controllers/pets/routes";
import { env } from "./lib/env";

export const app = fastify({
	logger: env.NODE_ENV === "development",
});

app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
});

app.register(organizationRoutes);
app.register(petsRoutes);

// Only start the server if this file is run directly, not when imported in tests
if (require.main === module) {
	app.listen({ port: env.PORT }, (err) => {
		if (err) {
			app.log.error(err);
			process.exit(1);
		}

		app.log.info(`HTTP server running! http://localhost:${env.PORT}`);
	});
}

app.setErrorHandler((error, _, reply) => {
	if (error instanceof ZodError) {
		return reply
			.status(400)
			.send({ message: "Validation error.", issues: error.format() });
	}

	if (error instanceof Exception) {
		return reply.status(error.statusCode).send({ message: error.message });
	}

	if (env.NODE_ENV !== "production") {
		console.error(error);
	} else {
		// TODO: add a log to an external tool like DataDog/Sentry
	}

	return reply.status(500).send({ message: "Internal server error." });
});
