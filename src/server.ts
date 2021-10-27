import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());

const users = ['Julia', 'Paul', 'Anke', 'Samet'];

app.post('/api/users', (request, response) => {
  response.send(request.body.name);
});

app.delete('/api/users/:name', (request, response) => {
  const indexOfName = users.findIndex(
    (nameWanted) => nameWanted === request.params.name
  );
  if (indexOfName !== -1) {
    users.splice(indexOfName, 1);
    response.send(users);
  } else {
    response.status(404).send('not found');
  }
});

app.get('/api/users/:name', (request, response) => {
  const isNameKnow = users.includes(request.params.name);
  if (isNameKnow) {
    response.send(request.params.name);
  } else {
    response.status(404).send("Sorry can't find that!");
  }
});

app.get('/api/users', (_request, response) => {
  response.send(users);
});

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
