import jwt from 'jsonwebtoken';

export default function generateJwt(userId: string): string {
  const privateKey = String(process.env.APP_SECRET);
  const token = jwt.sign({ userId }, privateKey, {
    subject: userId,
    expiresIn: '10h', // expires in 5min
  });
  return token;
}
