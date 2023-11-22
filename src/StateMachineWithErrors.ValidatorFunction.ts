/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
import * as zod from 'zod';

const userSchema = zod.object({
  name: zod.string(),
  age: zod.number().min(0),
  email: zod.string().email(),
});

export const handler = async (event: Record<string, any>): Promise<any> => {
  console.log(JSON.stringify({ event }, null, 2));
  validateUser(event);
};

function validateUser(user: any): void {
  try {
    userSchema.parse(user);

    if (user.age < 18) {
      console.error('Age must not be less than 18');
      const thrownError = new Error('InvalidContent');
      thrownError.name = 'InvalidContent';
      throw thrownError;
    }
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
