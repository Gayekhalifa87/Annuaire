const db = require('../config/db');

const addHistorique = require('./historiqueModel').addHistorique;

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

const GetEmployeeByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM employes WHERE email = ?', [email]);
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

const countEmployees = async () => {
  const [rows] = await db.query('SELECT COUNT(*) as count FROM employes');
  return rows[0].count;
};
const countDepartments = async () => {
  const [rows] = await db.query('SELECT COUNT(DISTINCT direction) as count FROM employes');
  return rows[0].count;
};
const countServices = async () => {
  const [rows] = await db.query('SELECT COUNT(DISTINCT service) as count FROM employes');
  return rows[0].count;
};


module.exports = {
  GetAllEmployees,
  GetEmployeeById,
  GetEmployeeByEmail,
  CreateEmployee,
  UpdateEmployee,
  ChangeRole,
  DeleteEmployee,
  countEmployees,
  countDepartments,
  countServices
};
