import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import { connectDatabase, getUsersCollection } from './utils/database';

if (!process.env.MONGODB_URI) {
  throw new Error('No MONGODB_URI provided');
}

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
// users push in database
app.post('/api/pushUsers', async (_request, response) => {
  await getUsersCollection().insertMany(users);
  response.send('upload successful');
});

app.post('/api/login', async (request, response) => {
  const findUser = request.body;
  const existingUser = await getUsersCollection().findOne({
    username: findUser.username,
    password: findUser.password,
  });

  if (existingUser) {
    response.setHeader('Set-Cookie', `username=${existingUser.username}`);
    response.send(`welcome,${existingUser.username}`);
  } else {
    response.status(401).send('Password or username incorrect. Try again!');
  }
});

app.post('/api/users/', async (request, response) => {
  const newUser = request.body;
  if (
    typeof newUser.name !== 'string' ||
    typeof newUser.username !== 'string' ||
    typeof newUser.password !== 'string'
  ) {
    response.status(400).send('Missing properties');
    return;
  }
  const userCollection = getUsersCollection();
  const existingUser = await userCollection.findOne({
    username: newUser.username,
  });

  if (!existingUser) {
    const userDocument = await userCollection.insertOne(newUser);
    response.send(`${newUser.name} added, with Id: ${userDocument.insertedId}`);
  } else {
    response.status(409).send('Username is already taken');
  }
});

app.get('/api/me', async (request, response) => {
  //const cookie = request.headers.cookie;
  const cookieName = request.cookies.username;
  const userNamefromDB = await getUsersCollection().findOne({
    username: cookieName,
  });

  if (userNamefromDB) {
    response.send(userNamefromDB);
  } else {
    response.status(404).send('User not found');
  }
});

app.delete('/api/users/:username', async (request, response) => {
  const urlName = request.params.username;
  const existingUser = await getUsersCollection().findOne({
    username: urlName,
  });

  if (existingUser) {
    getUsersCollection().deleteOne({ username: urlName });
    response.send(`${urlName} deleted`);
  } else {
    response.status(404).send('User not found');
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
app.get('/api/users', async (_request, response) => {
  const userDoc = await getUsersCollection().find().toArray();
  response.send(userDoc);
});

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

connectDatabase(process.env.MONGODB_URI).then(() =>
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  })
);
