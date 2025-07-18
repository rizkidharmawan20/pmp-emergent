const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PMP Backend API',
      version: '1.0.0',
      description: 'Dokumentasi API untuk PMP Backend',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/api/*.js'], // Path ke file route untuk dokumentasi
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec; 