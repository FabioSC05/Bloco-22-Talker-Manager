const fs = require('fs').promises;

const BAD = 400;
const UNAUTHORIZED = 401;

const readData = async () => {
  const data = await fs.readFile('./src/talker.json', 'utf-8');
  const result = JSON.parse(data);
  return result;
};

const writeData = async (file) => {
  await fs.writeFile('./src/talker.json', JSON.stringify(file));
};

const regexEmail = (email) => {
  const regex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]+$/;
  const result = regex.test(email);
  return result;
};

const regexDate = (date) => {
  const regex = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/;
  const result = regex.test(date);
  return result;
};

const checkToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(UNAUTHORIZED).json({ message: 'Token não encontrado' });
  }
  if (authorization.length !== 16 || typeof authorization !== 'string') {
    return res.status(UNAUTHORIZED).json({ message: 'Token inválido' });
  }
  next();
};

const checkName = (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return res.status(BAD).json({ message: 'O campo "name" é obrigatório' });
  }
  if (name.length < 3) {
    return res.status(BAD).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }
  next();
};

const checkAge = (req, res, next) => {
  const { age } = req.body;
  if (!age) {
    return res.status(BAD).json({ message: 'O campo "age" é obrigatório' });
  }
  if (age < 18) {
    return res.status(BAD).json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }
  next();
};

const checkTalk = (req, res, next) => {
  const { talk } = req.body;
  if (!talk) {
    return res.status(BAD).json({ message: 'O campo "talk" é obrigatório' });
  }
  next();
};

const checkWatched = (req, res, next) => {
  const { talk } = req.body;
  const { watchedAt } = talk;
  if (!watchedAt) {
    return res.status(BAD).json({ message: 'O campo "watchedAt" é obrigatório' });
  }
  if (!regexDate(watchedAt)) {
    return res.status(BAD).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
};

const checkRate = (req, res, next) => {
  const { talk } = req.body;
  const { rate } = talk;
  if (!rate) {
    return res.status(BAD).json({ message: 'O campo "rate" é obrigatório' });
  }
  if (!(Number.isInteger(rate)) || (rate < 1 || rate > 5)) {
    return res.status(BAD).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
  next();
};

module.exports = {
  readData,
  writeData,
  regexEmail,
  checkToken,
  checkName,
  checkAge,
  checkTalk,
  checkWatched,
  checkRate,
};
