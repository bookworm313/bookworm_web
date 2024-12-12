const express = require('express');
const router = express.Router();

// GET: Retrieve all users
router.get('/', async (req, res) => {
    const pool = req.pool;
    try {
        const result = await pool.query('SELECT * FROM "User"');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST: Log in user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const pool = req.pool;

    try {
        const result = await pool.query(
            'SELECT * FROM "User" WHERE username = $1 AND password = $2',
            [username, password] // Replace with hashed password comparison in production
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        res.status(200).json({ message: 'Login successful', user: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST: Log out user
router.post('/logout', (req, res) => {
    // Invalidate session or token here (implementation depends on your auth strategy)
    res.status(200).json({ message: 'Logout successful' });
});

// POST: Register new user
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const pool = req.pool;

    try {
        const result = await pool.query(
            'INSERT INTO "User" (username, email, password, visible) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, password, true] // Replace with hashed password in production
        );

        res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE: Delete user account
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const pool = req.pool;

    try {
        const result = await pool.query('DELETE FROM "User" WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully', user: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/reset_password', function (req, res) {
    const { id, password } = req.body;

    const pool = req.pool;

    try {
        pool.query('UPDATE "User" SET password = $1 WHERE id = $2', [password, id], function (err, result) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.status(200).json({ message: 'Password reset successful' });
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
