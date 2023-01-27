const express = require('express');
const fs = require('fs').promises;

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const BAD = 400;
const NOT = 404;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar.
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

const readData = async () => {
  const data = await fs.readFile('./src/talker.json', 'utf-8');
  const result = JSON.parse(data);
  return result;
};

const regex = (email) => {
  const regexEmail = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]+$/;
  const result = regexEmail.test(email);
  return result;
};

app.get('/talker', async (req, res) => {
  const read = await readData();
  return res.status(HTTP_OK_STATUS).json(read);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const read = await readData();
  const number = read.find((num) => num.id === Number(id));
  if (number) {
    return res.status(HTTP_OK_STATUS).json(number);
  }
  return res.status(NOT).json({ message: 'Pessoa palestrante não encontrada' });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const partA = Math.random().toString(16).substring(2);
  const partB = Math.random().toString(16).substring(2);
  const token = (partA + partB).substring(0, 16);
  if (!email) {
    return res.status(BAD).json({ message: 'O campo "email" é obrigatório' });
  }
  if (!regex(email)) {
    return res.status(BAD).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  if (!password) {
    return res.status(BAD).json({ message: 'O campo "password" é obrigatório' });
  }
  if (password.length < 6) {
    return res.status(BAD).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  return res.status(HTTP_OK_STATUS).json({ token });
});
