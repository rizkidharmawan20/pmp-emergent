const AppError = require("../utils/AppError");

// Mock service. In a real app, this would use a scraping library or a 3rd party API.
exports.getVideoInfo = async (videoUrl) => {
    let platform = '';
    
    if (videoUrl.includes('instagram.com')) {
        platform = 'instagram';
    } else if (videoUrl.includes('tiktok.com')) {
        platform = 'tiktok';
    } else {
        throw new AppError('Invalid video URL. Only Instagram and TikTok are supported.', 400);
    }

    return {
        platform,
        // Mengembalikan URL placeholder untuk thumbnail
        thumbnailUrl: `https://via.placeholder.com/400x250.png?text=Video+Thumbnail`
    };
};