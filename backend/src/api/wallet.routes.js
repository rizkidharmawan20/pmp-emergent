const express = require('express');
const walletController = require('../controllers/wallet.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// Semua rute di bawah ini dilindungi dan memerlukan login
router.use(protect);

router.get('/balance', walletController.getWalletBalance);
router.get('/transactions', walletController.listTransactions);
router.post('/topup', walletController.topUpWallet);
router.post('/payout', walletController.requestPayout);

module.exports = router;