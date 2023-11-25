/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import { validateUser } from './common';

export const handler = async (event: Record<string, any>): Promise<any> => {
  console.log(JSON.stringify({ event }, null, 2));
  const user = validateUser(event);
  console.log(JSON.stringify({ validatedUser: user }, null, 2));
};
