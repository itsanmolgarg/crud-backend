// getProfileById.test.js
const request = require('supertest');
const app = require('../../app');
const Profile = require('../../models/profile');

jest.mock('../../models/profile', () => ({
  findOne: jest.fn(),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('Get Profile by ID API', () => {
  test('GET /api/profile/:id - Profile not found', async () => {
    const profileId = 'nonexistent-id';
    Profile.findOne.mockResolvedValueOnce(null);

    const response = await request(app).get(`/api/profile/${profileId}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Profile not found');
    expect(Profile.findOne).toHaveBeenCalledWith({ _id: profileId });
  });

  test('GET /api/profile/:id - Internal server error', async () => {
    const profileId = 'invalid-id';
    Profile.findOne.mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app).get(`/api/profile/${profileId}`);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal server error');
    expect(Profile.findOne).toHaveBeenCalledWith({ _id: profileId });
  });

  test('GET /api/profile/:id - Profile found', async () => {
    const profileId = 'valid-id';
    const mockProfile = {
      _id: profileId,
      name: 'Mock Profile',
      // Add other profile properties as needed
    };
    Profile.findOne.mockResolvedValueOnce(mockProfile);

    const response = await request(app).get(`/api/profile/${profileId}`);

    expect(response.status).toBe(200);
    expect(response.body.profile).toEqual(mockProfile);
    expect(response.body.message).toBe('Profile found');
    expect(Profile.findOne).toHaveBeenCalledWith({ _id: profileId });
  });
});
