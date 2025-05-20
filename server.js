const express = require('express');
const app = express();
const { connectionDb } = require('./connectionDb');

// Import routers
const userRouter = require('./routes/userrouter');
const societyRouter = require('./routes/societyroutes');
const eventRouter = require('./routes/eventroutes');
const logisticsrouter = require('./routes/logisticsroutes')
// Connect to the database
connectionDb();

// Middleware to parse JSON requests
app.use(express.json());

// Route bindings (Consistent naming)
app.use('/api/users', userRouter);
app.use('/api/societies', societyRouter);
app.use('/api/events', eventRouter);
app.use('/api/logistics', logisticsrouter)
// 404 handler for unknown routes
app.use((req, res, next) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
