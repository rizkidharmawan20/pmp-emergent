const { PrismaClient } = require('@prisma/client');
const AppError = require('../utils/AppError');

const prisma = new PrismaClient();

exports.getWalletBalance = async (req, res, next) => {
    res.status(200).json({
        success: true,
        balance: req.user.walletBalance,
        payoutBalance: req.user.payoutBalance,
    });
};

exports.listTransactions = async (req, res, next) => {
    try {
        const transactions = await prisma.transaction.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
        });

        res.status(200).json({
            success: true,
            data: transactions,
        });
    } catch (error) {
        next(error);
    }
};

exports.topUpWallet = async (req, res, next) => {
    try {
        const { amount, method } = req.body;
        const userId = req.user.id;

        if (!amount || amount < 10000) {
            return next(new AppError('Top-up amount must be at least 10,000', 400));
        }
        
        // Di aplikasi nyata, Anda akan membuat transaksi dengan status PENDING,
        // lalu mengintegrasikan dengan payment gateway (Midtrans/Xendit).
        // Setelah pembayaran berhasil (via webhook), baru status diubah ke COMPLETED dan saldo diperbarui.
        // Di sini kita simulasikan transaksi yang langsung berhasil.
        
        const result = await prisma.$transaction(async (tx) => {
            const transaction = await tx.transaction.create({
                data: {
                    userId,
                    amount,
                    type: 'TOPUP',
                    description: `Wallet Top-up via ${method}`,
                    status: 'COMPLETED',
                }
            });

            const updatedUser = await tx.user.update({
                where: { id: userId },
                data: {
                    walletBalance: {
                        increment: amount,
                    },
                },
            });

            return { transaction, updatedUser };
        });

        res.status(201).json({
            success: true,
            transaction: result.transaction,
            balance: result.updatedUser.walletBalance,
        });

    } catch (error) {
        next(error);
    }
};


exports.requestPayout = async (req, res, next) => {
    try {
        const { amount, bankAccount } = req.body;
        const userId = req.user.id;
        
        if (!amount || amount < 10000) {
            return next(new AppError('Payout amount must be at least 10,000', 400));
        }

        if (amount > req.user.payoutBalance) {
            return next(new AppError('Payout amount exceeds available payout balance', 400));
        }

        const result = await prisma.$transaction(async (tx) => {
            // 1. Kurangi saldo payout pengguna
            const updatedUser = await tx.user.update({
                where: { id: userId },
                data: {
                    payoutBalance: {
                        decrement: amount,
                    }
                }
            });

            // 2. Buat record transaksi payout dengan status PENDING
            const transaction = await tx.transaction.create({
                data: {
                    userId,
                    amount,
                    type: 'PAYOUT',
                    description: `Payout to bank account ${bankAccount}`,
                    status: 'PENDING', // Admin perlu memproses ini secara manual/otomatis
                }
            });

            return { transaction, updatedUser };
        });

        res.status(201).json({
            success: true,
            transaction: result.transaction,
            payoutBalance: result.updatedUser.payoutBalance,
        });

    } catch (error) {
        next(error);
    }
};