const app = require('./app');
const config = require('./config');

const server = app.listen(config.port, () => {
  console.log(`App running on port ${config.port} in ${config.env} mode...`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});