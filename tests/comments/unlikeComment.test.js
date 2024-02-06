// unlikeComment.test.js
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

describe("Un-Like Comment API", () => {
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
    votes: 10
    });

    await comment.save();
    commentId = comment._id.toString();
  });

  test('PUT /api/comments/:commentId/unlike - Successful Comment unLike', async () => {
    const response = await request(app).put(`/api/comments/${commentId}/unlike`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Comment un-liked successfully");
  });

  afterEach(async () => {
    // Clean up the database
    await Comment.deleteMany({});
  });
});
