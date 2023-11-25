/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
import * as zod from 'zod';

export interface User {
  name: string;
  age: number;
  email: string;
}

export const UserSchema = zod.object({
  name: zod.string(),
  age: zod.number().min(0),
  email: zod.string().email(),
});
