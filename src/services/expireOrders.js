const pool = require("../config/db");
const { sendEmail } = require("./emailService");
const orderExpiredTemplate = require("./templates/orderExpired");

async function expirePendingOrders() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(`
      WITH expired AS (
        SELECT id
        FROM orders
        WHERE payment_status = 'pending'
          AND reviewed_at IS NULL
          AND created_at < NOW() - INTERVAL '30 minutes'
        FOR UPDATE
      )
      UPDATE orders
      SET payment_status = 'rejected',
          reviewed_at = NOW(),
          admin_note = 'Expirada automáticamente'
      WHERE id IN (SELECT id FROM expired)
      RETURNING id
    `);

    const expiredIds = result.rows.map(r => r.id);

    if (expiredIds.length > 0) {
      await client.query(
        "DELETE FROM order_numbers WHERE order_id = ANY($1)",
        [expiredIds]
      );
    }

    await client.query("COMMIT");

    const { rows } = await client.query(`
        SELECT u.email, r.title
        FROM orders o
        JOIN users u ON u.id = o.user_id
        JOIN raffles r ON r.id = o.raffle_id
        WHERE o.id = ANY($1)
        `, [expiredIds]);

    for (const row of rows) {
        await sendEmail({
            to: row.email,
            subject: "Orden expirada - Super Sorteos",
            html: orderExpiredTemplate({
            raffleTitle: row.title,
            }),
        });
    }

    return expiredIds.length;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { expirePendingOrders };
