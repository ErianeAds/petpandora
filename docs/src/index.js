require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const usuariosRoutes = require('./routes/usuarios');
const agendamentosRoutes = require('./routes/agendamentos');
const auth = require('./middleware/auth');
const db = require('./config/db');

const app = express();

// Configuração de CORS
const corsOptions = {
  origin: 'http://localhost:5500', // Origem do frontend
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Teste de conexão com banco, se existir função
if (db?.testConnection) db.testConnection();

// Rotas da API
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/agendamentos', agendamentosRoutes);

// Rota protegida (apenas se estiver usando autenticação)
app.use('/api/pets', auth, require('./routes/petRoutes'));

// Arquivos estáticos
app.use('/uploads', express.static('uploads')); // Imagens
app.use(express.static(path.join(__dirname, '../server'))); // Frontend

// Página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../docs/index.html'));
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API PetPandora funcionando!' });
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno no servidor' });
});

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});
