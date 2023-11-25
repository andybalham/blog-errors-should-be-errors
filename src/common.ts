/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
import * as zod from 'zod';

interface User {
  name: string;
  age: number;
  email: string;
}

const userSchema = zod.object({
  name: zod.string(),
  age: zod.number().min(0),
  email: zod.string().email(),
});

export function validateUser(user: Record<string, any>): User {
  try {
    userSchema.parse(user);

    if (user.age < 18) {
      console.error('Age must not be less than 18');
      const thrownError = new Error('InvalidContent');
      thrownError.name = 'InvalidContent';
      throw thrownError;
    }

    return user as User;
  } catch (error) {
    if (error instanceof zod.ZodError) {
      console.error('Invalid user:', error.errors);
      const thrownError = new Error('InvalidFormat');
      thrownError.name = 'InvalidFormat';
      throw thrownError;
    } else {
      throw error;
    }
  }
}
