const TestSequencer = require('@jest/test-sequencer').default;

class CustomSequencer extends TestSequencer {
  sort(tests) {
    // Custom ordering of tests
    return tests.sort((a, b) => {
      if (a.path.includes('consumer')) return -1; // Run consumer tests first
      if (b.path.includes('consumer')) return 1;
      return 0;
    });
  }
}

module.exports = CustomSequencer;
