const {
  GetAllEmployees,
  GetEmployeeById,
  GetEmployeeByEmail,
  CreateEmployee,
  UpdateEmployee,
  ChangeRole,
  DeleteEmployee
} = require('../models/employeModel');

const { addHistorique } = require('../models/historiqueModel');

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
    // Si le rôle est admin, alors password est obligatoire
    if (newEmploye.role === 'admin' && !newEmploye.password) {
      return res.status(400).json({ message: 'Le mot de passe est obligatoire pour un admin' });
    }

    if (newEmploye.password) {
      // Hachage du mot de passe seulement si password est fourni
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newEmploye.password, saltRounds);
      newEmploye.password = hashedPassword;
    } else {
      // Si ce n'est pas un admin et pas de password, on peut gérer ça selon ton besoin
      // Par exemple, créer un mot de passe temporaire ou refuser la création
      newEmploye.password = null; // ou autre comportement
    }

    const createdEmploye = await CreateEmployee(newEmploye);

    // Ajouter un historique pour la création de l'employé
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

    // Récupérer les infos de l'utilisateur qui fait la modif
    const user = await GetEmployeeById(req.user.id);

    await addHistorique(
      req.user.id,
      'Mise à jour d employé',
      `Employé ${updatedEmploye.nom} mis à jour par ${user.prenom} ${user.nom}`
    );

    res.status(200).json(employe);
  } catch (error) {
    console.error('Erreur update:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'employé' });
  }
};


const remove = async (req, res) => {
  const { id } = req.params;

  try {
    // Récupérer l'employé à supprimer
    const employeToDelete = await GetEmployeeById(id);
    if (!employeToDelete) {
      return res.status(404).json({ message: 'Employé non trouvé' });
    }

    // Récupérer l'utilisateur qui fait la suppression pour avoir son nom/prenom
    const user = await GetEmployeeById(req.user.id);

    const result = await DeleteEmployee(id);
    if (result.affectedRows === 0) { 
      return res.status(404).json({ message: 'Employé non trouvé' });
    }

    // Ajouter un historique pour la suppression de l'employé
    await addHistorique(
      req.user.id,
      'Suppression d employé',
      `Employé ${employeToDelete.prenom} ${employeToDelete.nom} supprimé par ${user.prenom} ${user.nom}`
    );

    console.log(`Employé avec ID ${id} supprimé`);
    res.status(204).send();
  } catch (error) {
    console.error('Erreur remove:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'employé' });
  }
};




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
};





module.exports = {
  getAll,
  getById,
  getByEmail,
  create, 
  update,
  remove,
  switchRole
};
