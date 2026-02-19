require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middlewares
const defaultAllowedOrigins = [
  'http://localhost:4200',
  'http://localhost:5173',
  'https://mp-front-end-black.vercel.app',
];

const allowedOriginsFromEnv = (process.env.ALLOWED_ORIGINS || process.env.CORS_ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = allowedOriginsFromEnv.length ? allowedOriginsFromEnv : defaultAllowedOrigins;

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

// Conexión a MongoDB
if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a MongoDB.'))
    .catch(err => {
      console.error('Error al conectar a MongoDB:', err);
    });
}

// Rutas
const institucionRoutes = require('./routes/institucion.routes');
app.use('/api/instituciones', institucionRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// Para desarrollo local
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

// Exportar para Vercel
module.exports = app;
