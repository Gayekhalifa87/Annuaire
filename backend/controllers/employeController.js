const {
  GetAllEmployees,
  GetEmployeeById,
  GetEmployeeByEmail,
  CreateEmployee,
  UpdateEmployee,
  ChangeRole,
  SearchEmployeesAdvanced,
  DeleteEmployee,
  GetAllDirections
} = require('../models/employeModel');

const { addHistorique } = require('../models/historiqueModel');

const { addEmployeSupprime } = require('../models/employeSupprimeModel');

const db = require('../config/db'); // adapte le chemin selon ta structure





const bcrypt = require('bcrypt');

const getAll = async (req, res) => {
  try {
    const employes = await GetAllEmployees();
    res.status(200).json(employes);
  } catch (error) {
    console.error('Erreur getAll:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des employés' });
  }
};

const { countEmployees: countEmployeesModel } = require('../models/employeModel');

const countEmployees = async (req, res) => {
  try {
    const total = await countEmployeesModel();
    res.json({ total });
  } catch (error) {
    console.error('Erreur countEmployees:', error);
    res.status(500).json({ message: 'Erreur serveur lors du comptage' });
  }
};



const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const employe = await GetEmployeeById(id);
    if (!employe) {
      return res.status(404).json({ message: 'Employé non trouvé' });
    }
    res.status(200).json(employe);
  } catch (error) {
    console.error('Erreur getById:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'employé' });
  }
};

const getByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const employe = await GetEmployeeByEmail(email);
    if (!employe) {
      return res.status(404).json({ message: 'Employé non trouvé' });
    }
    res.status(200).json(employe);
  } catch (error) {
    console.error('Erreur getByEmail:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'employé' });
  }
};

const create = async (req, res) => {
  const newEmploye = req.body;

  try {
    if (newEmploye.role === 'admin' && !newEmploye.password) {
      return res.status(400).json({ message: 'Le mot de passe est obligatoire pour un admin' });
    }

    if (newEmploye.password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newEmploye.password, saltRounds);
      newEmploye.password = hashedPassword;
    } else {
      newEmploye.password = null;
    }

    const createdEmploye = await CreateEmployee(newEmploye);

    // Récupérer l'utilisateur qui fait la requête (connecté)
    const user = req.user;

    await addHistorique(
      createdEmploye.id,
      'Création d\'employé',
      `Employé ${createdEmploye.prenom} ${createdEmploye.nom} créé par ${user.prenom} ${user.nom}`
    );

    res.status(201).json(createdEmploye);
  } catch (error) {
    console.error('Erreur create:', error);
    res.status(500).json({ message: 'Erreur lors de la création de l\'employé' });
  }
};



const update = async (req, res) => {
  const { id } = req.params;
  const updatedEmploye = req.body;

  try {
  const employe = await UpdateEmployee(id, updatedEmploye);
  if (!employe) {
    return res.status(404).json({ message: 'Employé non trouvé' });
  }

  if (req.user && req.user.id) {
    const user = await GetEmployeeById(req.user.id);
    if (user) {
      await addHistorique(
        req.user.id,
        'Mise à jour d employé',
        `Employé ${updatedEmploye.nom} mis à jour par ${user.prenom} ${user.nom}`
      );
    }
  }

  res.status(200).json(employe);
} catch (error) {
  console.error('Erreur update:', error);
  res.status(500).json({ message: error.message || 'Erreur lors de la mise à jour de l\'employé' });
}

};




const remove = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // ID de celui qui supprime

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // Récupérer l'employé à supprimer
    const [rowsEmp] = await connection.query('SELECT * FROM employes WHERE id = ?', [id]);
    if (rowsEmp.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Employé non trouvé' });
    }
    const employeToDelete = rowsEmp[0];

    // Archiver l'employé supprimé
   await connection.query(
  `INSERT INTO employes_supprimes 
  (employe_id, nom, prenom, email, telephone, ip, role, poste, direction, service, date_creation, date_modif, date_suppression, supprime_par)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
  [
    employeToDelete.id,
    employeToDelete.nom,
    employeToDelete.prenom,
    employeToDelete.email,
    employeToDelete.telephone,
    employeToDelete.ip,
    employeToDelete.role,
    employeToDelete.poste,
    employeToDelete.direction,
    employeToDelete.service,
    employeToDelete.date_creation,
    employeToDelete.date_modif,
    userId
  ]
);


    // Récupérer et archiver tous les historiques liés
    const [historiques] = await connection.query('SELECT * FROM historiques WHERE employe_id = ?', [id]);
    for (const h of historiques) {
      await connection.query(
        `INSERT INTO historiques_supprimes
        (employe_id, action, details, date_action, date_suppression, supprime_par)
        VALUES (?, ?, ?, ?, NOW(), ?)`,
        [h.employe_id, h.action, h.details, h.date_action, userId]
      );
    }

    // Supprimer les historiques originaux
    await connection.query('DELETE FROM historiques WHERE employe_id = ?', [id]);

    // Supprimer l'employé
    const [result] = await connection.query('DELETE FROM employes WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Employé non trouvé' });
    }

    await connection.commit();
    res.status(204).send();

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Erreur remove:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'employé' });
  } finally {
    if (connection) connection.release();
  }
};



/* 
const switchRole = async (req, res) => {
  const { id } = req.params;

  try {
    // Récupérer l'employé dont on change le rôle
    const employe = await GetEmployeeById(id);
    if (!employe) {
      return res.status(404).json({ message: 'Employé non trouvé' });
    }

    // Récupérer l'utilisateur qui fait la modification (pour nom/prénom dans l'historique)
    const user = await GetEmployeeById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const currentRole = employe.role;
    console.log("Rôle actuel:", currentRole);

    let newRole;
    if (currentRole === 'user') {
      newRole = 'admin';
    } else if (currentRole === 'admin') {
      newRole = 'user';
    } else {
      return res.status(400).json({ message: 'Rôle non reconnu pour le switch' });
    }

    const updatedEmploye = await ChangeRole(id, newRole);
    if (!updatedEmploye) {
      return res.status(500).json({ message: "La mise à jour du rôle a échoué" });
    }

    // Ajouter un historique pour le changement de rôle
    await addHistorique(
      req.user.id,
      'Changement de rôle',
      `Rôle de l'employé ${employe.prenom} ${employe.nom} changé  par ${user.prenom} ${user.nom}`
    );

    res.status(200).json({
      message: `Rôle changé de ${currentRole} à ${newRole}`,
      employe: updatedEmploye
    });

  } catch (error) {
    console.error('Erreur switchRole:', error.message, error.stack);
    res.status(500).json({ message: 'Erreur lors du changement de rôle de l\'employé' });
  }
}; */

