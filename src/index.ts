

import express, { Request, Response } from 'express';


import parentRouter from '@/parentRoutes/index';
import { errorHandler } from '@/shared/middleware/middleware.error';
import { sendWelcomeEmail } from '@/module/company/service/service.email';

const app = express();

app.use(express.json());

// Use parent router for API routes


app.use(parentRouter);

// Test route to trigger welcome email
app.get('/test-email', async (req: Request, res: Response) => {
  try {
    await sendWelcomeEmail();
    res.status(200).send('Test email sent (check logs for details)');
  } catch (error) {
    res.status(500).send('Failed to send test email');
  }
});


app.get('/', (req: Request, res: Response) => {
  res.send('Server is running');
});

// Error handler middleware (should be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));