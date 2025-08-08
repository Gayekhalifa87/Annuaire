const db = require('../config/db');

// Récupérer tous les employés
const GetAllEmployees = async () => {
  const [rows] = await db.query('SELECT * FROM employes');
  return rows;
};

// Récupérer un employé par ID
const GetEmployeeById = async (id) => {
  const [rows] = await db.query('SELECT * FROM employes WHERE id = ?', [id]);
  return rows[0];
};

// Créer un employé
const CreateEmployee = async (employee) => {
  const {
    prenom, nom, email, telephone, ip, role, password,
    poste, direction, service
  } = employee;

  const [result] = await db.query(
    `INSERT INTO employes (prenom, nom, email, telephone, ip, role, password, poste, direction, service)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [prenom, nom, email, telephone, ip, role, password, poste, direction, service]
  );

  return { id: result.insertId, ...employee };
};

// Modifier un employé
const UpdateEmployee = async (id, employee) => {
  const {
    prenom, nom, email, telephone, ip, role,
    poste, direction, service
  } = employee;

  await db.query(
    `UPDATE employes SET prenom = ?, nom = ?, email = ?, telephone = ?, ip = ?, role = ?, poste = ?, direction = ?, service = ?
     WHERE id = ?`,
    [prenom, nom, email, telephone, ip, role, poste, direction, service, id]
  );

  return { id, ...employee };
};

// Changer uniquement le rôle
const ChangeRole = async (id, role) => {
  await db.query('UPDATE employes SET role = ? WHERE id = ?', [role, id]);
  return { id, role };
};

// Supprimer un employé
const DeleteEmployee = async (id) => {
  const [result] = await db.query('DELETE FROM employes WHERE id = ?', [id]);
  return result;
};

module.exports = {
  GetAllEmployees,
  GetEmployeeById,
  CreateEmployee,
  UpdateEmployee,
  ChangeRole,
  DeleteEmployee
};
