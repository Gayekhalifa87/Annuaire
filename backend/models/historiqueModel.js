const db = require('../config/db');

const getAllHistorique = async () => {
  const [rows] = await db.query('SELECT * FROM historiques');
  return rows;
}
const getHistoriqueById = async (id) => {
  const [rows] = await db.query('SELECT * FROM historiques WHERE id = ?', [id]);
  return rows[0];
}

module.exports = {
  getAllHistorique,
  getHistoriqueById
};
    