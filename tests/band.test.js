require('dotenv').config();
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Band = require('../models/band.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let token;
let testBandId;

beforeAll(async () => {
  // Connect to Mongo
  await mongoose.connect(process.env.MONGO_URI);

  // Clean up collections
  await User.deleteMany({});
  await Band.deleteMany({});

  // Create test user
  const hashedPassword = await bcrypt.hash('testpass123', 10);
  const user = await User.create({
    username: 'bandtester',
    email: 'band@test.com',
    password: hashedPassword,
    name: 'Band',
    surname: 'Tester',
    roles: ['user']
  });

  // Generate JWT token with correct secret
  token = jwt.sign(
    { userId: user._id.toString(), username: user.username, roles: user.roles },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}, 20000);

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Band CRUD Operations', () => {

  test('Create a new band (POST /api/bands)', async () => {
    const res = await request(app)
      .post('/api/bands')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Metallica',
        genre: 'Thrash Metal',
        country: 'USA',
        formationYear: 1981
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Metallica');
    expect(res.body.createdBy).toBeDefined();
    testBandId = res.body._id;
  });

  test('Get all bands (GET /api/bands)', async () => {
    const res = await request(app)
      .get('/api/bands')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('Get one band by ID (GET /api/bands/:id)', async () => {
    const res = await request(app)
      .get(`/api/bands/${testBandId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Metallica');
  });

  test('Update a band (PUT /api/bands/:id)', async () => {
    const res = await request(app)
      .put(`/api/bands/${testBandId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ genre: 'Heavy Metal' });

    expect(res.statusCode).toBe(200);
    expect(res.body.genre).toBe('Heavy Metal');
    expect(res.body._id).toBe(testBandId);
  });

  test('Delete a band (DELETE /api/bands/:id)', async () => {
    const res = await request(app)
      .delete(`/api/bands/${testBandId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);

    // Optional: verify it no longer exists
    const check = await Band.findById(testBandId);
    expect(check).toBeNull();
  });

});
