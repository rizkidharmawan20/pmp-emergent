const express = require('express');
const userController = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// Semua rute di bawah ini dilindungi oleh middleware 'protect'
router.use(protect);

router.get('/me', userController.getProfile);
router.put('/me', userController.updateProfile);
router.post('/me/social', userController.connectSocialAccount);


module.exports = router;