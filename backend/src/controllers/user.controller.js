const { PrismaClient } = require('@prisma/client');
const AppError = require('../utils/AppError');

const prisma = new PrismaClient();

// Mendapatkan profil pengguna yang sedang login
exports.getProfile = async (req, res, next) => {
    // Middleware 'protect' sudah menyediakan req.user
    res.status(200).json({
        success: true,
        data: req.user,
    });
};

// Memperbarui profil pengguna
exports.updateProfile = async (req, res, next) => {
    try {
        const { name, avatar } = req.body;
        const userId = req.user.id;

        // Filter data yang boleh diupdate
        const dataToUpdate = {};
        if (name) dataToUpdate.name = name;
        if (avatar) dataToUpdate.avatar = avatar;

        if (Object.keys(dataToUpdate).length === 0) {
            return next(new AppError('No data provided for update', 400));
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: dataToUpdate,
        });
        
        // Hapus password dari output
        const { password, ...userWithoutPassword } = updatedUser;

        res.status(200).json({
            success: true,
            user: userWithoutPassword,
        });
    } catch (error) {
        next(error);
    }
};

// Menghubungkan akun sosial (simulasi)
exports.connectSocialAccount = async (req, res, next) => {
    try {
        const { platform } = req.body;
        const userId = req.user.id;

        if (!platform || (platform !== 'instagram' && platform !== 'tiktok')) {
            return next(new AppError("Platform must be 'instagram' or 'tiktok'", 400));
        }

        // Dalam aplikasi nyata, ini akan menjadi alur OAuth yang kompleks.
        // Di sini kita hanya mensimulasikan koneksi yang berhasil.
        const existingConnections = req.user.socialConnections || {};
        const updatedConnections = {
            ...existingConnections,
            [platform]: {
                connected: true,
                username: `simulated_${platform}_user`,
                connectedAt: new Date().toISOString(),
            }
        };

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { socialConnections: updatedConnections },
        });

        const { password, ...userWithoutPassword } = updatedUser;

        res.status(200).json({
            success: true,
            user: userWithoutPassword,
        });

    } catch (error) {
        next(error);
    }
};