const express = require('express');
const router = express.Router();

// GET: Retrieve all users
router.get('/lists', async (req, res) => {
    const pool = req.pool;
    try {
        const result = await pool.query('SELECT * FROM "List"');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    const pool = req.pool;
    try {
        const result = await pool.query('SELECT * FROM "ListBook"');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    const { list_id, books_olid } = req.body;

    const pool = req.pool;

    try {
        const result = await pool.query(`UPDATE "List" SET books_olid = '${books_olid}' WHERE id = ${list_id} RETURNING *`);
        res.status(201).json({ message: 'Lists updated successfully', test: books_olid, list: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }    
});

module.exports = router;
