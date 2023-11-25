/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  roots: ['<rootDir>/tests'],
  preset: 'ts-jest',
  testEnvironment: 'node',  
  globals: {
    crypto: {
      randomUUID: () => require('crypto').randomUUID(),
    },
  },
};
