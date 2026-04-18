'use strict';

require('express-async-errors');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');

const authRoutes = require('./modules/auth/auth.routes');
const taskRoutes = require('./modules/tasks/task.routes');
const { errorHandler } = require('./middleware/error.middleware');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// API documentation
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Task Management API Docs',
    swaggerOptions: {
      persistAuthorization: true, // keeps JWT after page refresh
    },
  })
);

// Routes for authentication and tasks
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Handle 404 Not Found
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    statusCode: 404,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

// Use global error handler
app.use(errorHandler);

module.exports = app;
