require('dotenv').config();
const express = require('express');
const cors = require('cors');  
const app = express();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const bandRoutes = require('./routes/band.routes');
const protectedRoutes = require('./routes/protectedRoutes');
const { authenticateToken, authorizeRoles } = require('./middleware/authMiddleware');

// Swagger imports
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = require('./swagger');

// CORS middleware — allow your frontend URL
app.use(cors({
  origin: 'http://localhost:5000', 
  credentials: true,
}));

// Middleware for JSON body parsing
app.use(express.json());

// Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOptions.options));

// Root route
app.get('/', (req, res) => {
  res.status(200).send('API is running');
});

// Routes that do not require authentication
app.use('/api/auth', authRoutes);

// Routes that require authentication
app.use('/api/bands', authenticateToken, bandRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/protected', authenticateToken, protectedRoutes);

module.exports = app;
