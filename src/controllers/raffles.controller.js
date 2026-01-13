const pool = require("../config/db");

const createRaffle = async (req, res) => {
  const { title, description, price_per_ticket, total_numbers, draw_date } = req.body;

  if (!title || !price_per_ticket || !total_numbers) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  const { rows } = await pool.query(
    `INSERT INTO raffles (title, description, price_per_ticket, total_numbers, draw_date)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING *`,
    [title, description, price_per_ticket, total_numbers, draw_date]
  );

  res.status(201).json(rows[0]);
};

const listRaffles = async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT * FROM raffles ORDER BY created_at DESC`
  );
  res.json(rows);
};

module.exports = { createRaffle, listRaffles };
