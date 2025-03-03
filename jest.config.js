// Configure Jest to run the tests
export default {
    testEnvironment: 'node',
    //testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
    testMatch: ['**/tests/*.spec.js'],
    // transform: {
    //     '^.+\\.jsx?$': 'babel-jest',
    // },
    transform: {},
    moduleFileExtensions: ['js', 'jsx', 'json', 'node','mjs', 'cjs'],
    testSequencer: './testSequencer.cjs' // Since consumer side tests needs to be run before provider side tests
};