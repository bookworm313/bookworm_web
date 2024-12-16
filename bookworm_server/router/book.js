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
    const { list_id, book_olid, selected } = req.body;

    const pool = req.pool;

    const query = selected
        ? 'INSERT INTO "ListBook" (id_list, olid_book) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *'
        : 'DELETE FROM "ListBook" WHERE id_list = $1 AND olid_book = $2 RETURNING *';

    try {
        const result = await pool.query(query, [list_id, book_olid]);
        res.status(201).json({ message: selected ? 'Book added to list successfully' : 'Book removed from list successfully', query: query, list: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }    
});

module.exports = router;
