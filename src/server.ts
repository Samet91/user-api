import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();
const port = 3000;

app.use((request, _response, next) => {
  console.log('Request received', request.url);
  next();
});

//Middleware for parsing application/json
app.use(express.json());
//Middleware for parsing cookies
app.use(cookieParser());

const users = [
  {
    name: 'Iva',
    username: 'iva94',
    password: '123',
  },
  {
    name: 'Walied',
    username: 'walied91',
    password: '12345',
  },
  {
    name: 'Samet',
    username: 'samet91',
    password: '12346',
  },
  {
    name: 'Muhamed',
    username: 'muhamed95',
    password: '12347',
  },
];
app.get('/api/me', (request, response) => {
  const username = request.cookies.username;
  const foundUser = users.find((user) => user.username === username);
  if (foundUser) {
    response.send(foundUser);
  } else {
    response.status(404).send('User not found');
  }
});

app.post('/api/login', (request, response) => {
  const findUser = request.body;
  const existingUser = users.find(
    (user) =>
      user.username === findUser.username && user.password === findUser.password
  );

  if (existingUser) {
    response.setHeader('Set-Cookie', `username=${existingUser.username}`);
    response.send('Logged in');
  } else {
    response.status(401).send('Password or username incorrect. Try again!');
  }
});

app.post('/api/users/', (request, response) => {
  const newUser = request.body;
  if (
    typeof newUser.name !== 'string' ||
    typeof newUser.username !== 'string' ||
    typeof newUser.password !== 'string'
  ) {
    response.status(400).send('Missing properties');
    return;
  }
  if (users.some((user) => user.username === newUser.username)) {
    response.status(409).send('User already exists.');
  } else {
    users.push(newUser);
    response.send(`${newUser.name} added.`);
  }
});

app.delete('/api/users/:username', (request, response) => {
  const deleteUser = users.findIndex(
    (user) => user.username === request.params.username
  );
  if (deleteUser !== -1) {
    users.splice(deleteUser, 1);
    response.send('Deleted');
  } else {
    response.status(404).send('not found');
  }
});

app.get('/api/users/:username', (request, response) => {
  const user = users.find((user) => user.username === request.params.username);
  if (user) {
    response.send(user);
  } else {
    response.status(404).send('This page is not here.');
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
