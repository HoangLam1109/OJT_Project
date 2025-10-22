import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    version: 'v1.0.0',
    title: 'LexBridge API',
    description: 'LexBridge is a seamless platform that connects clients with verified legal experts, offering secure communication, easy appointment booking, transparent pricing, and comprehensive legal services all in one place.'
  },
  host: `localhost:${process.env.PORT || 3000}`,
  basePath: '/api',
  schemes: ['http', 'https'],
  tags: [
    {
      name: 'User CRUD',
      description: 'User management operations (requires authentication)'
    },
    {
      name: 'Authentication',
      description: 'Authentication and authorization operations'
    }
  ],
  securityDefinitions: {
    apiKeyAuth: {
      type: 'apiKey',
      in: 'cookie',
      name: 'accessToken',
      description: 'JWT access token stored in HTTP-only cookie. Set automatically on login.'
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/index.ts'];

swaggerAutogen()(outputFile, endpointsFiles, doc);
