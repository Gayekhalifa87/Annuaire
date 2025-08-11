const db = require('../config/db');



const addHistorique = async (employe_id, action, details) => {
  const [result] = await db.query(
    'INSERT INTO historiques (employe_id, action, details, date_action) VALUES (?, ?, ?, NOW())',
    [employe_id, action, details]
  );
  return result.insertId;
};


  const getAllHistorique = async () => {
  const [rows] = await db.query(`
    SELECT h.*, e.nom, e.prenom 
    FROM historiques h
    LEFT JOIN employes e ON h.employe_id = e.id
    ORDER BY h.date_action DESC
  `);
  return rows;
}

const getHistoriqueById = async (id) => {
  const [rows] = await db.query(`
    SELECT h.*, e.nom, e.prenom 
    FROM historiques h
    LEFT JOIN employes e ON h.employe_id = e.id
    WHERE h.id = ?
  `, [id]);
  return rows[0];
}


module.exports = {
  getAllHistorique,
  getHistoriqueById,
  addHistorique
};
    