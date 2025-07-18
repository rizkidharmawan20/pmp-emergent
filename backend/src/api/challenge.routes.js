const express = require('express');
const challengeController = require('../controllers/challenge.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

const router = express.Router();

// Semua rute di bawah ini dilindungi
router.use(protect);

router
    .route('/')
    .post(restrictTo('CREATOR'), challengeController.createChallenge);
    // .get(challengeController.getAllChallenges); // Anda bisa tambahkan ini

router
    .route('/:id/submissions')
    .post(restrictTo('CLIPPER'), challengeController.submitToChallenge);

module.exports = router;