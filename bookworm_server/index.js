const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const userRouter = require('./router/user')
const bookRouter = require('./router/book')

const app = express();
const PORT = process.env.PORT || 3000;
const server_port = 8080;

// Middleware
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());

// Initialize PostgreSQL pool
const pool = new Pool({
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: 'postgres.zknowujwlgwpoptlzdyx',
    password: process.env.PASSWORD,
    port: process.env.PORT,
    max: 10,
    idleTimeoutMillis: 30000, // 30 sekundi
});

// Middleware to attach pool to request
app.use((req, res, next) => {
    req.pool = pool;
    next();
});

pool.connect((err, client, release) => {
    if (err) {
        console.error('Error acquiring client', err.stack);
    } else {
        console.log('Database connected successfully');
        release();
    }
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1); // Opcionalno, izlaz iz aplikacije
});


app.get('/', async (req, res) => {
    res.send('Server uspješno postavljen.');
});

app.use('/user', userRouter);
app.use('/book', bookRouter);

// Start server
app.listen(server_port, () => {
    console.log(`Server is running on http://localhost:${server_port}`);
});
