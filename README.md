# Contract Testing suite CI integrated
This is a **CI integrated, report generating automated contract testing suite** which uses public APIs.

**Steps to run the tests**-
1. Clone the repo.
2. Run command 'npm install'
3. Run command 'npm run test'
4. Notice that the test runs now.

**Test execution:**
The Consumer side tests runs first and when completed created a contract file (Pact) in the `pacts` folder in the root directory.
The provider side tests then picks the contract file and runs its test.

While you can see the test results on the terminal, test reports are also generated post test execution under results folder. 
View the test-report.html file for report, i.e., copy the path of the file after right clicking on it and paste the path in a browser.
