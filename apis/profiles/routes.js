const express = require('express');
const router = express.Router();
const profileController = require('./controller');

router.post('/', profileController.createProfile);
router.get('/:id', profileController.getProfileById);
router.get('/', profileController.getAllProfiles);

module.exports = router;
