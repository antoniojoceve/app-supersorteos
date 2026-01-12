const pool = require("../config/db");
const bcrypt = require("bcrypt");

// 👇 ESTA FUNCIÓN TIENE QUE EXISTIR
const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO users (name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, role, created_at
      `,
      [name, email, passwordHash]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ message: "Email ya registrado" });
    }
    res.status(500).json({ message: error.message });
  }
};

// 👇 Y ESTA TAMBIÉN
const changePassword = async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  if (!email || !currentPassword || !newPassword) {
    return res.status(400).json({ message: "Faltan datos" });
  }

  try {
    const result = await pool.query(
      "SELECT password_hash FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const isValid = await bcrypt.compare(
      currentPassword,
      result.rows[0].password_hash
    );

    if (!isValid) {
      return res.status(401).json({ message: "Contraseña actual incorrecta" });
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE users SET password_hash = $1 WHERE email = $2",
      [newHash, email]
    );

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 👇 EXPORTAS SOLO LO QUE EXISTE
module.exports = {
  createUser,
  changePassword
};