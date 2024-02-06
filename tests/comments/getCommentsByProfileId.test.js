// getCommentsByProfileId.test.js
const request = require("supertest");
const app = require("../../app");
const { connect, closeDatabase } = require("../testDb");
const Comment = require("../../models/comment");
const Profile = require("../../models/profile");
const { ObjectId } = require("mongoose").Types;

// Establish database connection before running tests
beforeAll(async () => {
  await connect();
});

// Close database connection after all tests are complete
afterAll(async () => {
  await closeDatabase();
});

describe("Get Comments By Profile ID API", () => {
  let profileId;
  let userId;
  beforeEach(async () => {
    // Create a new profile
    const profile = new Profile({
      _id: new ObjectId(),
      name: "Test Profile",
      image: "Test Image",
    });
    await profile.save();
    profileId = profile._id.toString();

    const user = new Profile({
      _id: new ObjectId(),
      name: "Test Profile",
      image: "Test Image",
    });
    await user.save();
    userId = user._id.toString();

    // Create some comments associated with the profile
    const comments = [
      { profile: profileId, user: userId, mbti: "INTJ", likes: 10 },
      { profile: profileId, user: userId, zodiac: "Aries", likes: 5 },
      { profile: profileId, user: userId, enneagram: "5", likes: 8 },
    ];
    await Comment.insertMany(comments);
  });

  test("GET /api/comments/profile/:profileId - Successful Retrieval", async () => {
    const response = await request(app).get(
      `/api/comments/profile/${profileId}`
    );

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Comments found");
    expect(response.body.comments).toHaveLength(3);
  });

  test("GET /api/comments/profile/:profileId - Profile Not Found", async () => {
    const nonExistentProfileId = new ObjectId();
    const response = await request(app).get(
      `/api/comments/profile/${nonExistentProfileId}`
    );

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Profile not found");
  });

  test("GET /api/comments/profile/:profileId - Filtering by MBTI", async () => {
    const response = await request(app).get(
      `/api/comments/profile/${profileId}?filter=mbti`
    );

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Comments found");
    expect(response.body.comments).toHaveLength(1);
    expect(response.body.comments[0].mbti).toBeDefined();
  });

  test("GET /api/comments/profile/:profileId - Filtering by Zodiac", async () => {
    const response = await request(app).get(
      `/api/comments/profile/${profileId}?filter=zodiac`
    );

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Comments found");
    expect(response.body.comments).toHaveLength(1);
    expect(response.body.comments[0].zodiac).toBeDefined();
  });

  test("GET /api/comments/profile/:profileId - Filtering by Enneagram", async () => {
    const response = await request(app).get(
      `/api/comments/profile/${profileId}?filter=enneagram`
    );

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Comments found");
    expect(response.body.comments).toHaveLength(1);
    expect(response.body.comments[0].enneagram).toBeDefined();
  });

  test("GET /api/comments/profile/:profileId - Sorting by Date", async () => {
    const response = await request(app).get(
      `/api/comments/profile/${profileId}?sortBy=date`
    );

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Comments found");
    expect(response.body.comments).toHaveLength(3);
    // Ensure comments are sorted by creation date in descending order
    const createdAt = response.body.comments.map(
      (comment) => comment.createdAt
    );
    const isSorted = createdAt.every(
      (date, index) => index === 0 || date >= createdAt[index - 1]
    );
    expect(isSorted).toBe(true);
  });

  test("GET /api/comments/profile/:profileId - Internal Server Error Handling", async () => {
    // Simulate internal server error by providing an invalid profile ID
    const invalidProfileId = "invalidId";
    const response = await request(app).get(
      `/api/comments/profile/${invalidProfileId}`
    );

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Internal server error");
  });

  // Add more test cases as needed...

  afterEach(async () => {
    // Clean up the database
    await Comment.deleteMany({});
    await Profile.deleteMany({});
  });
});
