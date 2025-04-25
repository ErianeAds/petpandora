const express = require('express');
const router = express.Router();
const db = require('../db'); // Supondo que você tenha um arquivo de conexão com o banco de dados
const bcrypt = require('bcrypt'); // Para criptografar senhas
const jwt = require('jsonwebtoken'); // Para gerar tokens JWT

// Cadastro de usuário
router.post('/cadastrar', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    // Verificar se os dados obrigatórios estão presentes
    if (!nome || !email || !senha) {
      return res.status(400).json({ sucesso: false, mensagem: 'Nome, email e senha são obrigatórios' });
    }

    // Verificar se o email já está cadastrado
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ sucesso: false, mensagem: 'Erro ao verificar email' });
      }

      if (results.length > 0) {
        return res.json({ sucesso: false, mensagem: 'Email já cadastrado' });
      }

      // Criptografando a senha antes de salvar no banco
      const hashedPassword = await bcrypt.hash(senha, 10);

      // Inserir novo usuário no banco de dados
      db.query('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', 
        [nome, email, hashedPassword], (err2) => {
          if (err2) {
            console.error(err2);
            return res.status(500).json({ sucesso: false, mensagem: 'Erro ao cadastrar usuário' });
          }

          res.json({ sucesso: true, mensagem: 'Cadastro realizado com sucesso' });
        }
      );
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro no servidor', erro: err.message });
  }
});

// Login de usuário
router.post('/login', (req, res) => {
  const { email, senha } = req.body;

  // Verificar se email e senha foram enviados
  if (!email || !senha) {
    return res.status(400).json({ sucesso: false, mensagem: 'Email e senha são obrigatórios' });
  }

  db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ sucesso: false, mensagem: 'Erro ao buscar usuário' });
    }

    if (results.length === 0) {
      return res.json({ sucesso: false, mensagem: 'Credenciais inválidas' });
    }

    const usuario = results[0];

    // Comparar a senha fornecida com a senha criptografada no banco
    const match = await bcrypt.compare(senha, usuario.senha);
    if (!match) {
      return res.json({ sucesso: false, mensagem: 'Credenciais inválidas' });
    }

    // Gerar um token JWT após login bem-sucedido
    const token = jwt.sign({ id: usuario.id, nome: usuario.nome }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      sucesso: true,
      mensagem: 'Login realizado com sucesso',
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email }
    });
  });
});

module.exports = router;
