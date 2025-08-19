const db = require('../config/db');

const bcrypt = require('bcrypt');


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

// Récupérer un employé par IP
const GetEmployeeByIp = async (ip) => {
  const [rows] = await db.query('SELECT * FROM employes WHERE ip = ?', [ip]);
  return rows[0] || null;
};

const GetEmployeeByTel = async (telephone) => {
  const [rows] = await db.query('SELECT * FROM employes WHERE telephone = ?', [telephone]);
  return rows[0] || null;
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
    `UPDATE employes SET prenom = ?, nom = ?, email = ?, telephone = ?, ip = ?, poste = ?, direction = ?, service = ?
     WHERE id = ?`,
    [prenom, nom, email, telephone, ip, poste, direction, service, id]
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
const SearchEmployeesAdvanced = async (filters) => {
  let query = "SELECT * FROM employes WHERE 1=1"; 
  const values = [];

  if (filters.global) {
    // Recherche “OR” sur tous les champs principaux
    query += ` AND (
      nom LIKE ? OR 
      prenom LIKE ? OR 
      poste LIKE ? OR 
      direction LIKE ? OR 
      service LIKE ? OR 
      ip LIKE ?
    )`;
    const term = `%${filters.global}%`;
    for (let i = 0; i < 6; i++) values.push(term);
  } else {
    if (filters.nom) {
      query += " AND nom LIKE ?";
      values.push(`%${filters.nom}%`);
    }
    if (filters.prenom) {
      query += " AND prenom LIKE ?";
      values.push(`%${filters.prenom}%`);
    }
    if (filters.poste) {
      query += " AND poste LIKE ?";
      values.push(`%${filters.poste}%`);
    }
    if (filters.service) {
      query += " AND service LIKE ?";
      values.push(`%${filters.service}%`);
    }
    if (filters.direction) {
      query += " AND direction LIKE ?";
      values.push(`%${filters.direction}%`);
    }
    if (filters.ip) {
      query += " AND ip LIKE ?";
      values.push(`%${filters.ip}%`);
    }
  }

  const [rows] = await db.query(query, values);
  return rows;
};


// Récupérer toutes les directions distinctes
const GetAllDirections = async () => {
  const [rows] = await db.query('SELECT DISTINCT direction FROM employes');
  return rows.map(row => row.direction); 
}

// Changer le mot de passe d’un employé
const ChangePassword = async (id, currentPassword, newPassword) => {
  // Récupérer l'employé
  const employee = await GetEmployeeById(id);
  if (!employee) throw new Error('Employé non trouvé');

  // Vérifier le mot de passe actuel
  const match = await bcrypt.compare(currentPassword, employee.password);
  if (!match) throw new Error('Mot de passe actuel incorrect');

  // Hasher le nouveau mot de passe
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Mettre à jour dans la base
  await db.query('UPDATE employes SET password = ? WHERE id = ?', [hashedPassword, id]);

  return { message: 'Mot de passe mis à jour avec succès' };
};

module.exports = {
  GetAllEmployees,
  GetEmployeeById,
  GetEmployeeByEmail,
  GetEmployeeByTel,
  GetEmployeeByIp,
  CreateEmployee,
  UpdateEmployee,
  ChangeRole,
  DeleteEmployee,
  countEmployees,
  countDepartments,
  countServices,
  SearchEmployeesAdvanced,
  GetAllDirections, 
  ChangePassword
};
