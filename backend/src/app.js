const express = require('express');
const cors = require('cors');
const morgan = 'morgan';
const apiRoutes = require('./api');
const { errorMiddleware } = require('./middlewares/error.middleware');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// API Routes
app.use('/api', apiRoutes);

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health Check
app.get('/', (req, res) => {
    res.status(200).json({ success: true, message: "Backend is healthy" });
});

// Centralized Error Handling
app.use(errorMiddleware);

module.exports = app;