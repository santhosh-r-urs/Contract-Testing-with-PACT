export default {
    testEnvironment: 'node',
    testMatch: ['**/tests/*.spec.js'],
    transform: {},
    moduleFileExtensions: ['js', 'jsx', 'json', 'node','mjs', 'cjs'],
    testSequencer: './testSequencer.cjs', // Since consumer side tests needs to be run before provider side tests
    reporters: [
        "default",
        ["jest-junit", { outputDirectory: "results/jest", outputName: "junit.xml" }],
        ["jest-html-reporters", { publicPath: "./results/jest", filename: "test-report.html", expand: true }],
      ]
};