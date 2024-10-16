module.exports = {
  roots: ['<rootDir>/__tests__'],
  transform: {
    '.(ts|tsx)': ['@swc/jest']
  },
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  testPathIgnorePatterns: [
    '(/__tests__/.*/testEvents.ts)$',
    '(/__tests__/.*/test-events.ts)$'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testEnvironment: 'node',
  moduleNameMapper: {
    "^@common(.*)$": "<rootDir>/src/common$1"
  }
};
