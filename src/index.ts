

import express, { Request, Response } from 'express';

import parentRouter from '@/parentRoutes/index';
import { errorHandler } from '@/shared/middleware/middleware.error';

const app = express();

app.use(express.json());

// Use parent router for API routes

app.use(parentRouter);


app.get('/', (req: Request, res: Response) => {
  res.send('Server is running');
});

// Error handler middleware (should be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));