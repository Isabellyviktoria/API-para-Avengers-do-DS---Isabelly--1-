// Nome do Aluno: Isabelly Victoria de Souza Silva
import express from 'express';
import { jogadores } from './jogadores.js';

const app = express();
app.use(express.json());

app.get('/jogadores', (req, res) => {
  res.status(200).json(jogadores);
});

app.get('/jogadores/maior-salario', (req, res) => {
  if (jogadores.length === 0) {
    return res.status(404).json({ mensagem: "Nenhum jogador cadastrado." });
  }

  const maiorSalario = jogadores.reduce((maior, atual) => {
    return atual.salario > maior.salario ? atual : maior;
  });

  res.status(200).json(maiorSalario);
});

app.get('/jogadores/camisa/:numcamisa', (req, res) => {
  const numcamisa = parseInt(req.params.numcamisa);
  const jogadorEncontrado = jogadores.find(j => j.numcamisa === numcamisa);

  if (!jogadorEncontrado) {
    return res.status(404).json({ mensagem: "Jogador não encontrado com essa camisa." });
  }

  res.status(200).json(jogadorEncontrado);
});

// 4. GET - Listar por posicao
app.get('/jogadores/posicao/:posicao', (req, res) => {
  const posicao = req.params.posicao.toLowerCase();
  const filtrados = jogadores.filter(j => j.posicao.toLowerCase() === posicao);

  if (filtrados.length === 0) {
    return res.status(404).json({ mensagem: "Nenhum jogador encontrado nessa posição." });
  }

  res.status(200).json(filtrados);
});

app.post('/jogadores', (req, res) => {
  const { jogador, posicao, numcamisa, salario } = req.body;

  const camisaExiste = jogadores.some(j => j.numcamisa === numcamisa);
  if (camisaExiste) {
    return res.status(400).json({ mensagem: "Já existe um jogador com este número de camisa." });
  }

  const novoJogador = {
    jogador,
    posicao,
    numcamisa,
    salario
  };

  jogadores.push(novoJogador);
  res.status(201).json({ mensagem: "Jogador cadastrado com sucesso!", jogador: novoJogador });
});

app.put('/jogadores/:numcamisa', (req, res) => {
  const numcamisa = parseInt(req.params.numcamisa);
  const { jogador, posicao, salario } = req.body;

  const index = jogadores.findIndex(j => j.numcamisa === numcamisa);

  if (index === -1) {
    return res.status(404).json({ mensagem: "Jogador não encontrado para atualização." });
  }

  jogadores[index] = {
    jogador: jogador || jogadores[index].jogador,
    posicao: posicao || jogadores[index].posicao,
    numcamisa: numcamisa,
    salario: salario || jogadores[index].salario
  };

  res.status(200).json({ mensagem: "Jogador atualizado com sucesso!", jogador: jogadores[index] });
});

app.delete('/jogadores/:numcamisa', (req, res) => {
  const numcamisa = parseInt(req.params.numcamisa);
  const index = jogadores.findIndex(j => j.numcamisa === numcamisa);

  if (index === -1) {
    return res.status(404).json({ mensagem: "Jogador não encontrado para exclusão." });
  }

  const removido = jogadores.splice(index, 1);
  res.status(200).json({ mensagem: "Jogador removido com sucesso!", jogador: removido[0] });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});