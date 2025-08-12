const db = require('../config/db');

const addHistoriqueSupprime = async (historique, supprimePar) => {
  const sql = `
    INSERT INTO historiques_supprimes 
    (employe_id, action, details, date_action, date_suppression, supprime_par)
    VALUES (?, ?, ?, ?, NOW(), ?)
  `;
  const params = [
    historique.employe_id,
    historique.action,
    historique.details,
    historique.date_action,
    supprimePar
  ];

  const [result] = await db.query(sql, params);
  return result.insertId;
};

module.exports = {
  addHistoriqueSupprime,
};
