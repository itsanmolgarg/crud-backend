const Comment = require("../../models/comment");
const Profile = require("../../models/profile");

const createComment = async (req, res) => {
  try {
    const { profileId, userId, mbti, zodiac, enneagram, title, description } =
      req.body;

    if (!profileId || !userId) {
      return res
        .status(400)
        .json({ message: "Profile id and user id are required" });
    }

    const isPersonalityTypeProvided = mbti || zodiac || enneagram;
    const isContentProvided = title || description;

    if (!isPersonalityTypeProvided && !isContentProvided) {
      return res.status(400).json({
        message: "At least one personality type or content is required",
      });
    }

    const profile = await Profile.findOne({ _id: profileId });
    if (!profile) {
      return res.status(400).json({ message: "Profile not found" });
    }

    const user = await Profile.findOne({ _id: userId });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Create the new comment
    const comment = await Comment.create({
      profile: profileId,
      user: userId,
      mbti,
      zodiac,
      enneagram,
      title,
      description,
    });
    // Return success response
    res.status(201).json({ message: "Comment created successfully", comment });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const likeComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    await Comment.updateOne({ _id: commentId }, { $inc: { likes: 1 } });

    res.status(200).json({ message: "Comment liked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const unlikeComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    await Comment.updateOne({ _id: commentId }, { $inc: { likes: -1 } });
    res.status(200).json({ message: "Comment un-liked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCommentsByProfileId = async (req, res) => {
  try {
    const profileId = req?.params?.profileId;
    const profile = await Profile.findOne({ _id: profileId });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const { filter, sortBy } = req.query;

    const query = { profile: profileId };

    // Apply filtering based on the provided filter parameter
    switch (filter) {
      case "mbti":
        query.mbti = { $exists: true, $ne: null };
        break;
      case "zodiac":
        query.zodiac = { $exists: true, $ne: null };
        break;
      case "enneagram":
        query.enneagram = { $exists: true, $ne: null };
        break;
      // No filter or unknown filter parameter, fetch all comments
      default:
        break;
    }

    // default to most number of likes
    const options = {
      sort: { likes: -1 },
    };

    if (sortBy === "date") {
      options.sort = { createdAt: -1 };
    }
    const comments = await Comment.find(query, null, options);

    res.status(200).json({ comments, message: "Comments found" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createComment,
  likeComment,
  unlikeComment,
  getCommentsByProfileId,
};
