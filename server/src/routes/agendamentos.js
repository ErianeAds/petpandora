const express = require('express');
const router = express.Router();
const db = require('../db');

// Agendar
router.post('/agendar', (req, res) => {
  const { usuario_id, pet, servico, data } = req.body;
  db.query('INSERT INTO agendamentos (usuario_id, pet, servico, data) VALUES (?, ?, ?, ?)', [usuario_id, pet, servico, data], (err) => {
    if (err) throw err;
    res.json({ sucesso: true, mensagem: 'Agendamento realizado' });
  });
});

// Listar agendamentos
router.get('/listar_agendamentos', (req, res) => {
  const { usuario_id } = req.query;
  db.query('SELECT * FROM agendamentos WHERE usuario_id = ?', [usuario_id], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Excluir agendamento
router.post('/deletar_agendamento', (req, res) => {
  const { id } = req.body;
  db.query('DELETE FROM agendamentos WHERE id = ?', [id], (err) => {
    if (err) throw err;
    res.json({ sucesso: true, mensagem: 'Agendamento excluído' });
  });
});

module.exports = router;
