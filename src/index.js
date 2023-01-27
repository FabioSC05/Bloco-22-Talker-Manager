const express = require('express');
const {
  readData,
  writeData,
  regexEmail,
  checkToken,
  checkName,
  checkAge,
  checkTalk,
  checkWatched,
  checkRate,
} = require('./helpers');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const CREATED = 201;
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
  if (!regexEmail(email)) {
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

app.post('/talker',
  checkToken,
  checkName,
  checkAge,
  checkTalk,
  checkWatched,
  checkRate,
async (req, res) => {
  const { name, age, talk } = req.body;
  const read = await readData();
  const object = {
    id: read.length + 1,
    name,
    age,
    talk,
  };
  read.push(object);
  await writeData(read);
  return res.status(CREATED).json(object);
});

app.put('/talker/:id',
  checkToken,
  checkName,
  checkAge,
  checkTalk,
  checkWatched,
  checkRate,
async (req, res) => {
  const { id } = req.params;
  const { name, age, talk } = req.body;
  const read = await readData();
  const removeId = read.filter((num) => num.id !== Number(id));
  const object = {
    id: Number(id),
    name,
    age,
    talk,
  };
  removeId.push(object);
  removeId.sort((a, b) => a.id - b.id);
  await writeData(removeId);
  return res.status(HTTP_OK_STATUS).json(object);
});

/* app.delete('/talker/:id',
  checkToken,
async (req, res) => {
  const { id } = req.params;
  const read = await readData();
  const removeId = read.filter((num) => num.id !== Number(id));
  removeId.sort((a, b) => a.id - b.id);
  await writeData(removeId);
  return res.status(HTTP_OK_STATUS).json(object);
}); */
