/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import * as zod from 'zod';
import { User, UserSchema } from './User';

function validateUser(user: Record<string, any>): User {
  try {
    UserSchema.parse(user);

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

export const handler = async (event: Record<string, any>): Promise<any> => {
  console.log(JSON.stringify({ event }, null, 2));
  const user = validateUser(event);
  console.log(JSON.stringify({ validatedUser: user }, null, 2));
};
