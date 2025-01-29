const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const basicAuth = require('basic-auth');
const todoRoutes = require('./routes/todoRoutes');

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));

// Connect to MongoDB
mongoose.connect("mongodb+srv://admin:4321@backenddb.djset.mongodb.net/todoApp?retryWrites=true&w=majority&appName=BackendDB")
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Basic Authentication Middleware
const authMiddleware = (req, res, next) => {
    const user = basicAuth(req);
    if (user && user.name === 'admin' && user.pass === 'password') {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

// Use authentication for all routes
app.use(authMiddleware);

// API Routes
app.use('/api/todos', todoRoutes);

// 404 Middleware
app.use((req, res, next) => {
    res.status(404).json({ message: 'Not Found' });
});

// Catch-All Error Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