const switchRole = async (req, res) => {
  const { id } = req.params;

  console.log("👉 Requête reçue pour changer le rôle de l'employé:", id);
  console.log("👉 Utilisateur connecté (req.user):", req.user);

  try {
    // Vérification des paramètres
    if (!id) {
      console.error("❌ Aucun ID d'employé fourni");
      return res.status(400).json({ message: 'ID employé manquant' });
    }

    // Récupérer l'employé dont on change le rôle
    const employe = await GetEmployeeById(id);
    if (!employe) {
      console.warn(`⚠️ Employé avec ID ${id} non trouvé`);
      return res.status(404).json({ message: 'Employé non trouvé' });
    }
    console.log("✅ Employé trouvé:", employe);

    // Vérifier l'utilisateur qui effectue la modification
    if (!req.user || !req.user.id) {
      console.error("❌ req.user est undefined ou invalide:", req.user);
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const user = await GetEmployeeById(req.user.id);
    if (!user) {
      console.warn(`⚠️ Utilisateur connecté ID ${req.user.id} non trouvé dans la DB`);
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    console.log("✅ Utilisateur modificateur trouvé:", user);

    // Déterminer le nouveau rôle
    const currentRole = employe.role;
    console.log("🔍 Rôle actuel:", currentRole);

    let newRole;
    if (currentRole === 'user') {
      newRole = 'admin';
    } else if (currentRole === 'admin') {
      newRole = 'user';
    } else {
      console.error("❌ Rôle non reconnu:", currentRole);
      return res.status(400).json({ message: 'Rôle non reconnu pour le switch' });
    }

    // Mise à jour du rôle
    console.log(`🔄 Tentative de mise à jour du rôle: ${currentRole} -> ${newRole}`);
    const updatedEmploye = await ChangeRole(id, newRole);
    if (!updatedEmploye) {
      console.error("❌ La mise à jour du rôle a échoué pour l'employé:", id);
      return res.status(500).json({ message: "La mise à jour du rôle a échoué" });
    }
    console.log("✅ Mise à jour réussie:", updatedEmploye);

    // Ajouter un historique pour le changement de rôle
    try {
      await addHistorique(
        req.user.id,
        'Changement de rôle',
        `Rôle de l'employé ${employe.prenom} ${employe.nom} changé par ${user.prenom} ${user.nom}`
      );
      console.log("📝 Historique ajouté avec succès");
    } catch (histErr) {
      console.error("⚠️ Erreur lors de l'ajout à l'historique:", histErr.message);
    }

    res.status(200).json({
      message: `Rôle changé de ${currentRole} à ${newRole}`,
      employe: updatedEmploye
    });

  } catch (error) {
    console.error('💥 Erreur switchRole (catch principal):', error.message);
    console.error(error.stack);
    res.status(500).json({ message: 'Erreur lors du changement de rôle de l\'employé', error: error.message });
  }
};



const searchAdvanced = async (req, res) => {
  try {
    const filters = req.query;  
    const results = await SearchEmployeesAdvanced(filters);
    res.status(200).json(results);
  } catch (error) {
    console.error('Erreur searchAdvanced:', error);
    res.status(500).json({ message: 'Erreur lors de la recherche avancée' });
  }
};


const getAllDirections = async (req, res) => {
  try {
    const directions = await GetAllDirections();
    res.status(200).json(directions);
  } catch (error) {
    console.error('Erreur getAllDirections:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des directions' });
  }
};

module.exports = {
  getAll,
  getById,
  getByEmail,
  create, 
  update,
  remove,
  switchRole,
  countEmployees,
  countEmployees,
  searchAdvanced,
  getAllDirections
};
