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

router.post('/', async (req, res) => {
    const { id_list, id_book } = req.body;

    const pool = req.pool;

    try {
        const result = await pool.query(
            'INSERT INTO "ListBook" (id_list, id_book) VALUES ($1, $2) RETURNING *',
            [id_list, id_book]
        );

        res.status(201).json({ message: 'Book added to list successfully', list: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
