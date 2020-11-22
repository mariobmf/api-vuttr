import { hash } from 'bcryptjs';

export default async function generateHashPassword(
  password: string
): Promise<string> {
  const passwordHash = await hash(password, 8);
  return passwordHash;
}
