import { sendEmail } from '@/shared/utils/utils.email';

export async function sendWelcomeEmail() {
  await sendEmail({
    to: 'itzguptarohit45@gmail.com',
    subject: 'Welcome!',
    text: 'Hello, welcome to our service!',
  });
}