// likeComment.test.js
const request = require("supertest");
const app = require("../../app");
const { connect, closeDatabase } = require("../testDb");
const Comment = require("../../models/comment");
const { ObjectId } = require("mongoose").Types;

// Establish database connection before running tests
beforeAll(async () => {
  await connect();
});

// Close database connection after all tests are complete
afterAll(async () => {
  await closeDatabase();
});

describe("Like Comment API", () => {
  let commentId;
  beforeEach(async () => {
    // Create a comment with an ID
    const comment = new Comment({
      _id: new ObjectId(),
      profile: new ObjectId(),
      user: new ObjectId(),
      mbti: "ISTJ",
      title: "Test Title",
      description: "Test Description",
    });

    await comment.save();
    commentId = comment._id.toString();
  });

  test('PUT /api/comments/:commentId/like - Successful Comment Like', async () => {
    const response = await request(app).put(`/api/comments/${commentId}/like`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Comment liked successfully");
  });

  afterEach(async () => {
    // Clean up the database
    await Comment.deleteMany({});
  });
});
