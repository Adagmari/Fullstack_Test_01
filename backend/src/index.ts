import { createApp } from './app';
import { AppDataSource } from './data-source';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log('DB connected');
    const app = createApp();
    app.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`);
      console.log(`Swagger: http://localhost:${PORT}/docs`);
    });
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
    process.exit(1);
  });
