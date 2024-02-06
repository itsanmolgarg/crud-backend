// createProfile.test.js
const request = require('supertest');
const app = require('../../app');
const { connect, closeDatabase } = require('../testDb');

beforeAll(async () => {
  await connect();
});

afterAll(async () => {
  await closeDatabase();
});

describe('Create Profile API', () => {
  test('POST /api/profile - Create a new profile', async () => {
    const newProfile = {
      name: 'Test Name',
      image: 'Test Image',
    };

    const response = await request(app)
      .post('/api/profile')
      .send(newProfile);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Profile created successfully');
    expect(response.body.profile.name).toBe('Test Name');
    expect(response.body.profile.image).toBe('Test Image');
    expect(response.body.profile._id).toBeDefined();
  });

    test('POST /api/profile - Create a new profile without name', async () => {
        const newProfile = {
        image: 'Test Image',
        };
    
        const response = await request(app)
        .post('/api/profile')
        .send(newProfile);
    
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Name is required');
    });
});
