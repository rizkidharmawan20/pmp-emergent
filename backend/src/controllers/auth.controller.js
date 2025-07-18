const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/AppError');
const { signToken } = require('../utils/jwt');

const prisma = new PrismaClient();

const createSendToken = (user, statusCode, res) => {
    const token = signToken({ id: user.id });

    // Hapus password dari output
    const { password, ...userWithoutPassword } = user;

    res.status(statusCode).json({
        success: true,
        token,
        user: userWithoutPassword,
    });
};

exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return next(new AppError('Please provide name, email, password, and role', 400));
        }

        if (role.toUpperCase() !== 'CREATOR' && role.toUpperCase() !== 'CLIPPER') {
            return next(new AppError('Role must be either CREATOR or CLIPPER', 400));
        }
        
        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role.toUpperCase(),
            },
        });

        createSendToken(newUser, 201, res);
    } catch (error) {
        // Handle error jika email sudah ada (Prisma unique constraint)
        if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
            return next(new AppError('Email already exists.', 400));
        }
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new AppError('Please provide email and password', 400));
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return next(new AppError('Incorrect email or password', 401));
        }
        
        createSendToken(user, 200, res);
    } catch (error) {
        next(error);
    }
};