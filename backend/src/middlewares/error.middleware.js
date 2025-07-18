const config = require('../config');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Hanya error operasional yang kita percaya untuk dikirim ke klien
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  } else {
    // 1) Catat error ke konsol
    console.error('ERROR 💥', err);
    // 2) Kirim respons generik
    res.status(500).json({
      success: false,
      error: 'Something went very wrong!',
    });
  }
};

exports.errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (config.env === 'development') {
    sendErrorDev(err, res);
  } else {
    // Handle error spesifik dari Prisma atau lainnya di sini jika perlu
    sendErrorProd(err, res);
  }
};