const express = require('express');
const router = express.Router();
const commentController = require('./controller');

router.post('/', commentController.createComment);
router.put('/:commentId/like', commentController.likeComment);
router.put('/:commentId/unlike', commentController.unlikeComment);
router.get('/profile/:profileId', commentController.getCommentsByProfileId);

module.exports = router;
