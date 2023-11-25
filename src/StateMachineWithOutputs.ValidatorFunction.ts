/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import * as zod from 'zod';
import { ZodIssue } from 'zod';
import { User, UserSchema } from './User';

interface ValidationResult {
  user?: User;
  formatErrors?: ZodIssue[];
  contentErrors?: string[];
}

function validateUser(user: Record<string, any>): ValidationResult {
  try {
    UserSchema.parse(user);

    if (user.age < 18) {
      console.error('Age must not be less than 18');
      return {
        contentErrors: ['too_young'],
      };
    }

    return {
      user: user as User,
    };
  } catch (error) {
    if (error instanceof zod.ZodError) {
      console.error('Invalid user:', error.errors);
      return {
        formatErrors: error.errors,
      };
    }
    throw error;
  }
}

export const handler = async (
  event: Record<string, any>
): Promise<ValidationResult> => {
  console.log(JSON.stringify({ event }, null, 2));
  return validateUser(event);
};
