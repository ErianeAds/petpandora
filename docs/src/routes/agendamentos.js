const express = require('express');
const router = express.Router();
const db = require('../db'); // Supondo que você tenha um arquivo de conexão com o banco de dados

// Agendar um novo serviço
router.post('/agendar', async (req, res) => {
  try {
    const { usuario_id, pet, servico, data } = req.body;

    // Verificando se os dados necessários estão presentes
    if (!usuario_id || !pet || !servico || !data) {
      return res.status(400).json({ sucesso: false, mensagem: 'Todos os campos são obrigatórios' });
    }

    // Inserindo agendamento no banco de dados
    await db.query('INSERT INTO agendamentos (usuario_id, pet, servico, data) VALUES (?, ?, ?, ?)', 
      [usuario_id, pet, servico, data]);
    
    // Retorno de sucesso
    res.json({ sucesso: true, mensagem: 'Agendamento realizado com sucesso' });
  } catch (err) {
    // Erro de execução
    console.error(err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao realizar agendamento', erro: err.message });
  }
});

// Listar todos os agendamentos de um usuário
router.get('/listar_agendamentos', async (req, res) => {
  try {
    const { usuario_id } = req.query;

    if (!usuario_id) {
      return res.status(400).json({ sucesso: false, mensagem: 'Usuário ID é obrigatório' });
    }

    // Consultando agendamentos no banco de dados
    db.query('SELECT * FROM agendamentos WHERE usuario_id = ?', [usuario_id], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar agendamentos', erro: err.message });
      }

      res.json({ sucesso: true, agendamentos: results });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno', erro: err.message });
  }
});

// Excluir um agendamento
router.post('/deletar_agendamento', async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ sucesso: false, mensagem: 'ID do agendamento é obrigatório' });
    }

    // Excluindo agendamento no banco de dados
    db.query('DELETE FROM agendamentos WHERE id = ?', [id], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ sucesso: false, mensagem: 'Erro ao excluir agendamento', erro: err.message });
      }

      res.json({ sucesso: true, mensagem: 'Agendamento excluído com sucesso' });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno', erro: err.message });
  }
});

module.exports = router;
