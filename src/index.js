import express from 'express';
import { faker } from '@faker-js/faker';

const PORT = 31337;

const app = express();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PATCH',
  'Access-Control-Allow-Headers': 'Content-Type, Baggage, Sentry-Trace',
};

const getRandomUser = () => ({
  userId: faker.string.uuid(),
  username: faker.internet.userName(),
  email: faker.internet.email(),
  avatar: faker.image.avatar(),
  password: faker.internet.password(),
  birthdate: faker.date.birthdate(),
  registeredAt: faker.date.past(),
});

const USER_COUNT = 100;

const users = faker.helpers.multiple(getRandomUser, {
  count: USER_COUNT,
});

app.use(express.json());
app.use((_, res, next) => {
  res.set(corsHeaders);
  next();
});

app.get('/', (_, res) => {
  res.json({ message: 'Hello from server!!!' });
});

app.get('/users', (req, res) => {
  const limit = Number(req.query.limit);

  if (limit) {
    res.json(users.slice(0, limit));
  } else {
    res.json(users);
  }
});

app.get('/users/:id', (req, res) => {
  const { id } = req.params;

  if (!users[id]) {
    res.status(404).json({ message: 'User not found' });
  }

  res.json(users[id]);
});

app.patch('/patch', (req, res) => {
  console.log(`Received PATCH request: ${JSON.stringify(req.body)}`);

  res.json({ message: 'Successful PATCH request to server' });
});

app.listen(PORT, () => {
  console.log(`Server is listening for connections on port ${PORT}`);
});
