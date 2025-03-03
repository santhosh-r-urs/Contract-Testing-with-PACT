const Sequencer = require('@jest/test-sequencer').default;

// In this example, the CustomSequencer class extends the default Sequencer class from Jest. The sort method is overridden to sort the tests based on the path of the test files. If the path includes 'consumer', the test is moved to the beginning of the list. This ensures that consumer tests are run before provider tests.
class CustomSequencer extends Sequencer {
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