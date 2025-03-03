// Configure Jest to run the tests
module.exports = {
    testEnvironment: 'node',
    //testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
    testMatch: ['**/tests/*.spec.js'],
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
    },
    moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
    testSequencer: './testSequencer.js' // Since consumer side tests needs to be run before provider side tests
};