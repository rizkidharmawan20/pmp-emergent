const express = require('express');
const authRoutes = require('./auth.routes');
const challengeRoutes = require('./challenge.routes');
const userRoutes = require('./user.routes'); // <-- TAMBAHKAN INI
const walletRoutes = require('./wallet.routes'); // <-- TAMBAHKAN INI

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/challenges', challengeRoutes);
router.use('/users', userRoutes); // <-- TAMBAHKAN INI
router.use('/wallet', walletRoutes); // <-- TAMBAHKAN INI

module.exports = router;