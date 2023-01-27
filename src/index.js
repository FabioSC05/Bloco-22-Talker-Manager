const express = require('express');
const fs = require('fs').promises;

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
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

app.get('/talker', async (req, res) => {
  const read = await readData();
  return res.status(HTTP_OK_STATUS).json(read);
});
