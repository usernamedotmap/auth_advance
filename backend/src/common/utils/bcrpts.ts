
import bcrypt from 'bcryptjs';

export const hashedValue = async (value: string, saltRounds: number = 10) => 
    await bcrypt.hash(value, saltRounds);

export const compareValue = async (value: string, hashedValue: string) =>
    await bcrypt.compare(value, hashedValue);
