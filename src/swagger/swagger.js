'use strict';

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Management API',
      version: '1.0.0',
      description:
        'A secure RESTful API for managing tasks.\n\n' +
        '**Authentication:** Register → Login → copy the `token` → click **Authorize** and enter `Bearer <token>`.',
      contact: {
        name: 'API Support',
        email: 'support@taskapi.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token obtained from /api/auth/login',
        },
      },
    },
    security: [],
  },
  // Scan all route files for @swagger JSDoc comments
  apis: [
    './src/modules/auth/auth.routes.js',
    './src/modules/tasks/task.routes.js',
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
