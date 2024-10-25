const express = require('express');
const path = require('path');
const productRoutes = require('./routes/product');

const app = express();
const port = 3000;  // Assurez-vous que le port est bien défini

// Middleware CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Middleware pour les fichiers statiques
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.static('images'));

// Middleware pour parser les données
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

module.exports = app;
