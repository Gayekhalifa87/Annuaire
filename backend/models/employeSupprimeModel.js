const db = require('../config/db');

const addEmployeSupprime = async (employe) => {
  const sql = `
    INSERT INTO employes_supprimes 
    (id, nom, prenom, email, telephone, ip, role, poste, direction, service, date_creation, date_modif, date_suppression, supprime_par)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
  `;

  const params = [
    employe.id,
    employe.nom,
    employe.prenom,
    employe.email,
    employe.telephone,
    employe.ip,
    employe.role,
    employe.poste,
    employe.direction,
    employe.service,
    employe.date_creation,
    employe.date_modif,
    // date_suppression = NOW() dans la requête SQL
    employe.supprime_par // l'id de celui qui supprime, à passer en paramètre lors de l'appel
  ];

  const [result] = await db.query(sql, params);
  return result.insertId;
};

module.exports = {
  addEmployeSupprime
};
