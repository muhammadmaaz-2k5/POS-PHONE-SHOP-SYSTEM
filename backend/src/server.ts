import 'dotenv/config';
import app from './app';
import prisma from './config/prisma';

const PORT = parseInt(process.env.PORT ?? '5000', 10);

const start = async (): Promise<void> => {
  try {
    // Test DB connection
    await prisma.$connect();
    console.log('✅ PostgreSQL connected via Prisma');

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/health`);
    });

    // Graceful shutdown
    const shutdown = async (signal: string): Promise<void> => {
      console.log(`\n${signal} received — shutting down gracefully...`);
      server.close(async () => {
        await prisma.$disconnect();
        console.log('✅ DB disconnected. Goodbye.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    process.on('unhandledRejection', (err: Error) => {
      console.error(`❌ Unhandled Rejection: ${err.message}`);
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

start();
