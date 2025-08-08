const {
  getAllHistorique,
  getHistoriqueById
} = require('../models/historiqueModel');

const getHisto = async (req, res) => {
  try {
    const historiques = await getAllHistorique();
    res.status(200).json(historiques);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des historiques' });
  }
}

const getHistoById = async (req, res) => {
  const { id } = req.params;
  try {
    const historique = await getHistoriqueById(id);
    if (!historique) {
      return res.status(404).json({ message: 'Historique non trouvé' });
    }
    res.status(200).json(historique);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'historique' });
  }
}

module.exports = {
  getHisto,
  getHistoById
};
