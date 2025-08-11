// Importation des modules nécessaires
const express = require('express'); 

const cors = require('cors');       

const authenticateToken = require('./Middlewares/authMiddleware'); // Middleware pour vérifier les tokens JWT

 // Middleware pour afficher les requêtes HTTP dans la console
const morgan = require('morgan');  

require('dotenv').config();

// Importation des routes
const employeRoutes = require('./routes/employeRoute');       
const historiqueRoutes = require('./routes/historiqueRoute'); 
const authRoutes = require('./routes/authRoute');

// Création de l'application Express
const app = express();



// Autorise les requêtes venant d'autres domaines (utile pour le frontend)
app.use(cors());

// Permet à Express de comprendre les données JSON dans les requêtes
app.use(express.json());

// Affiche les requêtes dans la console pour faciliter le débogage
app.use(morgan('dev'));


// Route pour la connexion des employés

app.use('/api', authRoutes);

// Applique le middleware d'authentification à toutes les routes suivantes
app.use(authenticateToken); 

app.use('/api', employeRoutes);


app.use('/api', historiqueRoutes);




// Route d'accueil pour tester si l'API fonctionne
app.get('/', (req, res) => {
  res.send('🎉 Bienvenue dans l\'API Annuaire');
});



app.use((req, res, next) => {
  res.status(404).json({ message: '❌ Route non trouvée' });
});

// Si une erreur survient dans le serveur, on l'affiche ici
app.use((err, req, res, next) => {
  console.error('💥 Erreur serveur :', err.stack); 
  res.status(500).json({ message: 'Erreur interne du serveur' });
});


// On récupère le port depuis .env ou on utilise 3000 par défaut
const PORT = process.env.PORT || 3000;

// Le serveur démarre et écoute les requêtes
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});

// Export de l'application pour les tests ou d'autres utilisations
module.exports = app;
