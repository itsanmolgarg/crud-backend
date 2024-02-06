// createComment.test.js
const request = require("supertest");
const app = require("../../app");
const { connect, closeDatabase } = require("../testDb");
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

describe("Create Comment API", () => {
  let profileId;
  let userId;

  beforeEach(async () => {
    // Create a new profile and user with IDs
    const profile = new Profile({
      _id: new ObjectId(),
      name: "Profile1",
      image: "Random image",
    }); // Use ObjectId for _id
    const user = new Profile({
      _id: new ObjectId(),
      name: "Profile 2",
      image: "Random image",
    }); // Use ObjectId for _id
    await profile.save();
    await user.save();
    profileId = profile._id.toString();
    userId = user._id.toString();
  });

  test("POST /api/comments - Successful Comment Creation", async () => {
    const requestBody = {
      profileId,
      userId,
      mbti: "ISTJ",
      title: "Test Title",
      description: "Test Description",
    };

    const response = await request(app).post("/api/comments").send(requestBody);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Comment created successfully");
    expect(response.body.comment.profile).toBe(profileId);
    expect(response.body.comment.user).toBe(userId);
    expect(response.body.comment.mbti).toBe("ISTJ");
    expect(response.body.comment.title).toBe("Test Title");
    expect(response.body.comment.description).toBe("Test Description");
  });

  test("POST /api/comments - Missing Profile ID", async () => {
    const requestBody = {
      userId,
      mbti: "ISTJ",
      title: "Test Title",
      description: "Test Description",
    };

    const response = await request(app).post("/api/comments").send(requestBody);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Profile id and user id are required");
  });

  test("POST /api/comments - Missing User ID", async () => {
    const requestBody = {
      profileId,
      mbti: "ISTJ",
      title: "Test Title",
      description: "Test Description",
    };

    const response = await request(app).post("/api/comments").send(requestBody);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Profile id and user id are required");
  });

  test("POST /api/comments - Empty Request Body", async () => {
    const response = await request(app).post("/api/comments").send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Profile id and user id are required");
  });

  test("POST /api/comments - No Personality Type or Content Provided", async () => {
    const requestBody = {
      profileId,
      userId,
    };

    const response = await request(app).post("/api/comments").send(requestBody);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "At least one personality type or content is required"
    );
  });

  test("POST /api/comments - Profile Not Found", async () => {
    const requestBody = {
      profileId: new ObjectId(),
      userId,
      mbti: "ISTJ",
      title: "Test Title",
      description: "Test Description",
    };

    const response = await request(app).post("/api/comments").send(requestBody);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Profile not found");
  });

  test("POST /api/comments - User Not Found", async () => {
    const requestBody = {
      profileId,
      userId: new ObjectId(),
      mbti: "ISTJ",
      title: "Test Title",
      description: "Test Description",
    };

    const response = await request(app).post("/api/comments").send(requestBody);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("User not found");
  });

  // Add more test cases as needed...

  afterEach(async () => {
    // Clean up the database
    await Profile.deleteMany({});
  });
});
