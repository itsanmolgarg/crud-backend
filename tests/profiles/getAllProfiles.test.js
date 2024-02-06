// getAllProfiles.test.js
const request = require('supertest');
const app = require('../../app');
const Profile = require('../../models/profile');

jest.mock('../../models/profile', () => ({
  find: jest.fn(),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('Get All Profiles API', () => {
  test('GET /api/profile - Internal server error', async () => {
    Profile.find.mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app).get('/api/profile');

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal server error');
    expect(Profile.find).toHaveBeenCalled();
  });

  test('GET /api/profile - All profiles found', async () => {
    const mockProfiles = [
      {
        _id: '1',
        name: 'Profile 1',
      },
      {
        _id: '2',
        name: 'Profile 2',
      },
    ];
    Profile.find.mockResolvedValueOnce(mockProfiles);

    const response = await request(app).get('/api/profile');

    expect(response.status).toBe(200);
    expect(response.body.profiles).toEqual(mockProfiles);
    expect(response.body.message).toBe('All profiles found');
    expect(Profile.find).toHaveBeenCalled();
  });
});
