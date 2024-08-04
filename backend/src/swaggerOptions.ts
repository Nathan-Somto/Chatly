import { SwaggerDefinition, Options } from "swagger-jsdoc";
import { version } from "../package.json";
const swaggerDefinition: SwaggerDefinition = {
  openapi: "3.1.0",
  info: {
    title: "Chatly Api",
    version,
    description: "The api documentation for the chatly application",
    contact: {
        name: "Nathan Somto",
        url: "https://www.github.com/Nathan-Somto",
        email: "mkparusomtochi26@gmail.com",
      },

  },
  servers: [
    {
      url: "http://localhost:8080/api/v1",
      description: "Development server",
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "Bearer",
        bearerFormat: "JWT",
      },
    },
  },

};
export const swaggerOptions: Options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts"],
};
