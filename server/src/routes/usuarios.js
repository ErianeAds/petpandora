const express = require('express');
const router = express.Router();
const db = require('../db');

// Cadastro
router.post('/cadastrar', (req, res) => {
  const { nome, email, senha } = req.body;
  db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
    if (results.length > 0) {
      return res.json({ sucesso: false, mensagem: 'Email já cadastrado' });
    }
    db.query('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', [nome, email, senha], (err2) => {
      if (err2) throw err2;
      res.json({ sucesso: true, mensagem: 'Cadastro realizado' });
    });
  });
});

// Login
router.post('/login', (req, res) => {
  const { email, senha } = req.body;
  db.query('SELECT * FROM usuarios WHERE email = ? AND senha = ?', [email, senha], (err, results) => {
    if (results.length > 0) {
      const usuario = results[0];
      res.json({ sucesso: true, usuario: { id: usuario.id, nome: usuario.nome } });
    } else {
      res.json({ sucesso: false, mensagem: 'Credenciais inválidas' });
    }
  });
});

module.exports = router;
