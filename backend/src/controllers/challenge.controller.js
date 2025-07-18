const { PrismaClient } = require('@prisma/client');
const AppError = require('../utils/AppError');
const { getVideoInfo } = require('../services/video.service');

const prisma = new PrismaClient();

exports.createChallenge = async (req, res, next) => {
    try {
        // Asumsi: middleware otentikasi sudah menaruh user di req.user
        if (req.user.role !== 'CREATOR') {
            return next(new AppError('Only creators can create challenges', 403));
        }

        const { title, description, rules, budget, rewardRate, startDate, endDate, category, tags, targetPlatform, mediaUrl } = req.body;
        
        // Validasi dasar
        if (!title || !description || !budget || !rewardRate || !startDate || !endDate) {
            return next(new AppError('Please provide all required fields', 400));
        }

        const challenge = await prisma.challenge.create({
            data: {
                title,
                description,
                rules,
                budget,
                rewardRate,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                category,
                tags,
                targetPlatform,
                mediaUrl,
                creatorId: req.user.id,
            }
        });

        res.status(201).json({
            success: true,
            data: challenge
        });
    } catch (error) {
        next(error);
    }
};

exports.submitToChallenge = async (req, res, next) => {
    try {
        const { id: challengeId } = req.params;
        const { videoUrl, caption } = req.body;
        
        if (!videoUrl) {
            return next(new AppError('Video URL is required', 400));
        }

        const challenge = await prisma.challenge.findUnique({ where: { id: challengeId } });
        if (!challenge) {
            return next(new AppError('Challenge not found', 404));
        }

        // Ambil info video (platform & thumbnail)
        const videoInfo = await getVideoInfo(videoUrl);

        // Validasi platform
        if (challenge.targetPlatform !== 'ANY' && challenge.targetPlatform !== videoInfo.platform.toUpperCase()) {
            return next(new AppError(`This challenge is only for ${challenge.targetPlatform}`, 400));
        }

        const submission = await prisma.submission.create({
            data: {
                videoUrl,
                caption,
                platform: videoInfo.platform.toUpperCase(),
                thumbnailUrl: videoInfo.thumbnailUrl,
                challengeId,
                userId: req.user.id,
            }
        });

        res.status(201).json({
            success: true,
            data: submission
        });
    } catch (error) {
        next(error);
    }
};