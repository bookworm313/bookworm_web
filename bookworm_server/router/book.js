const express = require('express');
const router = express.Router();
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// GET: Retrieve all users
router.get('/lists/:id?', async (req, res) => {
    const pool = req.pool;
    const { id } = req.params; // Ekstraktujemo id iz params, ako postoji

    try {
        // Ako postoji id, dodajemo WHERE uslov u upit
        const query = id
            ? 'SELECT * FROM "List" WHERE id = $1'
            : 'SELECT * FROM "List"';
        const values = id ? [id] : []; // Ako postoji id, koristimo ga kao parametar

        const result = await pool.query(query, values);
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

router.post('/generate-description', async (req, res) => {
    const { bookTitle, authorName } = req.body;

    try {
        const response = await groq.chat.completions.create({
            model: "llama3-8b-8192",
            messages: [
                {
                    role: "system",
                    content:
                        "You are an assistant that generates short, engaging descriptions of books in around 50 words.",
                },
                {
                    role: "user",
                    content: `Provide a short and engaging description of around 50 words for the book titled "${bookTitle}" by "${authorName}".`,
                },
            ],
            max_tokens: 100,
        });

        let description = response.choices[0]?.message?.content || "";

        // Ukloni prvi i posljednji znak (ako postoji)
        if (description.length > 1) {
            description = description.slice(1, -1); // slice od 1. do pretposljednjeg
        }

        res.json({ description });
    } catch (error) {
        console.error("Error calling Groq API:", error);
        res.status(500).json({ error: "Failed to generate description." });
    }
});


module.exports = router;
