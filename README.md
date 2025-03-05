# Contract Testing suite
This is a **CI integrated, report generating, automated contract testing suite**

**Steps to run the tests locally:**
1. Clone the repo.
2. Run command 'npm install'
3. Run command 'npm run test'
4. Notice that the test runs now.

**Viewing reports locally:**
While you can see the test results on the terminal, test reports are also generated post test execution under results folder. 
View the test-report.html file for report, i.e., copy the path of the file after right clicking on it and paste the path in a browser.

**Steps to run the test from GitHub Actions:**
1. Visit 'Actions' tab of the repo.
2. Select 'Run Contract tests on pipeline' on the left hand side 'Actions' list.
3. Click the 'Run workflow' button on the right hand side.
4. Select the branch('main' is default), click 'Run workflow' button on the dialog.

**Viewing reports of test run on pipeline:**
1. In the same 'Actions' page, click on the test run under the workflow runs list.
2. In the run's page, notice the 'Artifacts' section.
3. Click download button for the 'jest-html-report', a zip file gets downloaded.
4. Unzip and open the folder and double click the 'test-report.html' file to view the report.

**Sample report:**


<img width="1398" alt="Screenshot 2025-03-05 at 14 04 29" src="https://github.com/user-attachments/assets/9c28394c-0ebc-4ad8-aa8e-e9224943d774" />


**Test execution flow:**
The Consumer side tests runs first and when completed creates a contract file (Pact) in the `pacts` folder in the root directory.
The provider side tests then picks the contract file and runs its test i.e., verifies all the interactions in the contract file.
Thus verifying the API works as expected both the sides.

**Tools used:** 
**Jest** for running tests and reporting, 
**Pact** for contract testing, 
**Github Actions and Workflows** to run the tests on CI pipeline, 
Axios to make http & https calls

The tests are run on public APIs available here https://restful-api.dev/
