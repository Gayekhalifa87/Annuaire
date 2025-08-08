const {
  GetAllEmployees,
  GetEmployeeById,
  CreateEmployee,
  UpdateEmployee,
  ChangeRole,
  DeleteEmployee
} = require('../models/employeModel');

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

const create = async (req, res) => {
  const newEmploye = req.body;
  try {
    const createdEmploye = await CreateEmployee(newEmploye);
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
    res.status(200).json(employe);
  } catch (error) {
    console.error('Erreur update:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'employé' });
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await DeleteEmployee(id);
    if (result.affectedRows === 0) {  // result est l'objet renvoyé par db.query
      return res.status(404).json({ message: 'Employé non trouvé' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Erreur remove:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'employé' });
  }
};

const switchRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  try {
    const employe = await GetEmployeeById(id);
    if (!employe) {
      return res.status(404).json({ message: 'Employé non trouvé' });
    }
    const updatedEmploye = await ChangeRole(id, role);
    res.status(200).json(updatedEmploye);
  } catch (error) {
    console.error('Erreur switchRole:', error);
    res.status(500).json({ message: 'Erreur lors du changement de rôle de l\'employé' });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  switchRole
};
