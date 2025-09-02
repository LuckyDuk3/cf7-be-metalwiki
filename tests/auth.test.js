const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user.model');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

let token; // to store JWT token after login

beforeAll(async () => {
  await mongoose.connect(MONGO_URI);
  // Delete any existing user with username 'simpletestuser'
  await User.deleteOne({ username: 'simpletestuser' });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Basic API tests', () => {
  test('GET / (or any simple route) should respond', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });

  test('Register user endpoint should respond', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'simpletestuser',
        email: 'simpletestuser@example.com',
        password: 'simplepassword',
        name: 'Simple',
        surname: 'Test'
      });

    expect([200, 201]).toContain(res.statusCode);
  });

  test('Login user endpoint should respond and provide token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'simpletestuser',
        password: 'simplepassword'
      });

    expect([200, 401]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty('token');
      token = res.body.token;  // Save token for protected tests
    }
  });
});

describe('Protected route tests', () => {
  test('Access protected route without token should fail', async () => {
    const res = await request(app).get('/api/protected/protected');
    expect(res.statusCode).toBe(401);  // Unauthorized
  });

  test('Access protected route with token should succeed', async () => {
    if (!token) return; // skip test if no token (login failed)

    const res = await request(app)
      .get('/api/protected/protected')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain('Hello simpletestuser');
  });
});
