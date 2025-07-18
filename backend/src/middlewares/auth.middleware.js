const { PrismaClient } = require('@prisma/client');
const AppError = require('../utils/AppError');
const { verifyToken } = require('../utils/jwt');

const prisma = new PrismaClient();

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in to get access.', 401)
      );
    }

    // Verifikasi token
    const decoded = verifyToken(token);

    // Cek apakah pengguna masih ada
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    if (!currentUser) {
      return next(
        new AppError(
          'The user belonging to this token does no longer exist.',
          401
        )
      );
    }

    // Berikan akses ke rute yang dilindungi
    req.user = currentUser;
    next();
  } catch (error) {
    // Menangani error token expired atau invalid
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return next(new AppError('Invalid or expired token. Please log in again.', 401));
    }
    next(error);
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};