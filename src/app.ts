import fastify from "fastify";

import fastifyJwt from "@fastify/jwt";
import { ZodError } from "zod";
import { Exception } from "./exceptions/exception";
import { env } from "./lib/env";

const app = fastify({
  logger: env.NODE_ENV === "development"
})

app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
})

app.listen({ port: env.PORT }, (err) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }

  app.log.info(`HTTP server running! http://localhost:${env.PORT}`);
});

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
