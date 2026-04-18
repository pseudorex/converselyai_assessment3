'use strict';

require('dotenv').config();

const app = require('./app');
const { initPostgres } = require('./config/db.postgres');
const { connectMongo } = require('./config/db.mongo');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Connect to both databases before accepting traffic
    await initPostgres();
    await connectMongo();

    app.listen(PORT, () => {
      console.log('Server is running on port', PORT);
      console.log('API Documentation: http://localhost:' + PORT + '/api-docs');
      console.log('Ready to accept requests!');
    });
  } catch (err) {
    console.error('[FATAL] Failed to start server:', err.message);
    process.exit(1);
  }
}

startServer();
