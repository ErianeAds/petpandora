const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');


const usuariosRoutes = require('../src/routes/usuarios');
const agendamentosRoutes = require('../src/routes/agendamentos');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/agendamentos', agendamentosRoutes);

app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));
